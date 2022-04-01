import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'customerFilterUser'
})
export class SearchPipe implements PipeTransform {
/**
 * transform method used to perform search operation. 
 * @param value Its contain total value.
 * @param args Its contain search value
 */
  transform(value: any, args?: any): any {
    if (!args) {
      return value;
    }
    return value.filter((val) => {
      const rVal = (val.lastname.toLocaleLowerCase().includes(args)) || (val.firstname.toLocaleLowerCase().includes(args));
      return rVal;
    })

  }

}
