import { Injectable, inject } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { delay, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import {
  resolveDelete,
  resolveGet,
  resolvePost,
  resolvePut,
} from './helpers/mockedApiFunctions';
import { LoadingService } from './services/loading.service';

@Injectable()
export class MockServerInterceptor implements HttpInterceptor {
  private loadingService = inject(LoadingService);

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (request.url.includes(environment.heroUrl)) {
      this.loadingService.isLoading = true;
      if (request.method === 'GET') {
        return this.response(resolveGet(request));
      } else if (request.method === 'POST') {
        return this.response(resolvePost(request));
      } else if (request.method === 'PUT') {
        return this.response(resolvePut(request));
      } else if (request.method === 'DELETE') {
        return this.response(resolveDelete(request));
      }
    }
    return next.handle(request);
  }

  response(callback: any): Observable<HttpEvent<any>> {
    return from(callback).pipe(
      switchMap((data) => {
        return of(new HttpResponse({ status: 200, body: data })).pipe(
          delay(3000),
          tap(() => {
            this.loadingService.isLoading = false;
          })
        );
      })
    );
  }
}
