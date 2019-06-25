import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import  {HttpClientModule} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TestFsmComponent } from './test-fsm/test-fsm.component';
import { TestCommentComponent } from './test-comment/test-comment.component';
import { HighlightOnOverDirective } from './highlight-on-over.directive';
import { TrimTextPipe } from './trim-text.pipe';

@NgModule({
  declarations: [
    AppComponent,
    TestFsmComponent,
    TestCommentComponent,
    HighlightOnOverDirective,
    TrimTextPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
