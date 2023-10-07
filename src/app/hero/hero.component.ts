import { Component, OnInit, inject } from '@angular/core';
import { Hero } from './hero.model';
import { HeroService } from './hero.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogContentComponent } from './dialog-component/dialog-component.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css'],
})
export class HeroComponent implements OnInit {
  heroes: Hero[] = [];
  hero = new Hero();
  private heroService = inject(HeroService);
  public dialog = inject(MatDialog);
  public snackBar = inject(MatSnackBar);
  public router = inject(Router);


  inputPlaceHolder = 'Enter Hero Name';

  constructor() {}

  ngOnInit() {
    this.getAllHeroes();
  }

  getAllHeroes(): void {
    this.heroService.getAllHeroes().subscribe((heroes) => {
      this.heroes = heroes;
      console.log('HEROES?', this.heroes);
    });
  }

  goToDetail(hero: Hero): void {
    this.router.navigate(['/detail', hero.id]);
  }

  openDialog(hero: Hero) {
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
      if(result) {
        this.openSnackBar('The hero has been deleted!', 'Close')
        // this.heroService.deleteHero(hero.id).subscribe(() => {
        //   this.heroes = this.heroes.filter((h) => h !== hero);
        // });
      }
      console.log(`Dialog result: ${result}`);
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      // duration: 2000,
    });
  }

  createHero(){
    this.router.navigate(['/details',-1]);
  }
  editHero(heroId:number){
    this.router.navigate(['/details', heroId]);
  }
}
