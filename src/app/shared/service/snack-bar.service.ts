import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(
    public snackbar: MatSnackBar,
    private zone: NgZone,
  ) { }

  error(message: string) {
    const config = new MatSnackBarConfig();
    config.panelClass = ['background-dark'];
    config.verticalPosition = 'bottom';
    config.horizontalPosition = 'center';
    this.zone.run(() => {
      this.snackbar.open(message, 'x', config);
    });
  }

}