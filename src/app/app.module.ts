import { BrowserModule } from '@angular/platform-browser';
import { Component, NgModule } from '@angular/core';
import { HttpClientModule, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { DateGamesComponent } from './components/dategames/dategames.component';
import { TeamsComponent } from './components/teams/teams.component';
import { CanvasComponent } from './components/canvas/canvas.component';
//import { ChatService } from './services/chat.service';
import { NHLService } from './services/nhl.service';
import { StoreService } from './services/store.service';
import { TokenInterceptor } from './services/token-interceptor';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { CrosstabComponent } from './crosstab/crosstab.component';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//const config: SocketIoConfig = { url: 'https://nhl-chat.herokuapp.com/', options: { } }
//const config: SocketIoConfig = { url: 'http://localhost:8088/', options: { } }

@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent,
    DateGamesComponent,
    TeamsComponent,
    CrosstabComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      {path: 'crosstab', component: CrosstabComponent},
      {path: 'teams', component: TeamsComponent},
      {path: 'teams/:id', component: TeamsComponent},
      {path: 'dategames', component: DateGamesComponent},
      {path: 'dategames/:id', component: DateGamesComponent},
      {path: 'dategames/:id/:teamid', component: DateGamesComponent},
      {path: '', redirectTo: '/dategames', pathMatch: 'full'},
    ]),
    //SocketIoModule.forRoot(config)
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    StoreService, NHLService /*, ChatService*/],
  bootstrap: [AppComponent]
})
export class AppModule { }
