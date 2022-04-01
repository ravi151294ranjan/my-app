import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stripTags'
})
export class StripTagsPipe implements PipeTransform {
  constructor() {}
  transform(text: string, ...usefulTags: any[]): string {
    return usefulTags.length > 0
      ? text.replace(new RegExp(`<(?!\/?(${usefulTags.join('|')})\s*\/?)[^>]+>|&nbsp;`, 'g'), '')
      : text.replace(/<(?:.|\s)*?>|&nbsp;/g, ' ');
  }
}
