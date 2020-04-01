import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceDash'
})
export class ReplaceDashPipe implements PipeTransform {

  transform(dashed: string): string {

    return dashed.replace(/-/g, ' ');
  }

}
