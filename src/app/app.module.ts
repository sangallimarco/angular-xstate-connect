import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import  {HttpClientModule} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TestFsmComponent } from './test-fsm/test-fsm.component';
import { TestCommentComponent } from './test-comment/test-comment.component';
import { AngularXstateConnectModule } from 'angular-xstate-connect';

@NgModule({
  declarations: [
    AppComponent,
    TestFsmComponent,
    TestCommentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AngularXstateConnectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
