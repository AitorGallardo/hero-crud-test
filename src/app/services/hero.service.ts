import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, delay, map, take, tap } from 'rxjs/operators';
import { Hero } from '../hero/hero.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private heroesUrl = environment.heroUrl; // URL to web api
  private heroes: Hero[] = [
    { id: 1, name: 'Spiderman', age: 25, power: 'Web-slinging' },
    { id: 2, name: 'Iron Man', age: 40, power: 'Powered suit' },
    { id: 3, name: 'Captain America', age: 100, power: 'Super soldier serum' },
    { id: 4, name: 'Thor', age: 1000, power: 'God of Thunder' },
    { id: 5, name: 'Hulk', age: 45, power: 'Superhuman strength' },
  ];


  constructor(private http: HttpClient) {}

  fumateEsta(): Observable<Hero[]> {
    if (this.heroesFromLocalStorage.length > 0) {
      this.heroes = this.heroesFromLocalStorage;
      return of(this.heroes);
    }
    return this.http.get<Hero[]>('/assets/heroes.json').pipe(
      take(1),
      map((data) => {
        this.setHeroesToLocalStorage(data);
        const heroes: Hero[] = [];
        if (data && Array.isArray(data) && data.length > 0) {
          data.forEach((hero) => {
            hero = new Hero(hero);
            heroes.push(hero);
          });
        }
        return heroes;
      })
    );
  }

  get heroesFromLocalStorage(): Hero[] {
    const data = localStorage.getItem('heroes');
    return data ? JSON.parse(data) : [];
  }

  setHeroesToLocalStorage(heroes: Hero[]): void {
    localStorage.setItem('heroes', JSON.stringify(heroes));
  }

  // this.http.put('/assets/heroes.json', this.heroes).subscribe(() => {
  //   console.log('Data saved');
  // });

  /** GET all heroes */
  getAllHeroes(): Observable<Hero[]> {
    const heroes: Hero[] = [];

    return this.http.get<Hero[]>(this.heroesUrl).pipe(
      take(1),
      map((data) => {
        console.log('que es esta  data',data);
        if (data && Array.isArray(data) && data.length > 0) {
          data.forEach((hero) => {
            hero = new Hero(hero);
            heroes.push(hero);
          });
        }
        return heroes;
      })
    );
  }

  /** GET hero by id */
  getHeroById(id: number | string): Observable<Hero> {
    // const url = `${this.heroesUrl}/${id}`;

    let params = new HttpParams();
    if (id) {
      params = params.set('id', id);
    }

    return this.http
      .get<Hero>(this.heroesUrl, { params })
      // .pipe(catchError(this.handleError<Hero>(`getHeroById id=${id}`)));
  }

  /** GET hero by name */
  getHeroesByName(name: string): Observable<Hero[]> {
    const hero = this.heroes.find((h) => h.name === name);
    let params = new HttpParams();
    if (name) {
      params = params.set('name', name);
    }
    // const url = `${this.heroesUrl}/?name=${name}`;
    return this.http.get<Hero[]>(this.heroesUrl, { params });
  }

    /** CREATE: update the hero on the server */
    createeHero(hero: Hero): Observable<any> {
      return this.http
        .post(this.heroesUrl, hero)
        .pipe(catchError(this.handleError<any>('updateHero')));
    }

  /** PUT: update the hero on the server */
  updateHero(hero: Hero): Observable<any> {
    return this.http
      .put(this.heroesUrl, hero)
      .pipe(catchError(this.handleError<any>('updateHero')));
  }

  /** DELETE: delete the hero from the server */
  deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;

    return this.http
      .delete<Hero>(url)
      .pipe(catchError(this.handleError<Hero>('deleteHero')));
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      return of(result as T);
    };
  }
}
