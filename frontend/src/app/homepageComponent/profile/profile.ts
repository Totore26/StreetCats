import { Component, inject } from '@angular/core';
import { AuthService } from '../../_services/auth/auth-service';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
  standalone: true,
})
export class Profile {

  authservice = inject(AuthService);

  get user() {
    return this.authservice.user();
  }

}
