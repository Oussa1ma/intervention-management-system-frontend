import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class UtilitiesService {
  constructor(private toastr: ToastrService) {}

  /**
   * @params array: Tass[] => array of tasks to filter
   * @params task: Task => task to remove
   * @return Task[] => filtered array
   */
  filter(array: Task[], task: Task): Task[] {
    return array.filter((T: Task) => T._id != task._id);
  }

  /**
   * @params array: Tass[] => array of tasks to filter
   * @params id: string => id of task to remove
   * @return Task[] => filtered array
   */
  filterById(array: Task[], id: string): Task[] {
    return array.filter((T: Task) => T._id != id);
  }

  /**
   * @params array: Tass[] => array of tasks
   * @params task: Task => task to find
   * @return boolean => task found or not
   */
  find(array: Task[], task: Task): boolean {
    return !!array.find((T: Task) => T._id == task._id);
  }

  /**
   * @params array: Tass[] => array of tasks
   * @params id: string => id of task to find
   * @return boolean => task found or not
   */
  findById(array: Task[], id: string): boolean {
    return !!array.find((T: Task) => T._id == id);
  }

  getDateDifference(given) {
    let difference = -moment(given).diff(
      moment(new Date(), 'YYYY-MM-DD hh:mm:ss'),
      'minutes'
    );

    if (difference > 59) {
      difference = -moment(given).diff(
        moment(new Date(), 'YYYY-MM-DD hh:mm:ss'),
        'hours'
      );
      if (difference > 24) {
        difference = -moment(given).diff(
          moment(new Date(), 'YYYY-MM-DD hh:mm:ss'),
          'days'
        );
        return `${difference} jr(s)`;
      }
      return `${difference} hr(s)`;
    } else return `${difference} min(s)`;
  }

  infoToastr(message: string, title: string) {
    this.toastr.info(message, title, {
      timeOut: 5000,
      progressBar: true,
      progressAnimation: 'increasing',
      positionClass: 'toast-top-right',
    });
  }

  errorToastr(message: string, title: string) {
    this.toastr.error(message, title, {
      timeOut: 2000,
      progressBar: true,
      progressAnimation: 'increasing',
      positionClass: 'toast-top-right',
    });
  }

  warningToastr(message: string, title: string) {
    this.toastr.warning(message, title, {
      timeOut: 2000,
      progressBar: true,
      progressAnimation: 'increasing',
      positionClass: 'toast-top-center',
    });
  }
}
