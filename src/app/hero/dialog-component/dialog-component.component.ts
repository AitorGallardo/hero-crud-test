import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-dialog-content-component',
  templateUrl: './dialog-component.component.html',
  styleUrls: ['./dialog-component.component.css']
})

export class DialogContentComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    console.log('data', data);
   }

}
