import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
 
@Injectable()
export class AlertService {
    private subject = new Subject<any>();
 
    alert() {
        this.subject.next();
    }
 
    getAlert(): Observable<any> {
        return this.subject.asObservable();
    }
}