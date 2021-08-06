import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NoteEditComponent } from './note-edit/note-edit.component';
import { AuthGuard } from './_services/auth.guard';

const accountModule = () => import('./account/account.module').then(x => x.AccountModule);

const routes: Routes = [
{path: '',component: DashboardComponent, canActivate: [AuthGuard]},
{ path: 'edit/:id', component: NoteEditComponent, canActivate: [AuthGuard] },
{ path: 'account', loadChildren: accountModule },

// otherwise redirect to home
{ path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }