import { Component } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {Router} from '@angular/router';
import { AlertService} from './alert.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
})


export class LoginComponent {
  form;

  constructor(
    public http: Http,
    private formBuilder: FormBuilder,
    private router: Router,
    private alert: AlertService
  ) {}

  ngOnInit() {
    localStorage.removeItem('token');
    this.form = this.formBuilder.group({
      username: this.formBuilder.control(''),
      password: this.formBuilder.control('')
    });

  }


  onSubmit(authentication) {
    this.http.post('http://localhost:3000/auth/signin', authentication)
    .map(res => res.json()).subscribe(result => {
        console.log(result.error);
        if(result.token) {
            localStorage.setItem('token', result.token);
            localStorage.setItem('username', result.username);
            localStorage.setItem('id', result.id);
            this.alert.alert();
            this.router.navigate(['']);
        }
    });
  }
}
