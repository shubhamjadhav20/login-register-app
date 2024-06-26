import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { BookService } from '../book.service';
import { AddBookModalComponent } from '../add-book-modal/add-book-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { EditBookModalComponent } from '../edit-book-modal/edit-book-modal.component';

interface Book {
  id: number;
  title: string;
  author: string;
}

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  
  
  books: any[] = [];
  newBook: Book = { id: 0, title: '', author: '' };
  page: number = 1;
  isAdmin:boolean=false;

  constructor(private bookService: BookService, private authService:AuthService,private router:Router,public dialog:MatDialog) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.getUserRole() === 'Admin';
    this.loadBooks();
  }
  // logout():void {
  //   this.authService.logout().subscribe(
  //     () => {
  //       localStorage.removeItem('token');
        
  //       this.router.navigate(['/login']);
  //     },
  //     (error) => {
  //       console.error('Logout failed', error);
  //     }
  //   );
  // }
  openAddBookModal(): void {
    const dialogRef = this.dialog.open(AddBookModalComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addBook(result);
      }
  });
}
openEditBookModal(book: any): void {
  const dialogRef = this.dialog.open(EditBookModalComponent, {
    width: '300px',
    data: { book }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.updateBook(result);
    }
  });
}
  updateBook(book: any): void {
    console.log(book)
    this.bookService.updateBook(book).subscribe(
      res => {
        console.log("HHHHHHHH",res);
        const index = this.books.findIndex(b => b._id == 'book._id');
        console.log("HHEHEHHEE",index);
        if (index !== -1) {
          this.books[index] = book;
        }
      },
      err => {
        console.error('Error updating book', err);
      }
    );
  }
  loadBooks(): void {
    this.bookService.getBooks(this.page).subscribe(
      res => {
        this.books = res;
      },
      err => {
        console.error('Error loading books', err);
      }
    );
  }

  addBook(book:any): void {
    this.bookService.addBook(book).subscribe(
      res => {
        this.loadBooks();
      },
      err => {
        console.error('Error adding book', err);
      }
    );
    }
    deleteBook(bookId: string): void {
      const id= Number(bookId);
      this.bookService.deleteBook(bookId).subscribe(
        res => {
          this.loadBooks();
        },
        err => {
          console.error('Error deleting book', err);
        }
      );
    }
  
    nextPage(): void {
      this.page++;
      this.loadBooks();
    }
  
    previousPage(): void {
      if (this.page > 1) {
        this.page--;
        this.loadBooks();
      }
    }
    navigateToAddBook(): void {
      this.router.navigate(['/add-book']);
    }
  
}

 

