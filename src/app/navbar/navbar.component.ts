import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  searchQuery: string = '';

  @Output() search: EventEmitter<string> = new EventEmitter<string>();

  onSearchChange(query: string): void {
    this.search.emit(query);
  }
}
