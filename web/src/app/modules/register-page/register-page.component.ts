import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss'],
})
export class RegisterPageComponent {
  loginForm!: FormGroup;
  constructor(private router: Router, private fromBuilder: FormBuilder) {
    this.loginForm = this.fromBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onLogin() {
    this.router.navigate(['/user-management-dashboard']);
  }
}
