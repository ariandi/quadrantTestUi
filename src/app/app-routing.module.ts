import { NgModule } from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {RegistrationComponentComponent} from "./components/registration-component/registration-component.component";
import {AuthLoginGuard} from './guard/auth-login.guard';
import {AuthGuard} from './guard/auth.guard';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'register', component: RegistrationComponentComponent },
  {
    path: 'login',
    loadChildren: () => import('./components/test-page/test-page.module').then(m => m.TestPageModule),
    canLoad: [AuthLoginGuard]
  },
  {
    path: 'home',
    loadChildren: () => import('./components/home/home.component').then(m => m.HomeComponent),
    canLoad: [AuthGuard] // Secure all child pages
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
