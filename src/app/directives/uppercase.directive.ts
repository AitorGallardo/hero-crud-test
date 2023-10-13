import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appUppercase]'
})
export class UppercaseDirective {

  constructor() { }

  @HostListener('input', ['$event.target'])
  onInput(input: HTMLInputElement) {
    input.value = input.value.toUpperCase();
  }

}