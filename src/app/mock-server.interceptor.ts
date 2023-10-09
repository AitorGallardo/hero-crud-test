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

enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE'
}
@Injectable()
export class MockServerInterceptor implements HttpInterceptor {
  private loadingService = inject(LoadingService);

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (request.url.includes(environment.heroUrl)) {
      switch (request.method) {
        case HttpMethod.GET:
          return this.response(resolveGet(request));
        case HttpMethod.POST:
          return this.response(resolvePost(request),0);
        case HttpMethod.PUT:
          return this.response(resolvePut(request),0);
        case HttpMethod.DELETE:
          return this.response(resolveDelete(request));
        default:
          break;
      }
    }
    return next.handle(request);
  }

  response(callback: any,delayTime:number=1500): Observable<HttpEvent<any>> {
    this.loadingService.isLoading = true;
    return from(callback).pipe(
      switchMap((data) => {
        return of(new HttpResponse({ status: 200, body: data })).pipe(
          delay(delayTime),
          tap(() => {
            this.loadingService.isLoading = false;
          })
        );
      })
    );
  }
}
