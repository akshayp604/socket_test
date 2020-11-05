import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './authguard';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {InterceptorAuthService} from './interceptor-service/interceptor-auth.service'

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [AuthGuard, {provide:HTTP_INTERCEPTORS, useClass: InterceptorAuthService, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
