import { Component, OnInit, inject } from '@angular/core';
import { Hero } from './hero.model';
import { HeroService } from '../services/hero.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogContentComponent } from './dialog-component/dialog-component.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import {
  Observable,
  debounceTime,
  distinctUntilChanged,
  of,
  switchMap,
} from 'rxjs';
import { MockServerInterceptor } from '../mock-server.interceptor';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css'],
})
export class HeroComponent implements OnInit {
  private heroService = inject(HeroService);
  public dialog = inject(MatDialog);
  public snackBar = inject(MatSnackBar);
  public router = inject(Router);
  public loadingService = inject(LoadingService);


  heroes: Hero[] = [];
  hero = new Hero();

  searchField = new FormControl();
  inputPlaceHolder = 'Enter Hero Name';

  constructor() {}

  ngOnInit() {
    this.getAllHeroes();
    this.initSearchInput().subscribe((value) => console.log('value', value));
  }

  getAllHeroes(): void {
    this.heroService.getAllHeroes().subscribe((heroes) => {
      this.heroes = heroes;
    });
  }

  initSearchInput() {
    return this.searchField.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((value: string) => this.searchOptions(value))
    );
  }

  searchOptions(value: string) {
    return of(value);
  }

  onCreateHero() {
    this.router.navigate(['/details']);

  }
  onEditHero(heroId: number) {
    this.router.navigate(['/details', heroId]);
  }

  onDeleteHero(hero: Hero) {
    const title = 'Delete Hero';
    const message = 'Are you sure you want to delete this hero?';
    const dialogRef = this.dialog.open(DialogContentComponent, {
      disableClose: false,
      autoFocus: false,
      panelClass: ['delete-dialog'],
      data: {
        hero,
        title,
        message,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.heroService.deleteHero(hero.id).subscribe((response) => {
          if(response){
            this.heroes = this.heroes.filter((h) => h !== hero);
            this.openSnackBar('The hero has been deleted!', 'Close');
          }
        });
      }
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
  

}
