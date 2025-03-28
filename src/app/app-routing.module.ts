import { PagesModule } from './pages/pages.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';

const routes: Routes = [
    {
        path: 'register',
        loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)
      }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
