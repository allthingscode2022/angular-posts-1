import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  // property for our form
  public theForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private uService: UserService,
    private router: Router,
    private _flashMessagesService: FlashMessagesService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.getParams();
  }

  public getParams(): void {
    this.route.queryParams.subscribe(params => {
      if (params.message) {
        this._flashMessagesService.show(params.message, {
          cssClass: 'alert alert-info my-5'
        });
      }
    });
  }

  // method for building the form
  public initializeForm(): void {
    this.theForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}')
        ]
      ],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  // method for validating controls on our view
  get f() {
    return this.theForm.controls;
  }

  // method for submitting our form values
  public onSubmit(e: Event): void {
    e.preventDefault();
    this.uService.authenticateUser(this.theForm.value).subscribe(
      res => {
        const { success, message, user } = res;
        localStorage.setItem('token', user.token);
        localStorage.setItem('name', `${user.firstname} ${user.lastname}`);
        localStorage.setItem('email', user.email);
        if (success) {
          this._flashMessagesService.show(message, {
            cssClass: 'alert alert-success my-5'
          });
        } else {
          this._flashMessagesService.show(message, {
            cssClass: 'alert alert-danger my-5'
          });
        }
        setTimeout(() => {
          this.router.navigate(['posts']);
        }, 2500);
      },
      err => {
        const { success, message } = err.error;
        if (!success) {
          this._flashMessagesService.show(message, {
            cssClass: 'alert alert-danger my-5'
          });
        }
      }
    );
  }
}
