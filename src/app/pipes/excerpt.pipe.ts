import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'excerpt'
})
export class ExcerptPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    const val =
      value
        .split(' ')
        .slice(0, args ? args : 20)
        .join(' ') + ' continue reading.....';
    return val;
  }
}
