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


  constructor(private http: HttpClient) {}

  /** GET all heroes */
  getAllHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl).pipe(
      take(1),
      map((data) => {
        const heroes: Hero[] = [];

        if (this.isDataValid(data)) {
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

    return this.http.get<Hero>(this.heroesUrl, { params }).pipe(
      take(1),
      map((hero) => {
        hero = new Hero(hero);
        return hero;
      })
    );
  }

  /** GET hero by name */
  getHeroesByName(name: string): Observable<Hero[]> {
    let params = new HttpParams();
    if (name) {
      params = params.set('name', name);
    }
    // const url = `${this.heroesUrl}/?name=${name}`;
    return this.http.get<Hero[]>(this.heroesUrl, { params }).pipe(
      take(1),
      map((data) => {
        const heroes: Hero[] = [];
        if (this.isDataValid(data)) {
          data.forEach((hero) => {
            hero = new Hero(hero);
            heroes.push(hero);
          });
        }
        return heroes;
      })
    );
  }

  /** CREATE: update the hero on the server */
  createHero(hero: Hero): Observable<any> {
    return this.http
      .post(this.heroesUrl, hero)
      .pipe(
        take(1),
        map((hero) => {
          hero = new Hero(hero);
          return hero;
        }),
        catchError(this.handleError<any>('createHero'))
      );
  }

  /** PUT: update the hero on the server */
  updateHero(hero: Hero): Observable<any> {
    return this.http
      .put(this.heroesUrl, hero)
      .pipe(
        take(1),
        map((hero) => {
          hero = new Hero(hero);
          return hero;
        }),
        catchError(this.handleError<any>('updateHero'))
      );
  }

  /** DELETE: delete the hero from the server */
  deleteHero(hero: Hero | number): Observable<boolean> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;

    return this.http
      .delete<Hero>(url)
      .pipe(
        take(1),
        map((response) => {
          return response;
        }),
        catchError(this.handleError<any>('deleteHero'))
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


  private isDataValid(data: any): data is Hero[] {
    return data && Array.isArray(data) && data.length > 0;
  }
}
