import { Injectable } from '@angular/core';
import {CanDeactivate} from '@angular/router';
import { MemberDetailEditComponent } from '../members/member-detail-edit/member-detail-edit.component';
import { NgForm } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class PreventUnsavedChangesGuard
  implements CanDeactivate<MemberDetailEditComponent> {
  canDeactivate(component: MemberDetailEditComponent): boolean {
    if (component.editForm.dirty) {
      return confirm('Are you sure you want to continue? All changes will be lost');
    }
    return true;
  }
}
