import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CircleRoutingModule } from './circle-routing.module';
import { CircleComponent } from './circle/circle.component';

@NgModule({
  imports: [
    CommonModule,
    CircleRoutingModule
  ],
  declarations: [CircleComponent]
})
export class CircleModule { }
