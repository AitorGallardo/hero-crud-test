import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder } from '@angular/forms';

import { HeroService } from '../../services/hero.service';
import { Hero } from '../hero.model';
import { LoadingService } from 'src/app/services/loading.service';

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
  public loadingService = inject(LoadingService);

  id: number = -1;
  headerText = 'Hero Details';
  formLabels = {
    name: 'Name',
    age: 'Age',
    power: 'Power',
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.initComponent(params);
    });
  }

  initComponent(params: { [key: string]: any }): void {
    this.id = params['id'] ? Number(params['id']) : -1;
    if (this.isEdit) {
      this.getHero();
      this.headerText = 'Edit Hero';
    } else {
      this.headerText = 'Create Hero';
    }
    this.createForm();
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
      this.hero = hero;
      this.heroForm.setValue({
        name: hero.name ?? '',
        age: hero.age ?? 1,
        power: hero.power ?? '',
      });
    });
  }

  onSubmit(): void {
    const hero = { ...this.hero, ...this.heroForm.value };
    if (this.id && this.id >= 0) {
      this.heroService.updateHero(hero).subscribe(() => this.goBack());
    }else{
      this.heroService.createHero(hero).subscribe(() => this.goBack());
    }
  }

  goBack(): void {
    this.location.back();
  }

  get isEdit(): boolean {
    return (this.id !== null && typeof this.id === 'number' && this.id >= 0);
  } 



}
