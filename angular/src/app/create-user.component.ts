import { Component, Inject } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { AlertService} from './alert.service';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {Router} from '@angular/router';

@Component({
  selector: 'create-user',
  templateUrl: './create-user.component.html'
})

export class CreateUserComponent {
  form;
  usernameTaken=false;

  constructor(
    private formBuilder: FormBuilder,
    private http: Http,
    private router: Router,
    private alert: AlertService
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      username: this.formBuilder.control('', Validators.required),
      password: this.formBuilder.control('', Validators.required),
      confirm: this.formBuilder.control('', Validators.required),
    }, {validator:this.confirmPassword});
  }


  confirmPassword(group) {
    if(group.controls['password'].value === group.controls['confirm'].value) {
        return null;
    } else {
        return {
            mismatch: true
        };
    }
  }

  onSubmit(newUser) {
    this.http.post('http://localhost:3000/api/users/', {
        username: newUser.username,
        password: newUser.password
    }).map(res => res.json()).subscribe(result => {
        if(result.error && result.error === "UsernameTaken") {
            this.usernameTaken = true;
        } else {
            localStorage.setItem('token', result.token);
            console.log(result.username);
            localStorage.setItem('username', result.username);
            localStorage.setItem('id', result.id);
            this.router.navigate(['']);
            this.alert.alert();
        }
    }
    )}
}
