import { Component, OnInit, inject } from '@angular/core';
import { Hero } from './hero.model';
import { HeroService } from '../services/hero.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogContentComponent } from './dialog-component/dialog-component.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import {
  BehaviorSubject,
  Observable,
  debounceTime,
  distinctUntilChanged,
  switchMap,
} from 'rxjs';
import { LoadingService } from '../services/loading.service';
import { PageEvent } from '@angular/material/paginator';

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
  deletingHeroId: number = -1;

  searchField = new FormControl();
  inputPlaceHolder = 'Enter Hero Name';

  length = 0;
  pageSize = 10;
  pageIndex = 0;

  onPagination$: BehaviorSubject<PageEvent> = new BehaviorSubject<PageEvent>(
    new PageEvent()
  );

  constructor() {}

  ngOnInit() {
    this.initPagination().subscribe((data) => {
      this.initData(data);
    });

    this.initSearchInput().subscribe((data) => {
      this.initData(data);
    });
  }

  getHeroesByName(name: string): Observable<{ heroes: Hero[]; total: number }> {
    return this.heroService.getHeroesByName(name, 0, this.pageSize);
  }
  getHeroesByPage(): Observable<{ heroes: Hero[]; total: number }> {
    return this.heroService.getHeroesByPage(this.pageIndex, this.pageSize);
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
        this.deletingHeroId = hero.id;
        this.heroService.deleteHero(hero.id).subscribe(({ sucess, total }) => {
          if (sucess) {
            this.heroes = this.heroes.filter((h) => h !== hero);
            this.deletingHeroId = -1;
            this.length = total;
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

  isShowingDeleteIcon(hero: Hero): boolean {
    return !this.loadingService.isLoading || this.deletingHeroId !== hero?.id;
  }
  isShowingSpinnerOnDelete(hero: Hero): boolean {
    return this.loadingService.isLoading && this.deletingHeroId === hero?.id;
  }

  get isShowingListSpinner(): boolean {
    return this.loadingService.isLoading && this.deletingHeroId === -1;
  }

  initSearchInput() {
    return this.searchField.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((value: string) => this.getHeroesByName(value))
    );
  }

  initPagination() {
    return this.onPagination$.pipe(
      switchMap((e: PageEvent) => {
        this.handlePageEvent(e);
        return this.getHeroesByPage();
      })
    );
  }

  handlePageEvent(e: PageEvent) {
    if (e && Object.keys(e).length > 0) {
      this.length = e.length;
      this.pageSize = e.pageSize;
      this.pageIndex = e.pageIndex;
    }
  }
  onPaginationChange(e: PageEvent) {
    this.onPagination$.next(e);
  }

  initData(data: { heroes: Hero[]; total: number }) {
    const { heroes, total } = data;
    this.heroes = heroes;
    this.length = total;
  }
}
