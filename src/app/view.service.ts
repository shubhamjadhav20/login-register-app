// view.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViewService {
  private isAdminView = new BehaviorSubject<boolean>(true);
  currentView = this.isAdminView.asObservable();

  toggleView(): void {
    this.isAdminView.next(!this.isAdminView.value);
  }
}
