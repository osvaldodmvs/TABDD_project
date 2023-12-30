import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskSearchComponent } from './task-search/task-search.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
    { path: '', component: HomeComponent},
    { path: 'search', component: TaskSearchComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
