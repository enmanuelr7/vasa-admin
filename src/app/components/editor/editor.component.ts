import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { BlogService } from 'src/app/services/blog.service';
import { CategoryService } from 'src/app/services/category.service';
import { ActivatedRoute } from '@angular/router';

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
    categoryName: 'select category',
  };

  categories = [{ name: 'select category' }];

  errors = {
    image: '',
    title: '',
    content: '',
    category: ''
  };

  selectedCategory: any;
  disableButton = false;
  imagePreview: any;
  isEdition: boolean;
  hastoCheckImage: boolean;

  constructor(
    private router: Router,
    private auth: AuthService,
    private blogService: BlogService,
    private categoryService: CategoryService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.fetchAllCategories();
    this.checkEditOrCreate();
  }

  fetchAllCategories(): void {
    this.categoryService.getCategories().subscribe(res => {
      this.categories = this.categories.concat(res);
    }, err => {
      console.error(err);
    });
  }

  checkEditOrCreate(): void {
    const blogTitle = this.route.snapshot.params.title;
    if (blogTitle) {
      this.isEdition = true;
      this.hastoCheckImage = false;
      this.blogService.getBlog(blogTitle).subscribe(res => {
        this.blog = res;
        this.imagePreview = this.blog.imageUrl;
        this.selectedCategory = this.categories.find(category => category.name === this.blog.categoryName);
      }, err => {
        console.error(err);
      });
    } else {
      this.selectedCategory = this.categories[0];
      this.isEdition = false;
    }
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
    if (this.isEdition && this.hastoCheckImage) {

      if (
        this.checkTitleErrors() &&
        this.checkCategoryErrors() &&
        this.checkImageErrors() &&
        this.checkContentErrors()
      ) {
        const dashTitle = this.blog.title.replace(/ /g, '-');
        const blogData = new FormData();
        blogData.append('image', this.blog.image);
        blogData.append('categoryName', this.blog.categoryName);
        blogData.append('content', this.blog.content);
        blogData.append('title', dashTitle);
        this.blogService.updateBlog(this.blog.title, blogData).subscribe(() => {
          this.router.navigate(['']);
        }, err => {
          console.log(err.message);
          this.disableButton = false;
        });
      } else {
        this.disableButton = false;
      }


    } else if (this.isEdition && !this.hastoCheckImage) {
      if (
        this.checkTitleErrors() &&
        this.checkCategoryErrors() &&
        this.checkContentErrors()
      ) {
        const dashTitle = this.blog.title.replace(/ /g, '-');
        const blogData = new FormData();

        blogData.append('categoryName', this.blog.categoryName);
        blogData.append('content', this.blog.content);
        blogData.append('title', dashTitle);
        this.blogService.updateBlog(this.blog.title, blogData).subscribe(() => {
          this.router.navigate(['']);
        }, err => {
          console.log(err.message);
          this.disableButton = false;
        });
      } else {
        this.disableButton = false;
      }

    } else {

      if (
        this.checkTitleErrors() &&
        this.checkCategoryErrors() &&
        this.checkImageErrors() &&
        this.checkContentErrors()
      ) {
        const dashTitle = this.blog.title.replace(/ /g, '-');
        const blogData = new FormData();
        blogData.append('image', this.blog.image);
        blogData.append('categoryName', this.blog.categoryName);
        blogData.append('content', this.blog.content);
        blogData.append('title', dashTitle);
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
  }

  onTitleInput() {
    this.checkTitleErrors();
  }

  onCategorySelected(e: any) {
    this.selectedCategory = this.categories.find(c =>
      c.name === e.target.value
    );
    this.blog.categoryName = this.selectedCategory.name;
    this.checkCategoryErrors();
  }

  onFileSelected(event) {
    if (event.target.files.length > 0) {
      this.blog.image = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      console.log(this.imagePreview);
    }
    if (this.isEdition) {
      this.hastoCheckImage = true;
    }
    this.checkImageErrors();
  }

  onContentInput() {
    this.checkContentErrors();
  }

  checkErrors(): void {
    this.checkTitleErrors();
    this.checkCategoryErrors();
    this.checkImageErrors();
    this.checkContentErrors();
  }

  checkTitleErrors(): boolean {
    this.errors.title = '';
    if (!this.blog.title.length) {
      this.errors.title = 'title cannot be empty';
      return false;
    } else if (this.blog.title.length > 200) {
      this.errors.title = 'title cannot exceed 200 characters long';
      return false;
    }
    return true;
  }

  checkCategoryErrors(): boolean {
    this.errors.category = '';
    if (this.blog.categoryName === 'select category') {
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

}
