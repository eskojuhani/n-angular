import { Component, OnInit, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventSourcePolyfill } from 'ng-event-source';

@Injectable({
  providedIn: 'root'
})
export class NHLService {
  constructor(private httpClient: HttpClient) {
    console.log("NHLService constructed.");
    //this.connect();
  }

  baseUrl = '/api/v1/';
  public teams: Observable<[]>;
  public conferences: Observable<[]>;
  public divisions: Observable<[]>;

  connect(): void {

    this.fetch('teams')
      .subscribe((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.Response:
            this.teams = event.body;
            console.log("NHLService.teams:", this.teams)
        }
      }),
      err => {
        console.log("Error occured.")
      };

    this.fetch('conferences')
      .subscribe((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.Response:
            this.conferences = event.body;
        }
      }),
      err => {
        console.log("Error occured.")
      };

    this.fetch('divisions')
      .subscribe((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.Response:
            this.divisions = event.body;
        }
      }),
      err => {
        console.log("Error occured.")
      };
  }

  fetch(param): Observable<any> {
    var url = this.baseUrl + param;
    const req = new HttpRequest('GET', url, {
      reportProgress: true
    });
    return this.httpClient.request(req);
  }

}
