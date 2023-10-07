import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder } from '@angular/forms';

import { HeroService } from '../hero.service';
import { Hero } from '../hero.model';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css'],
})
export class HeroDetailComponent implements OnInit {
  hero: Hero = new Hero();
  heroForm: FormGroup = new FormGroup({});
  private route = inject(ActivatedRoute);
  private heroService = inject(HeroService);
  private location = inject(Location);
  id: number = -1;
  headerText = 'Hero Details';

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id = params['id'] ? Number(params['id']) : -1;
      if (this.id && this.id >= 0) {
        this.getHero();
        this.headerText = 'Edit Hero';
      } else {
        this.headerText = 'Create Hero';
      }
    });
    this.createForm();
    this.getHero();
  }

  createForm(): void {
    this.heroForm = this.fb.group({
      name: '',
      age: '',
      power: '',
    });
  }

  getHero(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '1';
    this.heroService.getHeroById(id).subscribe((hero) => {
      this.heroForm.setValue({
        name: this.hero.name ?? '',
        age: this.hero.age ?? 1,
        power: this.hero.power ?? '',
      });
    });
  }

  onSubmit(): void {
    const hero = { ...this.hero, ...this.heroForm.value };
    if(this.id && this.id >= 0) {
    }
    this.heroService.updateHero(hero).subscribe(() => this.goBack());
  }

  goBack(): void {
    this.location.back();
  }

  
}
