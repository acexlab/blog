import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ViewblogService } from '../../services/viewblog-service';

@Component({
  selector: 'app-view-blog',
  imports: [FormsModule],
  templateUrl: './view-blog.html',
  styleUrl: './view-blog.css',
})
export class ViewBlog {

  service = inject(ViewblogService);
  cdr = inject(ChangeDetectorRef);

  blogs: any[] = [];
  searchTerm = '';
  loading = true;
  errorMessage = '';

  ngOnInit() {
    this.service.getBlogs().subscribe({
      next: (res: any) => {

        console.log(res);

        this.blogs = Array.isArray(res) ? res : [];
        this.loading = false;
        this.cdr.detectChanges();
      },

      error: (err) => {
        console.log(err);
        this.errorMessage = 'Unable to load blogs right now.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });

  }

  get filteredBlogs() {
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) {
      return this.blogs;
    }

    return this.blogs.filter((blog) => {
      const searchableText = `${blog?.title ?? ''} ${blog?.content ?? ''} ${blog?.authorName ?? ''}`.toLowerCase();
      return searchableText.includes(term);
    });
  }
}