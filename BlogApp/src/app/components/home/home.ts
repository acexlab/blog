import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ViewblogService } from '../../services/viewblog-service';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  viewService = inject(ViewblogService);
  cdr = inject(ChangeDetectorRef);

  blogs: any[] = [];
  loading = true;
  errorMessage = '';

  ngOnInit() {
    this.loadBlogs();
  }

  loadBlogs() {
    this.loading = true;
    this.errorMessage = '';

    this.viewService.getBlogs().subscribe({
      next: (res: any) => {
        this.blogs = Array.isArray(res) ? res : [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.errorMessage = 'Unable to load blogs.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
