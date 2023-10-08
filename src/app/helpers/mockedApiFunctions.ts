import { delay, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Hero } from '../hero/hero.model';
import { HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export const initHeroes = async (): Promise<Hero[]> => {
  let heroes = getHeroesFromLocalStorage();
  if (heroes.length > 0) {
    return heroes;
  }
  heroes = await getHeroesJson();
  setHeroesToLocalStorage(heroes);
  return heroes;
};

export const getHeroesJson = (): Promise<any> => {
  return fetch(environment.heroUrl)
    .then((response) => response.json())
    .catch((error) => console.error(error));
};

export const getHeroesFromLocalStorage = (): Hero[] => {
  const data = localStorage.getItem('heroes');
  return data ? JSON.parse(data) : [];
};

export const setHeroesToLocalStorage = (heroes: Hero[]): void => {
  localStorage.setItem('heroes', JSON.stringify(heroes));
};

// Resolve GET

export const resolveGet = async(request: HttpRequest<any>) => {
  const heroes = await initHeroes()

    if (request.params.has('id')) {
      const id = request.params.get('id');
      const hero = resolveGetById(id,heroes);
  
      return hero;
    }
  
    if (request.params.has('name')) {
      const name = request.params.get('name');
      const heroArray = resolveGetByName(name,heroes);
      return heroArray;
    }
    console.log('llego aqui',heroes);
    return heroes

};

export const resolveGetById = (
  id: number | string | null,
  heroes: Hero[]
): Hero | undefined => {
  return heroes.find((hero) => hero.id == id);
};

export const resolveGetByName = (
  name: string | null,
  heroes: Hero[]
): Hero[] | undefined => {
  return heroes.filter((hero) => hero.name === name);
};
