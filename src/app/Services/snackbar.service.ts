/*
  @project Roadmap
  @author xsvond00
*/

import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackbar: MatSnackBar) { }

  public open(message: string):void{
    this.snackbar.open(message, 'zavřít', {duration:2000, })
  }

}
