import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from "@angular/router";
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import * as _ from 'underscore';
import { AppComponent } from '../app.component';
import { StoreService } from '../services/store.service';

import * as $ from 'jquery';
@Component({
  selector: 'app-crosstab',
  templateUrl: './crosstab.component.html',
  styleUrls: ['./crosstab.component.css']
})
export class CrosstabComponent implements OnInit {
  crosstab = new Array<any>();
  teamIds = new Array<string>('ANA','BOS','BUF','CAR','CBJ','CGY','CHI','COL','DAL','DET','EDM','FLA','LAK','MIN','MTL','NJD','NSH','NYI','NYR','OTT','PHI','PIT','SEA','SJS','STL','TBL','TOR','UTA','VAN','VGK','WPG','WSH');
  dAtlantic = new Array<string>('BOS','BUF','DET','FLA','MTL','OTT','TBL','TOR');
  dMetro = new Array<string>('CAR','CBJ','NJD','NYI','NYR','PHI','PIT','WSH');
  dCentral = new Array<string>('CHI','COL','DAL','MIN','NSH','STL','UTA','WPG');
  dPacific = new Array<string>('ANA','CGY','EDM','LAK','SEA','SJS','VAN','VGK');
  constructor(
    private app: AppComponent,
    private route: ActivatedRoute,
    private storeService: StoreService
  ) {

  }
  selectedDivision = "";
  selectedHome = "Atlantic";
  selectedAway = "Metro";

  setDivision(e) {
    console.log("this.setDivision:", e.target.value, e);
  }
  ngOnInit() {
    console.log("ngOnInit")
    this.fetchData();
  }

  fetchData() {
    console.log("fetchData")
    var metadata = {
      "table": "vCrossTab"
    };


    this.storeService.selectAll(metadata)
      .subscribe(response => {
        if (response)
          this.crosstab = response;
      }),
      err => {
        console.log("Error occured.")
      };
  }

  crossPercentage(cross_value) {
    if (cross_value == null)
      return "";

    var cross_array = cross_value.split(",");
    var sum = cross_array.reduce((a, b) => a + parseInt(b), 0);

    return Math.trunc((100 * sum) / cross_array.length);
  }

  crossPercentageCSS(cross_value) {
    if (cross_value == null)
      return "";

    var cross_array = cross_value.split(",");
    var sum = cross_array.reduce((a, b) => a + parseInt(b), 0);

    var perc = Math.trunc((100 * sum) / cross_array.length);
    if (perc == 100)
      return "cv-100"
    else if (perc == 0)
      return "cv-0"
    else
      return "cv-50";
  }

  isSelected(teamId, cross_value = -1, location) {
    var cpCss = "";
    if (cross_value !== -1) 
      cpCss = this.crossPercentageCSS(cross_value);
    
    if (this.selectedDivision === "")
      return cpCss + " row-visible"

    var contains = false
    switch (this.selectedDivision) {
      case 'E':
        contains = this.dMetro.includes(teamId) || this.dAtlantic.includes(teamId);
        break;
      case 'W':
        contains = this.dCentral.includes(teamId) || this.dPacific.includes(teamId);
        break;
      case 'M':
        contains = this.dMetro.includes(teamId);
        break;
      case 'A':
        contains = this.dAtlantic.includes(teamId);
        break;
      case 'C':
        contains = this.dCentral.includes(teamId);
        break;
      case 'P':
        contains = this.dPacific.includes(teamId);
        break;
      case 'X':
        if (location === 'H')
          contains = this.locationContains(teamId, this.selectedHome);
        else 
          contains = this.locationContains(teamId, this.selectedAway);
        break;
                  
      default:
        break;
    }

    if (contains)
      return cpCss + " row-visible"
    else
      return cpCss + " row-no-show"
  }

  locationContains(teamId, division) {
    var contains = false
    switch (division) {
      case 'Eastern':
        contains = this.dMetro.includes(teamId) || this.dAtlantic.includes(teamId);
        break;
      case 'Western':
        contains = this.dCentral.includes(teamId) || this.dPacific.includes(teamId);
        break;
      case 'Metro':
        contains = this.dMetro.includes(teamId);
        break;
      case 'Atlantic':
        contains = this.dAtlantic.includes(teamId);
        break;
      case 'Central':
        contains = this.dCentral.includes(teamId);
        break;
      case 'Pacific':
        contains = this.dPacific.includes(teamId);
        break;                  
      default:
        break;
    }
    return contains;
  } 
}
