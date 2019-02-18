import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PostService } from '../../services/post.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { IPosts } from 'src/app/models/Interfaces';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {
  public uploading = false;
  // Array Object property that stores posts
  public allPosts: IPosts['post'] = [];
  // property that will hold our form
  public theForm: FormGroup;
  public hideForm = false;
  // property for storing authenticated user email
  public email: string = localStorage.getItem('email');
  // property for storing authenticated user name
  public name: string = localStorage.getItem('name');

  constructor(
    private fb: FormBuilder,
    private pService: PostService,
    private _flashMessagesService: FlashMessagesService
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.getPosts();
  }

  // method for building the form
  public initializeForm(): void {
    this.theForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(30)]],
      image: [null, Validators.required],
      body: ['', [Validators.required, Validators.minLength(200)]]
    });
  }

  // method for validating controls on our view
  get f() {
    return this.theForm.controls;
  }

  // method for submitting the form
  public onSubmit(e: Event): void {
    e.preventDefault();
    this.uploading = true;
    const fd = new FormData();
    fd.append('title', this.theForm.get('title').value);
    fd.append('image', this.theForm.get('image').value);
    fd.append('body', this.theForm.get('body').value);
    fd.append('email', this.email);
    fd.append('name', this.name);
    this.pService.addPost(fd).subscribe(
      data => {
        this.getPosts();
        this.theForm.reset();
        this.uploading = false;
        this._flashMessagesService.show(data.message, {
          cssClass: 'alert-success my-5'
        });
      },
      error => {
        this.uploading = false;
        this._flashMessagesService.show(error.error.message, {
          cssClass: 'alert-danger my-5'
        });
      });
  }

  // method for updating form image value
  public onFileChange(e: { target: { files: any[] } }): void {
    this.theForm.patchValue({ image: e.target.files[0] });
  }

  // method for getting all posts
  public getPosts() {
    this.pService.getPosts().subscribe(data => {
      this.allPosts = data.post;
    });
  }

  public cancelPostCreation() {
    this.hideForm = !this.hideForm;
  }
}
