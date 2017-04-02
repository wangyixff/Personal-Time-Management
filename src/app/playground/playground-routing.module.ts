import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CircleComponent } from './circle/circle.component';
import { Lesson2Component } from './lesson2/lesson2.component';
import { Lesson3Component } from './lesson3/lesson3.component';
import { Lesson4Component } from './lesson4/lesson4.component';

const routes: Routes = [
  {
    path: '',
    component: CircleComponent
  },
  {
    path: 'lesson2',
    component: Lesson2Component
  },
  {
    path: 'lesson3',
    component: Lesson3Component
  },
  {
    path: 'lesson4',
    component: Lesson4Component
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlaygroundRoutingModule { }
