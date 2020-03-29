import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { BlogService } from 'src/app/services/blog.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  blog: any = {
    title: '',
    image: '',
    content: '',
    categoryId: 0,
  };

  categories = [
    { name: 'Seleccionar categoría', id: 0 },
    { name: 'belleza', id: 1 },
    { name: 'fitness', id: 2 },
    { name: 'comida', id: 3 },
    { name: 'mente', id: 4 }
  ];

  selectedCategory: any;
  disableButton = false;


  constructor(
    private router: Router,
    private auth: AuthService,
    private blogService: BlogService
  ) { }

  ngOnInit(): void {
    this.selectedCategory = this.categories[0];
  }

  goToDashboard(): void {
    this.router.navigate(['']);
  }

  onChangeCategory(e: any): void {
    this.selectedCategory = this.categories.find(c =>
      c.id === parseInt(e.target.value, null)
    );
    this.blog.categoryId = this.selectedCategory.id;
  }

  logout(): void {
    this.auth.logOut();
  }

  onFileSelected(event) {
    if (event.target.files.length > 0) {
      this.blog.image = event.target.files[0];
    }
  }

  postBlog(): void {
    this.disableButton = true;
    const blogData = new FormData();
    blogData.append('image', this.blog.image);
    blogData.append('categoryId', this.blog.categoryId);
    blogData.append('content', this.blog.content);
    blogData.append('title', this.blog.title);
    this.blogService.postBlog(blogData).subscribe(res => {
      console.log(res);
      this.router.navigate(['']);
    }, err => {
      console.log(err);
      this.disableButton = false;
    });
  }

}
