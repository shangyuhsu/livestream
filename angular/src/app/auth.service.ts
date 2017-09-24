import { tokenNotExpired } from 'angular2-jwt';

export class Auth {
    loggedIn() {
        return tokenNotExpired();
    }
}
