import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { CamaraComponent } from './camara/camara.component';
import { AccidentesComponent } from './accidentes/accidentes.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'accidentes', component: AccidentesComponent},
  { path: 'camara', component: CamaraComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
