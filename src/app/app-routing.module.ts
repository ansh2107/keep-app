import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './_services/auth.guard';



const accountModule = () => import('./account/account.module').then(x => x.AccountModule);
const notesModule = () => import('./notes/notes.module').then(x => x.NotesModule);

const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
   /*  { path: '', loadChildren: notesModule, canActivate: [AuthGuard] }, */
    { path: 'account', loadChildren: accountModule },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }