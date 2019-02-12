// array post interface
export interface IPosts {
  post: Post[];
  success: boolean;
  message: string;
}

// single post interface
export interface IPost {
  post: Post;
  success: boolean;
  message: string;
}

export interface Post {
  lastUpdated: null | string;
  _id: string;
  title: string;
  image: string;
  body: string;
  email: string;
  creator: string;
  createdOn: string;
  __v: number;
}

// single user interface
export interface IUser {
  success: boolean;
  message: string;
  user: User;
}

export interface User {
  token?: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
}
