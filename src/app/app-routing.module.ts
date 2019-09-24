import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsuariosListComponent } from './components/usuarios-list/usuarios-list.component';
import { UsuariosFormComponent } from './components/usuarios-form/usuarios-form.component';


const routes: Routes = [
  { path: 'usuarios', component: UsuariosListComponent },
  { path: 'usuarios/:id', component: UsuariosFormComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
