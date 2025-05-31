import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { PaginationComponent } from './components/pagination/pagination.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';


@NgModule({
  declarations: [
  PaginationComponent,
  NavbarComponent,
  PageNotFoundComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
  ],
  exports:[
    PaginationComponent,
    NavbarComponent,
    PageNotFoundComponent
  ]
})
export class SharedModule { }
