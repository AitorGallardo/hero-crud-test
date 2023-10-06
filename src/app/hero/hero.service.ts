import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, delay, map, take, tap } from 'rxjs/operators';
import { Hero } from './hero.model';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private heroesUrl = 'api/heroes';  // URL to web api
  private heroes: Hero[] = [
    { id: 1, name: 'Spiderman' },
    { id: 2, name: 'Iron Man' },
    { id: 3, name: 'Captain America' },
    { id: 4, name: 'Thor' },
    { id: 5, name: 'Hulk' }
  ];

  constructor(private http: HttpClient) { }

  /** GET all heroes */
  getAllHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        take(1),
        // ** mocked code to remove when API is ready
        catchError((error) => {
            return of(error);
        }),
        map(() => {
            console.log("Getting mocked tags data");
            return this.heroes;
        }),
        delay(700),
        // **
        map((data: any) => {
            const heroes: Hero[] = [];
            if (data && Array.isArray(data) && data.length > 0) {
                data.forEach((hero) => {
                    hero = new Hero (hero);
                    heroes.push(hero);
                });
            }
            return heroes;
        }),
        // catchError(this.handleError<Hero[]>('getAllHeroes', []))
      );
  }

  /** GET hero by id */
  getHeroById(id: number | string): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url)
      .pipe(
        catchError(this.handleError<Hero>(`getHeroById id=${id}`))
      );
  }

  /** GET hero by name */
  getHeroByName(name: string): Observable<Hero> {
    const hero = this.heroes.find(h => h.name === name);
    if (hero) {
      return of(hero);
    }
    const url = `${this.heroesUrl}/?name=${name}`;
    return this.http.get<Hero[]>(url)
      .pipe(
        map(heroes => heroes[0]), // returns a {0|1} element array
        tap(h => {
          if (h) {
            console.log(`found hero matching "${name}"`);
          } else {
            console.log(`no heroes matching "${name}"`);
          }
        }),
        catchError(this.handleError<Hero>(`getHeroByName name=${name}`))
      );
  }

  /** PUT: update the hero on the server */
  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero).pipe(
      catchError(this.handleError<any>('updateHero'))
    );
  }

  /** DELETE: delete the hero from the server */
  deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url).pipe(
      catchError(this.handleError<Hero>('deleteHero'))
    );
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