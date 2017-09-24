import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { LoginComponent } from './login.component';
import { AuthModule } from './auth.module';
import { routing } from './app.routing';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from './auth-guard.service';
import { Auth } from './auth.service';
import { FriendsListComponent} from './friends-list.component';
import { CreateUserComponent} from './create-user.component';
import { AlertService} from './alert.service';
import {FeedComponent} from './feed.component';
import {MyStreamComponent} from './my-stream.component';
import { StreamGuard } from './stream-guard.service';
import {ListenComponent} from './listen.component';
import {ChatService} from './chat.service';
@NgModule({
  declarations: [
    AppComponent, LoginComponent, FriendsListComponent, CreateUserComponent, FeedComponent, MyStreamComponent, ListenComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AuthModule,
    routing,
    ReactiveFormsModule
  ],
  providers: [AuthGuard, Auth, AlertService, StreamGuard, ChatService],
  bootstrap: [AppComponent]
})
export class AppModule { }
