import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Blog } from 'src/app/models/Blog';
import { BlogService } from 'src/app/services/blog.service';
import { CategoryService } from 'src/app/services/category.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  blogs: Blog[];
  filteredBlogs: Blog[];
  filter = '';

  categories = [{name: 'all categories'}];
  selectedCategory: any;

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
    this.blogService.getBlogs().subscribe(res => {
      this.blogs = res;
      this.filteredBlogs = res;
    });
  }

  filterInput(): void {
    this.filteredBlogs = this.blogs.filter(b =>
      b.title.toLowerCase().indexOf(this.filter.toLowerCase()) > -1
    );
  }

  logout(): void {
    this.auth.logOut();
  }

  deleteBlog(title: string) {
    if (confirm('are you sure you want to delete?') && this.auth.isLogged()) {
      this.blogService.deleteBlog(title).subscribe(() => {
        window.location.reload();
      }, () => {
        alert('ha ocurrido un error, inténtalo más tarde');
      });
    }
  }

  goToEditor(): void {
    this.router.navigate(['editor']);
  }

  searchByCategory(): void {
    console.log(this.selectedCategory.name);
  }

  onChangeCategory(e: any): void {
    this.selectedCategory = this.categories.find(x =>
      x.name === e.target.value
    );
  }

}
