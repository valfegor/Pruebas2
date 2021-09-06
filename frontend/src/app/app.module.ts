import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './home/header/header.component';
import { LoginComponent } from './home/login/login.component';
import { RegisterComponent } from './home/register/register.component';
import { FooterComponent } from './home/footer/footer.component';
import { ListBoardComponent } from './board/list-board/list-board.component';
import { SaveBoardComponent } from './board/save-board/save-board.component';
import { ListUserComponent } from './admin/list-user/list-user.component';
import { RegisterUserComponent } from './admin/register-user/register-user.component';
import { UpdateUserComponent } from './admin/update-user/update-user.component';
import { RegisterRoleComponent } from './admin/register-role/register-role.component';
import { ListRoleComponent } from './admin/list-role/list-role.component';
import { UpdateRoleComponent } from './admin/update-role/update-role.component';
import { ListTaskComponent } from './task/list-task/list-task.component';
import { SaveTaskComponent } from './task/save-task/save-task.component';
import { ListTeamComponent } from './team/list-team/list-team.component';
import { AddMemberComponent } from './team/add-member/add-member.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    RegisterComponent,
    FooterComponent,
    ListBoardComponent,
    SaveBoardComponent,
    ListUserComponent,
    RegisterUserComponent,
    UpdateUserComponent,
    RegisterRoleComponent,
    ListRoleComponent,
    UpdateRoleComponent,
    ListTaskComponent,
    SaveTaskComponent,
    ListTeamComponent,
    AddMemberComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatToolbarModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatIconModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
