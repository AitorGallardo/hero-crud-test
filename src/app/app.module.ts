import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule} from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MockServerInterceptor } from './mock-server.interceptor';
import { LoadingService } from './services/loading.service';
import { HeroService } from './services/hero.service';


import { HeroDetailComponent } from './hero/hero-detail/hero-detail.component';
import { HeroComponent } from './hero/hero.component';
import { DialogContentComponent } from './hero/dialog-component/dialog-component.component';


@NgModule({
  declarations: [AppComponent, HeroComponent, HeroDetailComponent, DialogContentComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatToolbarModule,
    MatListModule,
    HttpClientModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatPaginatorModule
  ],
  providers: [
    HeroService,
    LoadingService,
    { provide: HTTP_INTERCEPTORS, useClass: MockServerInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
