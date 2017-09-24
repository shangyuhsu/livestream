import { CanDeactivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { MyStreamComponent } from './my-stream.component';

@Injectable()
export class StreamGuard implements CanDeactivate<MyStreamComponent> {

  canDeactivate(stream: MyStreamComponent) {
    return stream.endSession();
  }
}