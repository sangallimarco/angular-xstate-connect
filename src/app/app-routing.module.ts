import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TestFsmComponent } from './test-fsm/test-fsm.component';

const routes: Routes = [
  {path: 'main', component: TestFsmComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
