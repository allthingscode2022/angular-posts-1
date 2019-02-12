import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from 'src/app/services/post.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { IPost } from 'src/app/models/Interfaces';

@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.scss']
})
export class SinglePostComponent implements OnInit {
  // Object property for saving single post that we fetch from server
  public post;
  // Boolean property for displaying ui interaction
  public loading = false;
  // Boolean property for showing and hiding form
  public toggleForm = false;
  // Boolean property for showing and hiding edit and delete buttons
  public showButton = true;
  // Property for building our form
  public theForm: FormGroup;
  // property for storing an authenticated user email
  public email: string = localStorage.getItem('email');
  // property for storing an authenticated user name
  public name: string = localStorage.getItem('name');
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pService: PostService,
    private _flashMessagesService: FlashMessagesService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.getParams();
  }

  // method for getting params and sending a get request to our server
  public getParams(): void {
    this.route.params.subscribe(params => {
      if (params) {
        if (params.id) {
          this.pService.getSinglePost(params.id).subscribe(
            res => {
              this.post = res;
              this.loading = true;
              this.initializeForm(this.post);
            },
            err => {
              this.loading = false;
              this._flashMessagesService.show(err.error.message, {
                cssClass: 'alert alert-danger my-5'
              });
              setTimeout(() => this.router.navigate(['/posts']), 2500);
            }
          );
        }
      }
    });
  }

  // method for getting post id and sending a delete request to our server
  public deletePost(id: String): void {
    this.pService.deletePost(id).subscribe(
      res => {
        this._flashMessagesService.show(res.message, {
          cssClass: 'alert-success my-5'
        });
        setTimeout(() => {
          this.router.navigate(['/posts']);
        }, 2000);
      },
      error =>
        this._flashMessagesService.show(error.error.message, {
          cssClass: 'alert-danger my-5'
        })
    );
  }

  // method for toggling update form and we also show the input button option
  public toggleEditPostForm(): void {
    this.toggleForm = !this.toggleForm;
    this.showButton = true;
  }

  // method for hiding input show button
  public showReplaceImageInput(): void {
    this.showButton = false;
  }

  // method for building our form, a post argument will be passed
  public initializeForm(post): void {
    this.theForm = this.fb.group({
      title: [post.post.title, [Validators.required, Validators.maxLength(30)]],
      image: [null],
      body: [post.post.body, [Validators.required, Validators.minLength(50)]]
    });
  }

  // method for validating controls on our view
  get f() {
    return this.theForm.controls;
  }

  // method for submitting our form
  public onSubmit(e, post): void {
    e.preventDefault();
    const fd = new FormData();
    fd.append('title', this.theForm.get('title').value);
    fd.append('image', this.theForm.get('image').value || post.image);
    fd.append('body', this.theForm.get('body').value);
    fd.append('email', this.email);
    fd.append('name', this.name);
    fd.append('lastUpdated', JSON.stringify(Date.now()));
    this.pService.updatePost(fd, post._id).subscribe(
      data => {
        this._flashMessagesService.show(data.message, {
          cssClass: 'alert-success my-5'
        });
        this.showButton = true;
        window.location.reload();
      },
      error =>
        this._flashMessagesService.show(error.error.message, {
          cssClass: 'alert-danger my-5'
        })
    );
  }

  // method for updating oyr form image value
  public onFileChange(e): void {
    this.theForm.patchValue({ image: e.target.files[0] });
  }
}
