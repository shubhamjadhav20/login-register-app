import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-book-modal',
  templateUrl: './edit-book-modal.component.html',
  styleUrls: ['./edit-book-modal.component.css']
})
export class EditBookModalComponent {
  book: any;

  constructor(
    public dialogRef: MatDialogRef<EditBookModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Initialize book with a copy of the data passed into the dialog
    this.book = { ...data.book };

    // Convert publicationDate to yyyy-MM-dd format if it's an ISO 8601 string
    if (this.book.publicationDate) {
      this.book.publicationDate = this.book.publicationDate.split('T')[0];
    }
  }

  onCancel(): void {
    // Close the dialog without passing any data
    this.dialogRef.close();
  }

  async onSave(): Promise<void> {
    // Close the dialog and pass back the modified book data
    this.dialogRef.close(this.book);

    // Wait for the dialog to close before reloading the page
    await this.dialogRef.afterClosed().toPromise();

    // Reload the page
    window.location.reload();
  }
}
