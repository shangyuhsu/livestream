import { Component } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/map';
import {Router} from '@angular/router';
import {Validators, FormBuilder } from '@angular/forms';
import { Http } from '@angular/http';

@Component({
  selector: 'friends',
  templateUrl: './friends-list.component.html',
})
export class FriendsListComponent {
    friends;
    requests; 
    requestForm;
    message;

    constructor(
        public http: AuthHttp,
        private fb: FormBuilder,
        private router: Router
    ) {
    }

    getFriends() {
        this.http.get('http://localhost:3000/api/users/'+localStorage.getItem('id')+'/friends')
            .map(res=>res.json())
            .subscribe(res=>{
                this.friends = res;
                console.log(this.friends);
            });
    }

    getRequests() {
        this.http.get('http://localhost:3000/api/users/'+localStorage.getItem('id')+'/requests')
            .map(res=>res.json())
            .subscribe(res=>{
                this.requests = res;
            });
    }

    acceptRequest(username) {
        this.http.put('http://localhost:3000/api/users/'+localStorage.getItem('id')+'/requests/'+username, {})
        .map(res=>res.json())
        .subscribe(res=>{
            this.router.navigate(['/friends']);
        });
    }

    ngOnInit() {
        this.requestForm = this.fb.group({
          username: this.fb.control('', Validators.required)
        });
        this.getFriends();
        this.getRequests();
      }
    
    
      onSubmit(data) {
        this.http.post('http://localhost:3000/api/users/'+localStorage.getItem('id')+'/requests/'+data.username, {})
        .map(res => res.json()).subscribe(result => {
            if(result.error) {
                if(result.error==="AlreadyRequested") {
                    this.message="Request already sent";
                } else if (result.error==="AlreadyFriends") {
                    this.message="You are already friends";
                } else if(result.error==="UsernameNotFound"){
                    this.message="User not found";
                }
            } else {
                this.message="Request sent!";
            }
        });
      }
}
