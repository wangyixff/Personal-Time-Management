import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThreejsRoutingModule } from './threejs-routing.module';
import { Example1Component } from './example1/example1.component';

@NgModule({
  imports: [
    CommonModule,
    ThreejsRoutingModule
  ],
  declarations: [Example1Component]
})
export class ThreejsModule { }
