import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login.component';
import { AuthGuard } from './auth-guard.service';
import { StreamGuard } from './stream-guard.service';
import { FriendsListComponent} from './friends-list.component';
import { CreateUserComponent} from './create-user.component';
import {FeedComponent} from './feed.component';
import {MyStreamComponent} from './my-stream.component';
import {ListenComponent} from './listen.component';

const appRoutes: Routes = [
    { path: 'login', component: LoginComponent},
    { path: 'friends', component: FriendsListComponent, canActivate: [AuthGuard]},
    { path: 'createuser', component: CreateUserComponent },
    { path: 'mystream', component: MyStreamComponent, canActivate: [AuthGuard], canDeactivate: [StreamGuard]},
    { path: 'stream/:username', component: ListenComponent, canActivate: [AuthGuard]},
    { path: '', component: FeedComponent, canActivate: [AuthGuard]},  
];

export const routing = RouterModule.forRoot(appRoutes);
