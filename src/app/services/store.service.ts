import { Component, OnInit, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventSourcePolyfill } from 'ng-event-source';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  constructor(private httpClient: HttpClient) {
    this.connect();
  }
  //baseUrl = 'https://nhl-data.herokuapp.com';
  //baseUrl = 'https://esepoppa.nfshost.com/nhl';
  baseUrl = 'http://localhost:8088';
  connect(): void {
/*
    let eventSource = new EventSource(this.baseUrl + '/sse');
    eventSource.onopen = function() {
      console.log("Connection to server opened.");
    };
    eventSource.onmessage = function(e) {
      //console.log("data:" + e.data);
    };
    eventSource.onerror = function() {
      console.log("EventSource failed.");
      eventSource.close()
    };
    */
  }

  insert(data): Observable<any> {
    var url = this.baseUrl + '/api/table/';
    const req = new HttpRequest('PUT', url, {
      reportProgress: true,
      body: data
    });
    return this.httpClient.request(req);
  }

  update(data, id): Observable<any> {
    var url = this.baseUrl + '/api/table/' + id;
    const req = new HttpRequest('POST', url, {
      reportProgress: true,
      body: data
    });
    return this.httpClient.request(req);
  }

  select(metadata, id): Observable<any> {
    var url = this.baseUrl + '/api/table/' + id;
    let headers = new HttpHeaders(metadata);
    const req = new HttpRequest('GET', url, {
      reportProgress: true,
      headers: headers
    });
    return this.httpClient.request(req);
  }

  selectAll(metadata): Observable<any> {
    var url = this.baseUrl + '/api/table';
    let headers = new HttpHeaders(metadata);
    /*const req = new HttpRequest('GET', url, {
      reportProgress: true,
      headers: headers,
      json: true
    });
    return this.httpClient.request(req);
    */
    return this.httpClient.get<[]>(url, { 'headers': headers });
  }

  audioPcm(uri): Observable<any> {
    console.log("encoded", encodeURIComponent(uri));
    var url = this.baseUrl + '/api/audio/pcm/';
    url += encodeURIComponent(uri);
    let headers = new HttpHeaders();
    const req = new HttpRequest('GET', url, {
      reportProgress: true,
      headers: headers
    });
    return this.httpClient.request(req);
  }

  playAudioOnServer(uri): Observable<any> {
    console.log("encoded", encodeURIComponent(uri));
    var url = this.baseUrl + '/api/audio/play/';
    url += encodeURIComponent(uri);
    let headers = new HttpHeaders();
    const req = new HttpRequest('PUT', url, {
      reportProgress: true,
      headers: headers
    });
    return this.httpClient.request(req);
  }

  stopAudioOnServer(): Observable<any> {
    var url = this.baseUrl + '/api/audio/stop/1';
    let headers = new HttpHeaders();
    const req = new HttpRequest('PUT', url, {
      reportProgress: true,
      headers: headers
    });
    return this.httpClient.request(req);
  }

}
