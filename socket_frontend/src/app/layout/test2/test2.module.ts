import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Test2RoutingModule } from './test2-routing.module';
import { Test2Component } from './test2.component';


import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
@NgModule({
  declarations: [Test2Component],
  imports: [
    CommonModule,
    Test2RoutingModule,
    FormsModule,
ReactiveFormsModule
  ]
})
export class Test2Module { }
