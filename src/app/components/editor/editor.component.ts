import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { BlogService } from 'src/app/services/blog.service';
import { CategoryService } from 'src/app/services/category.service';

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

  categories = [{ id: 0, name: 'Seleccionar categoría' }];

  errors = {
    image: '',
    title: '',
    content: '',
    category: ''
  };

  selectedCategory: any;
  disableButton = false;


  constructor(
    private router: Router,
    private auth: AuthService,
    private blogService: BlogService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(res => {
      this.categories = this.categories.concat(res);
      this.selectedCategory = this.categories[0];
    });
  }

  goToDashboard(): void {
    this.router.navigate(['']);
  }

  logout(): void {
    this.auth.logOut();
  }

  postBlog(): void {
    this.disableButton = true;
    this.checkErrors();
    if (
      this.checkTitleErrors() &&
      this.checkCategoryErrors() &&
      this.checkImageErrors() &&
      this.checkContentErrors()
    ) {
      const blogData = new FormData();
      blogData.append('image', this.blog.image);
      blogData.append('categoryId', this.blog.categoryId);
      blogData.append('content', this.blog.content);
      blogData.append('title', this.blog.title);
      this.blogService.postBlog(blogData).subscribe(() => {
        this.router.navigate(['']);
      }, err => {
        console.log(err.message);
        this.disableButton = false;
      });
    } else {
      this.disableButton = false;
    }
  }

  onTitleInput() {
    this.checkTitleErrors();
  }

  onCategorySelected(e: any) {
    this.selectedCategory = this.categories.find(c =>
      c.id === parseInt(e.target.value, null)
    );
    this.blog.categoryId = this.selectedCategory.id;
    this.checkCategoryErrors();
  }

  onFileSelected(event) {
    if (event.target.files.length > 0) {
      this.blog.image = event.target.files[0];
    }
    this.checkImageErrors();
  }

  onContentInput() {
    this.checkContentErrors();
  }

  checkTitleErrors(): boolean {
    this.errors.title = '';
    if (!this.blog.title.length) {
      this.errors.title = 'title cannot be empty';
      return false;
    } else if (this.blog.title.length > 100) {
      this.errors.title = 'title cannot exceed 100 characters long';
      return false;
    }
    return true;
  }

  checkCategoryErrors(): boolean {
    this.errors.category = '';
    if (!this.blog.categoryId) {
      this.errors.category = 'you must select a category';
      return false;
    }
    return true;
  }

  checkImageErrors(): boolean {
    this.errors.image = '';
    if (!this.blog.image) {
      this.errors.image = 'you must select an image';
      return false;
    } else if (this.blog.image.type !== 'image/jpeg' && this.blog.image.type !== 'image/png') {
      this.errors.image = 'file must be of type image';
      return false;
    } else if (this.blog.image.size >= 2000000) {
      this.errors.image = 'image cannot exceed 2 MB';
      return false;
    }
    return true;
  }

  checkContentErrors(): boolean {
    this.errors.content = '';
    if (!this.blog.content) {
      this.errors.content = 'content cannot be empty';
      return false;
    }
    return true;
  }

  checkErrors(): void {
    this.checkTitleErrors();
    this.checkCategoryErrors();
    this.checkImageErrors();
    this.checkContentErrors();
  }

}
