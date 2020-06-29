import { Route } from '@angular/compiler/src/core';

import { Routes } from '@angular/router';
import { HomeComponent } from './Home/Home.component';
import { MemberListsComponent } from './member-lists/member-lists.component';
import { MessageComponent } from './message/message.component';
import { MatchesComponent } from './matches/matches.component';
import { AuthGuard } from './_guards/auth.guard';

export const appRoots: Routes = [
         { path: '', component: HomeComponent },
         //Route Guard using dummy routes
         {
           path: '',
           runGuardsAndResolvers: 'always',
           canActivate : [AuthGuard],
           children: [
             { path: 'members', component: MemberListsComponent },
             { path: 'messages', component: MessageComponent },
             { path: 'matches', component: MatchesComponent },
           ],
         },
         { path: 'members', component: MemberListsComponent },
         { path: 'messages', component: MessageComponent },
         { path: 'matches', component: MatchesComponent },
         { path: '**', redirectTo: '', pathMatch: 'full' },
       ];
