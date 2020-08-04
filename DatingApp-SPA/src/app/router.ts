import { Route } from '@angular/compiler/src/core';

import { Routes } from '@angular/router';
import { HomeComponent } from './Home/Home.component';
import { MemberListsComponent } from './members/member-list/member-lists.component';
import { MessageComponent } from './message/message.component';
import { MatchesComponent } from './matches/matches.component';
import { AuthGuard } from './_guards/auth.guard';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberDetailResolver } from './_resolvers/member-detail.resolver';
import { MemberListResolver } from './_resolvers/member-list.resolver';
import { MemberDetailEditComponent } from './members/member-detail-edit/member-detail-edit.component';
import { MemberDetailEditResolver } from './_resolvers/member-detail-edit.resolver';
import { PreventUnsavedChangesGuard } from './_guards/prevent-unsaved-changes.guard';
import { ListResolver } from './_resolvers/list.resolver';

export const appRoots: Routes = [
  { path: '', component: HomeComponent },
  // Route Guard using dummy routes
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'members',
        component: MemberListsComponent,
        resolve: { users: MemberListResolver },
      },
      {
        path: 'members/:id',
        component: MemberDetailComponent,
        resolve: { user: MemberDetailResolver },
      },
      {
        path: 'member/edit-profile',
        component: MemberDetailEditComponent,
        resolve: { user: MemberDetailEditResolver },
        canDeactivate: [PreventUnsavedChangesGuard],
      },
      { path: 'messages', component: MessageComponent },
      {
        path: 'matches',
        component: MatchesComponent,
        resolve: { users: ListResolver },
      },
    ],
  },
  { path: 'members', component: MemberListsComponent },
  { path: 'messages', component: MessageComponent },
  {
    path: 'matches',
    component: MatchesComponent,
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
