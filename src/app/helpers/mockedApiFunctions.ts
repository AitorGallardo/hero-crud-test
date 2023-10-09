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

// ==> Resolve GET <==
export const resolveGet = async (request: HttpRequest<any>) => {
  const heroes = await initHeroes();
  if (request.params.has('id')) {
    const id = request.params.get('id');
    const hero = resolveGetById(id, heroes);

    return hero;
  }

  if (request.params.has('name')) {
    const name = request.params.get('name');
    const heroArray = resolveGetByName(name, heroes);
    return heroArray;
  }
  return heroes;
};

// By Id
export const resolveGetById = (
  id: number | string | null,
  heroes: Hero[]
): Hero | undefined => {
  return heroes.find((hero) => hero.id == id);
};

// By Name
export const resolveGetByName = (
  name: string | null,
  heroes: Hero[]
): Hero[] | undefined => {
  return heroes.filter((hero) => hero.name === name);
};

// ==> Resolve POST <==
export const resolvePost = async (request: HttpRequest<any>) => {
  const heroes = await initHeroes();
  const hero: Hero = request.body;
  hero.id = Math.max(...heroes.map((h) => h.id)) + 1;
  heroes.push(hero);
  setHeroesToLocalStorage(heroes);
  return heroes;
};

// ==> Resolve PUT <==
export const resolvePut = async (request: HttpRequest<any>) => {
  const heroes = await initHeroes();
  const hero: Hero = request.body;
  const index = heroes.findIndex((h) => h.id === hero.id);
  heroes[index] = hero;
  setHeroesToLocalStorage(heroes);
  return heroes;
};

// ==> Resolve DELETE <==
export const resolveDelete = async (request: HttpRequest<any>) => {
  const heroes = await initHeroes();
  const id = Number(request.url.split('/').pop());
  const index = heroes.findIndex((h) => h.id === id);
  heroes.splice(index, 1);
  return heroes;
};