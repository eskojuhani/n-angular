import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from "@angular/router";
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import * as _ from 'underscore';
import { AppComponent } from '../../app.component';
import { NHLService } from '../../services/nhl.service';
import { StoreService } from '../../services/store.service';
import * as $ from 'jquery';
import { Team } from './team';
import { memo } from './memo';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})

export class TeamsComponent implements OnInit, OnDestroy {

  //public teams: Observable<any[]>;
  teams = new Array<Team>();
  //public nextScheduledGames: Observable<any[]>;
  nextScheduledGames = new Array<any>();
  public teamId;
  //public homePerformance: Observable<any[]>;
  homePerformance = new Array<any>();
  private routeSub: Subscription;
  count = 0;
  
  onMouseEnter(game) {
    console.log("onMouseEnter:", game);
    this.fetchTeamShortHistory(game);
  }

  plusOne = memo((count: number) => count + 1);

  constructor(
    private app: AppComponent,
    private route: ActivatedRoute,
    private storeService: StoreService,
    private nhlService: NHLService,
  ) {
    /*console.log(app.nhlTeamList)
    nhlService.fetch('teams')
      .subscribe((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.Response:
            this.nhlTeams = event.body;
        }
      }),
      err => {
        console.log("Error occured.")
      };*/
  }

  initData() {
    if (this.teamId) {
      this.fetchTeamPerformance(this.teamId);
      this.fetchNextScheduledGame(this.teamId);
    }
    else {
      this.fetchTeams()
    }
  }

  getDivisionAndConverence(teamId) {
    try {
      let team = this.app.nhlTeamList.find(item => item.teamId == teamId)
      if (team) {
          return team.division.charAt(0) + " " + team.conference.charAt(0)
      };
    }
    catch (e) {

    }
    return "";
  }
  getStyleForDivisionAndConverence(teamId, oppoId, score) {
    let teamDC = this.getDivisionAndConverence(teamId);
    let oppoDC = this.getDivisionAndConverence(oppoId);

    let scores = score.split("-")
    let color = parseInt(scores[0]) > parseInt(scores[1]) ? 'green' : 'red';
    if (teamDC?.charAt(2) === oppoDC?.charAt(2)) {
      if (teamDC?.charAt(0) === oppoDC?.charAt(0)) {
        return "3px solid " + color;
      }
      return "1px solid " + color;
    }

    return "none";
  }

  fetchTeams() {
    var metadata = {
      "table": "NHLTeams",
      "order": "name"
    };

    this.storeService.selectAll(metadata)
      .subscribe(response => {
        if (response)
          this.teams = response;
      }),
      err => {
        console.log("Error occured.")
      };
  }
  fetchNextScheduledGame(teamId) {
    console.log("fetchNextScheduledGame:", teamId);
    var metadata = {
      "table": "vScheduledGames",
      "where": [JSON.stringify([{ "teamId = ": teamId }])],
      "order": "gameDate desc"
    };


    this.storeService.selectAll(metadata)
      .subscribe(response => {
        if (response)
          this.nextScheduledGames = response;
      }),
      err => {
        console.log("Error occured.")
      };
  }

  fetchTeamPerformance(teamId) {
    console.log("fetchTeamPerformance:", teamId);
    var metadata = {
      "table": "vPerformanceMA",
      "where": [JSON.stringify([{ "teamId = ": teamId }, { "season = ": '2022-2023'}])],
      "order": "row_num desc"
    };


    this.storeService.selectAll(metadata)
      .subscribe(response => {
        if (response)
          this.homePerformance = response;
      }),
      err => {
        console.log("Error occured.")
      };
  }

  fetchTeamShortHistory(game) {
    if (game.history)
      return;

    var metadata = {
      "table": "vPerformanceMA",
      "where": [JSON.stringify([
        { "teamId = ": game.oppoId }, 
        { "season = ": '2022-2023' },
        { "gameDate < ": game.gameDate },
        { "gameDate > ": this.dayAddition(game.gameDate, -14) }
      ])],
      "order": "row_num desc"
    };
    //console.log("fTSJH.where:", metadata.where);
    
    this.storeService.selectAll(metadata)
      .subscribe(response => {
        if (response) {
          console.log(response);
          //game.history = response.reverse();
        }
      }),
      err => {
        console.log("Error occured.")
      };
  }
  
  dayAddition(date, days) {
    var from = new Date(date);
    from.setDate(from.getDate() + days);

    return from.toISOString().slice(0, 10);
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      var paramId = params['id'];
      if (paramId) {
        this.teamId = paramId
      }
      else {
        this.teamId = undefined
      }
      this.initData()
    })
  }
}
