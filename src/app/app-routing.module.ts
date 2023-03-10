import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AddUserComponent} from "./form/add-user/add-user.component";
import {UserTableComponent} from "./user-table/user-table.component";

const routes: Routes = [
  {path: 'add-user', component: AddUserComponent},
  {path: '', component: UserTableComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
