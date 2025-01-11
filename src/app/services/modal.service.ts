import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalVisibilitySubject = new Subject<boolean>();
  modalVisibility$ = this.modalVisibilitySubject.asObservable();
  uniqueCode : string = ''

  showModal() {
    this.modalVisibilitySubject.next(true);
  }

  hideModal() {
    this.modalVisibilitySubject.next(false);
  }
}