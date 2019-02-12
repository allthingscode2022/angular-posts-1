import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  constructor(private auth: AuthenticationService, private router: Router) {}

  ngOnInit() {
    this.can();
  }

  // method that returns boolean and helps us hide or show specific links for authenticated and non authenticated users
  public can(): boolean {
    return this.auth.isAuthenticated();
  }

  // method that logs user out
  public logMeOut(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    this.router.navigate(['login'], {
      queryParams: { message: 'You are now logged out' }
    });
  }
}
