import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HeroDetailComponent } from './hero/hero-detail/hero-detail.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeroService } from './hero/hero.service';
import { HeroComponent } from './hero/hero.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { HttpClientModule } from '@angular/common/http';
import { DialogContentComponent } from './hero/dialog-component/dialog-component.component';
import { MatDialogModule } from '@angular/material/dialog';

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
    MatSnackBarModule
  ],
  providers: [HeroService],
  bootstrap: [AppComponent],
})
export class AppModule {}
