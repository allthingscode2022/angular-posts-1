import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  // property for building our form
  public theForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private uService: UserService,
    private _flashMessagesService: FlashMessagesService
  ) {}

  ngOnInit() {
    this.initializeForm();
  }

  // method for buidling our form
  public initializeForm(): void {
    this.theForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
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

  // method for submitting our form
  public onSubmit(e): void {
    e.preventDefault();
    this.uService.addUser(this.theForm.value).subscribe(
      res => {
        const { success, message } = res;
        if (success) {
          this._flashMessagesService.show(message, {
            cssClass: 'alert alert-success my-5'
          });
        } else {
          this._flashMessagesService.show(message, {
            cssClass: 'alert alert-danger my-5'
          });
        }
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
