import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CircleComponent } from './circle/circle.component';
import { Lesson2Component } from './lesson2/lesson2.component';

const routes: Routes = [
  {
    path: '',
    component: CircleComponent
  },
  {
    path: 'lesson2',
    component: Lesson2Component
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlaygroundRoutingModule { }
