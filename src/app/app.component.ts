import { Component } from '@angular/core';
import nhlteams from './data/teams.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
    public nhlTeamList:{teamId:string, name:string, division:string, conference:string}[] = nhlteams;
}
