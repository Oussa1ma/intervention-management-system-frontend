import { Pipe, PipeTransform } from '@angular/core';
import { Task } from 'src/app/models/task.model';

@Pipe({
  name: 'filterby'
})
export class FilterByPipe implements PipeTransform {


  transform(items: any[], filterBy: string, searchTerm: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchTerm) {
      return items;
    }
    searchTerm = searchTerm.toLocaleLowerCase();

    if(!filterBy)
      return items;

    if(filterBy === 'technicien'){
      return items.filter((it: Task)=> {
        return it.username.toLocaleLowerCase().includes(searchTerm);
      });
    }

    if(filterBy === 'task'){
      return items.filter((it: Task)=> {
        return it.title.toLocaleLowerCase().includes(searchTerm);
      });
    }

    if(filterBy === 'client'){
      return items.filter((item: Task)=> {
        return item.client.toLocaleLowerCase().includes(searchTerm);
      });
    }

    if(filterBy === 'name'){
      return items.filter((it)=> {
        return it.name.toLocaleLowerCase().includes(searchTerm);
      });
    }

  }


}
