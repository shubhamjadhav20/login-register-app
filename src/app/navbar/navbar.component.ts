import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  searchQuery: string = '';
  isAdmin:boolean=false;
  userStatus:string='Guest';
  constructor(private authService:AuthService){}
  ngOnInit(): void {
    this.isAdmin = this.authService.getUserRole() === 'Admin';
    if(this.isAdmin){
      this.userStatus='Admin';
      
    }else{
      this.userStatus='Guest';
    }
    // this.loadBooks();
  }

  @Output() search: EventEmitter<string> = new EventEmitter<string>();

  onSearchChange(query: string): void {
    this.search.emit(query);
  }
}
