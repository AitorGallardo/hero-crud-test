import { environment } from 'src/environments/environment';
import { Hero } from '../hero/hero.model';
import { HttpRequest } from '@angular/common/http';

export type ResponseGetByPage = {
  heroes: Hero[];
  total: number;
  page: number;
  itemsPerPage: number;
};

export type ResponseDelete = {
  sucess: boolean;
  total: number;
};

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

export const getPaginationParams = (request: HttpRequest<any>) => {
  const offset = request.params.get('offset')
    ? Number(request.params.get('offset'))
    : 0;
  const itemsPerPage = request.params.get('itemsPerPage')
    ? Number(request.params.get('itemsPerPage'))
    : 0;

    return {offset,itemsPerPage}
};

// ==> Resolve GET <==
export const resolveGet = async (request: HttpRequest<any>) => {
  const heroes = await initHeroes();
  if (request.params.has('id')) {
    const id = request.params.get('id');
    return resolveGetById(id, heroes);
  }

  if (request.params.has('name')) {
    const name = request.params.get('name') ?? '';
    const {offset,itemsPerPage} = getPaginationParams(request)
    return resolveGetByName(name, offset, itemsPerPage, heroes);
  }

  if (request.params.has('offset') && request.params.has('itemsPerPage')) {
    const {offset,itemsPerPage} = getPaginationParams(request)
    return resolveGetByPage(offset, itemsPerPage, heroes);
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
  name: string,
  offset: number,
  itemsPerPage: number,
  heroes: Hero[]
): ResponseGetByPage | undefined => {

  if(name.length === 0) return resolveGetByPage(offset, itemsPerPage, heroes);

  const searchName = name.toLowerCase().trim();
  const filteredHeroes = heroes.filter((hero) => {
    const heroName = hero.name.toLowerCase();
    return heroName.includes(searchName);
  });

  return resolveGetByPage(offset, itemsPerPage, filteredHeroes);
};

// By Page
export const resolveGetByPage = (
  offset: number,
  itemsPerPage: number,
  heroes: Hero[]
): ResponseGetByPage | undefined => {
  const startIndex = offset;
  const endIndex = startIndex + itemsPerPage;

  // Check if the start index is out of bounds
  if (startIndex >= heroes.length) {
    return {
      heroes,
      total: heroes.length,
      page: offset,
      itemsPerPage: itemsPerPage,
    };
  }

  // Slice the baseList to get the items for the requested page
  const heroesByPage = heroes.slice(startIndex, endIndex);

  return {
    heroes: heroesByPage,
    total: heroes.length,
    page: offset,
    itemsPerPage: itemsPerPage,
  };
};

// ==> Resolve POST <==
export const resolvePost = async (request: HttpRequest<any>) => {
  const heroes = await initHeroes();
  const hero: Hero = request.body;
  hero.id = Math.max(...heroes.map((h) => h.id)) + 1;
  heroes.push(hero);
  setHeroesToLocalStorage(heroes);
  return hero;
};

// ==> Resolve PUT <==
export const resolvePut = async (request: HttpRequest<any>) => {
  const heroes = await initHeroes();
  const hero: Hero = request.body;
  const index = heroes.findIndex((h) => h.id === hero.id);
  heroes[index] = hero;
  setHeroesToLocalStorage(heroes);
  return hero;
};

// ==> Resolve DELETE <==
export const resolveDelete = async (
  request: HttpRequest<any>
): Promise<ResponseDelete> => {
  const heroes = await initHeroes();
  const id = Number(request.url.split('/').pop());
  const index = heroes.findIndex((h) => h.id === id);
  heroes.splice(index, 1);
  setHeroesToLocalStorage(heroes);
  return {
    sucess: true,
    total: heroes.length,
  };
};
