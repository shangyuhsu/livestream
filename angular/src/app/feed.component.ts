import { Component } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/map';
import {Router} from '@angular/router';
import {Validators, FormBuilder } from '@angular/forms';
import { Http } from '@angular/http';

@Component({
  selector: 'feed',
  templateUrl: './feed.component.html'
})
export class FeedComponent {
    streams;

    constructor(
        public http: AuthHttp,
        private router: Router
    ) {
    }

    getStreams() {
        this.http.get('http://localhost:3000/api/streamsessions/friends/'+localStorage.getItem('id'))
            .map(res=>res.json())
            .subscribe(res=>{
                this.streams = res;
                console.log(this.streams);
            });
    }


    ngOnInit() {
        this.getStreams();
      }


     
}
