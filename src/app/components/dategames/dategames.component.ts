import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from "@angular/router";
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import * as _ from 'underscore';
import { StoreService } from '../../services/store.service';
//import { ChatService } from '../../services/chat.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-date-games',
  templateUrl: './dategames.component.html',
  styleUrls: ['./dategames.component.css']
})
export class DateGamesComponent implements OnInit, OnDestroy {
  chatMessage;
  subscription: Subscription;
  chatMessages = [];
  private routeSub: Subscription;

  title = 'NHL Schedules';
  public scheduledGames: Observable<any[]>;
  public homePerformance: Observable<any[]>;
  public awayPerformance: Observable<any[]>;
  public gameEvents: Observable<any[]> | null;
  public selectedGame;
  public isPlayingOnServer = false;
  public selectedDate;
  public gameDate: Observable<[]>;
  public searchTerm;
  public startDate;
  private username;
  private initialDate;

  private $inputMessage = $('.inputMessage');
  private $usernameInput = $('.usernameInput');
  private $loginPage = $('.login.page');
  private $chatPage = $('.chat.page');
  private $currentInput = this.$usernameInput.focus();

  @HostListener('window:keyup', ['$event']) w(event: KeyboardEvent) {
    if (!(event.ctrlKey || event.metaKey || event.altKey)) {
      this.$currentInput.focus();
    }

    if (event.which === 13) {
      if (this.username) {
        this.sendMessage();
      } else {
        this.setUsername();
      }
    }
  }
  setUsername = () => {
    this.username = this.$usernameInput.val();

    // If the username is valid
    if (this.username) {
      this.$loginPage.fadeOut();
      this.$chatPage.show();
      this.$loginPage.off('click');
      this.$currentInput = this.$inputMessage.focus();

      // Tell the server your username
      //this.chatService.login(this.username);
    }
  }
  sendMessage() {
    var message = this.$inputMessage.val();
    console.log("sendButtonClicked...", message);
    //this.chatService.sendMessage("msg:" + message);
  }

  constructor(
    private route: ActivatedRoute,
    private storeService: StoreService/*,
    private chatService: ChatService*/
  ) {
  }
  initData() {
    console.log("initData", this.initialDate)
    this.selectedDate = this.initialDate;
    this.searchTerm = this.selectedDate.toISOString().slice(0, 10);
    this.gameDate = this.searchTerm;
    var start = new Date(this.selectedDate);
    start.setDate(start.getDate() - 120);
    this.startDate = start.toISOString().slice(0, 10);

    /*this.chatService.onNewMessage().subscribe(msg => {
      console.log('got a msg: ' + msg);
    });*/

    var metadata = {
      "table": "vNHLGames",
      "where": [JSON.stringify([{ "gameDate = ": this.searchTerm }])],
      "order": "gamePk"
    };

    this.storeService.selectAll(metadata)
      .subscribe((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.Response:
            this.scheduledGames = _.uniq(event.body, "gamePk");
        }
      }),
      err => {
        console.log("Error occured.")
      };
  }

  selectDate(change: any) {
    var d = new Date(this.selectedDate);
    var start = new Date(this.selectedDate);
    d.setDate(d.getDate() + change);
    start.setDate(start.getDate() - 120);

    this.selectedDate = d;
    console.log("setting gameDate");
    this.searchTerm = this.selectedDate.toISOString().slice(0, 10);
    this.gameDate = this.searchTerm;
    this.startDate = start.toISOString().slice(0, 10);
    this.gamesOnDate();
  }

  gamesOnDate() {
    this.selectedGame = null;

    var metadata = {
      "table": "NHLGame",
      "where": [JSON.stringify([{ "gameDate = ": this.searchTerm }])],
      "order": "gamePk"
    };

    this.storeService.selectAll(metadata)
      .subscribe((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.Response:
            this.scheduledGames = event.body;
        }
      }),
      err => {
        console.log("Error occured.")
      };
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.routeSub.unsubscribe();
  }

  ngOnInit() {
    console.log("ngOnInit")
    this.routeSub = this.route.params.subscribe(params => {
      var paramId = params['id'];
      if (paramId) {
        let selectedDate = new Date(paramId);
        selectedDate.setUTCHours(0, 0, 0, 0);
        this.initialDate = selectedDate
        console.log("initialDate is ", this.initialDate)
      }
      else {
        let selectedDate = new Date();
        selectedDate.setUTCHours(0, 0, 0, 0);
        this.initialDate = selectedDate;
        console.log("initialDate is ", this.initialDate)
      }
      this.initData();
    });
  }

  gameSelected(game: any) {
    this.selectedGame = game;
    this.gameEvents = null;
    this.fetchHomePerformance(game);
    this.fetchAwayPerformance(game);
    this.fetchGameEvents(game);
    game.homeGameInfo = "";
    game.awayGameInfo = "";
    /*
    console.log("this.isPlayingOnServer", this.isPlayingOnServer);
    if (this.isPlayingOnServer) {
      this.stopAudioOnServer();
    }
    else {
      this.startAudioOnServer();
    }
    this.isPlayingOnServer = !this.isPlayingOnServer;
    */
  }

  fetchHomePerformance(game: any) {
    var metadata = {
      "table": "vPerformanceMA",
      "where": [JSON.stringify([{ "team = ": game.homeTeamName }, { "gameDate < ": this.searchTerm }, { "gameDate > ": this.startDate }])],
      "order": "row_num desc"
    };


    this.storeService.selectAll(metadata)
      .subscribe((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.Response:
            this.homePerformance = event.body;
            if (this.homePerformance) {
              var preGame = this.homePerformance[0];
              var days = this.daysBetween(game.gameDate, preGame.gameDate);
              game.homeGameInfo = preGame.location + (days - 1) + preGame.outcome + ' ' + preGame.finalScore;
            }
            else {
              game.homeGameInfo = "n/a";
            }
        }
      }),
      err => {
        console.log("Error occured.")
      };
  }
  fetchAwayPerformance(game: any) {
    var metadata = {
      "table": "vPerformanceMA",
      "where": [JSON.stringify([{ "team = ": game.awayTeamName }, { "gameDate < ": this.searchTerm }, { "gameDate > ": this.startDate }])],
      "order": "row_num desc"
    };

    this.storeService.selectAll(metadata)
      .subscribe((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.Response:
            this.gameDate = this.searchTerm;
            this.awayPerformance = event.body;
            if (this.awayPerformance) {
              var preGame = this.awayPerformance[0];
              var days = this.daysBetween(game.gameDate, preGame.gameDate);
              game.awayGameInfo = preGame.location + (days - 1) + preGame.outcome + ' ' + preGame.finalScore;
            }
            else {
              game.awayGameInfo = "n/a";
            }
        }
      }),
      err => {
        console.log("Error occured.")
      };
  }
  fetchGameEvents(game: any) {
    var metadata = {
      "table": "vGameEventsNHL",
      "where": [JSON.stringify([{ "gamePk = ": game.gamePk }])]
    };

    this.storeService.selectAll(metadata)
      .subscribe((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.Response:
            this.gameEvents = event.body;
          //console.log(this.gameEvents)
        }
      }),
      err => {
        console.log("Error occured.")
      };
  }
  daysBetween(date1, date2) {
    var from = new Date(date1);
    var to = new Date(date2);
    var timeDiff = Math.abs(from.getTime() - to.getTime());
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }
}
