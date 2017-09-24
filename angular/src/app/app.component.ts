import { Component } from '@angular/core';
import {Router} from '@angular/router';
import { AlertService} from './alert.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  subscription;
  username = localStorage.getItem('username');

  constructor(private router: Router, private alert: AlertService) {
    this.subscription = this.alert.getAlert()
    .subscribe(() => {
      this.username=localStorage.getItem('username');
    });
  }

  logout() {
    this.router.navigate(['/login']);
    localStorage.removeItem('username');
    localStorage.removeItem('id');
    this.alert.alert();
  }
}
