import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlaygroundRoutingModule } from './playground-routing.module';
import { CircleComponent } from './circle/circle.component';
import { Lesson2Component } from './lesson2/lesson2.component';
import { Lesson3Component } from './lesson3/lesson3.component';

@NgModule({
  imports: [
    CommonModule,
    PlaygroundRoutingModule
  ],
  declarations: [CircleComponent, Lesson2Component, Lesson3Component]
})
export class PlaygroundModule { }
