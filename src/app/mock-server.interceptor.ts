import { Injectable, inject } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { Hero } from './hero/hero.model';
import { environment } from 'src/environments/environment';
import {
  getHeroesFromLocalStorage,
  getHeroesJson,
  resolveGet,
  setHeroesToLocalStorage,
} from './helpers/mockedApiFunctions';
import { LoadingService } from './services/loading.service';

@Injectable()
export class MockServerInterceptor implements HttpInterceptor {
  private loadingService = inject(LoadingService);

  private get heroesFromLocalStorage(): Hero[] {
    return getHeroesFromLocalStorage();
  }
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (request.url.includes(environment.heroUrl) ) {
      this.loadingService.isLoading = true;
      if (request.method === 'GET') {
        console.log('entro GET request')
        resolveGet(request).then((DATA) => {
        console.log('RESULTADO DEL RESOLVE GLOBAL',DATA)

          return of(new HttpResponse({ status: 200, body: DATA })).pipe(
            delay(6000),
            tap(() => {console.log('entro tap');this.loadingService.isLoading = false})
            );
        });
      }
      //   else if (request.method === 'POST') {
      //     const hero: Hero = request.body;
      //     hero.id = Math.max(...heroes.map(h => h.id)) + 1;
      //     heroes.push(hero);
      //     return of(new HttpResponse({ status: 200, body: hero })).pipe(delay(1000));
      //   } else if (request.method === 'PUT') {
      //     const hero: Hero = request.body;
      //     const index = heroes.findIndex(h => h.id === hero.id);
      //     heroes[index] = hero;
      //     return of(new HttpResponse({ status: 200, body: hero })).pipe(delay(1000));
      //   } else if (request.method === 'DELETE') {
      //     const id = Number(request.url.split('/').pop());
      //     const index = heroes.findIndex(h => h.id === id);
      //     heroes.splice(index, 1);
      //     return of(new HttpResponse({ status: 200 })).pipe(delay(1000));
      //   }
    }

    return next.handle(request);
  }
}
