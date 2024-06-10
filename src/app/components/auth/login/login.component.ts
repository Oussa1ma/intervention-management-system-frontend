import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Reponse } from 'src/app/models/reponse.model';
import { LoginService } from 'src/app/services/login.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  message: string;
  loginIn: boolean = false;

  private unsubscribe$ = new Subject<boolean>();

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private navigation: Router,
    private uT: UtilitiesService
  ) {
    if (
      (localStorage.getItem('token') && localStorage.getItem('userId')) != null
    ) {
      this.navigation.navigate(['dashboard/default']);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('role');
      this.navigation.navigate(['/login']);
      this.createLoginForm();
    }
  }

  createLoginForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(5),
          Validators.pattern(/\w{5,14}/),
        ]),
      ],
    });
  }

  login() {
    this.loginIn = true;
    if (!this.loginForm.valid) {
      this.message = 'Veuillez Saisir Vos données!';
      this.loginIn = false;
      return;
    }
    this.loginService
      .login(this.loginForm.value)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (reponse: Reponse) => {
          if (reponse.success) {
            localStorage.setItem('token', reponse.token);
            localStorage.setItem('userId', reponse.data._id);
            localStorage.setItem('role', reponse.data.role);
            const url = ['dashboard/default'];
            this.navigation.navigate(url);
          } else {
            this.loginIn = false;
            this.loginForm.get('password').patchValue('')
            this.message = reponse.message;
          }
        },
        (error) => {
          this.uT.warningToastr('Problème Inconnue', 'Connexion');
          this.loginIn = false;
        }
      );
  }

  ngOnInit() {}

  hasFocus() {
    if (this.message) this.message = '';
  }

  lostFocus() {
    if (this.message) this.message = '';
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
    console.log('login destroyed');
  }
}
