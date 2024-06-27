import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-add-book-modal',
  templateUrl: './add-book-modal.component.html',
  styleUrls: ['./add-book-modal.component.css']
})
export class AddBookModalComponent {
  book: any = {
    title: '',
    author: '',
    publicationDate: '',
    price: ''
  };

  constructor(
    public dialogRef: MatDialogRef<AddBookModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if(this.book.price<200){
    this.dialogRef.close(this.book);
    }else{
      console.log('Price is greater than 200, Cant accept book')
    }
  }
}
