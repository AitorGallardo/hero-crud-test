import { Component, OnInit, inject } from '@angular/core';
import { Hero } from './hero.model';
import { HeroService } from './hero.service';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent implements OnInit {
  heroes: Hero[] = [];
  hero = new Hero();
  private heroService = inject(HeroService);

  constructor() { }

  ngOnInit() {
    this.getAllHeroes();
  }

  getAllHeroes(): void {
    this.heroService.getAllHeroes()
      .subscribe(heroes => {
        this.heroes = heroes
        console.log('HEROES?',this.heroes);
      });
  }

  goToDetail(): void { 
    // this.router.navigate(['/detail', this.selectedHero.id]);
  } 
}