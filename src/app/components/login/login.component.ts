import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  username = '';
  password = '';

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  login(): void {
    this.auth.logIn(this.username, this.password).subscribe(res => {
      if (res.token) {
        localStorage.setItem('token', res.token);
        this.router.navigate(['']);
      }
    });
  }
}
