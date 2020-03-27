import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Blog } from 'src/app/models/Blog';
import { BlogService } from 'src/app/services/blog.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  blogs: Blog[];
  filteredBlogs: Blog[];
  filter = '';

  categories = [
    { title: 'Todas Las Categorías', value: 0 },
    { title: 'belleza', value: 1 },
    { title: 'fitness', value: 2 },
    { title: 'comida', value: 3 },
    { title: 'mente', value: 4 }
  ];
  selectedCategory: any;

  constructor(
    private router: Router,
    private auth: AuthService,
    private blogService: BlogService
  ) { }

  ngOnInit(): void {
    this.selectedCategory = this.categories[0];
    this.blogService.getBlogs().subscribe(res => {
      this.blogs = res;
      this.filteredBlogs = res;
    });
  }

  filterInput(): void {
    console.log(this.filter);
    this.filteredBlogs = this.blogs.filter(b =>
      b.title.toLowerCase().indexOf(this.filter.toLowerCase()) > -1
    );
    console.log(this.filteredBlogs);
  }

  logout(): void {
    this.auth.logOut();
  }

  deleteBlog(id: number) {
    if (confirm('are you sure you want to delete?') && this.auth.isLogged()) {
      this.blogService.deleteBlog(id).subscribe(() => {
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
    console.log(this.selectedCategory.value);
  }

  onChangeCategory(e: any): void {

    this.selectedCategory = this.categories.find(x =>
      x.value === parseInt(e.target.value, null)
    );

  }

}
