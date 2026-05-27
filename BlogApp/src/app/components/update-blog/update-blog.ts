import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DeleteBlogService } from '../../services/deleteblog-service';
import { UpdateblogService } from '../../services/updateblog-service';
import { ViewblogService } from '../../services/viewblog-service';
import { ProfileService } from '../../services/profile';
import { UiToastService } from '../../services/ui-toast.service';

type BlogResponse = {
  id?: number;
  Id?: number;
  authorId?: number;
  AuthorId?: number;
  title?: string;
  Title?: string;
  content?: string;
  Content?: string;
};

@Component({
  selector: 'app-update-blog',
  imports: [FormsModule, RouterLink],
  templateUrl: './update-blog.html',
  styleUrl: './update-blog.css',
})
export class UpdateBlog {
  deleteService = inject(DeleteBlogService);
  service = inject(UpdateblogService);
  viewService = inject(ViewblogService);
  profileService = inject(ProfileService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  cdr = inject(ChangeDetectorRef);
  toast = inject(UiToastService);

  blogId = '';
  currentUserId: number | null = null;
  loading = true;
  errorMessage = '';
  blogs: any[] = [];

  blog = {
    title: '',
    content: ''
  };

  ngOnInit() {
    this.currentUserId = this.getCurrentUserId();

    this.route.paramMap.subscribe({
      next: (params) => {
        this.blogId = params.get('id') ?? '';

        if (!this.blogId) {
          this.loadBlogs();
          return;
        }

        this.loading = true;
        this.errorMessage = '';

        this.service.getBlog(this.blogId).subscribe({
          next: (res: BlogResponse) => {
            const token = localStorage.getItem('token');
            if (!token) {
              this.loading = false;
              this.errorMessage = 'Session timed out. Please log in.';
              this.toast.show('Session timed out. Please log in.', 'warning');
              this.cdr.detectChanges();
              return;
            }

            const authorId = Number(res?.authorId ?? res?.AuthorId);
            if (this.currentUserId === null) {
              this.loading = false;
              this.errorMessage = 'Session timed out. Please log in.';
              this.toast.show('Session timed out. Please log in.', 'warning');
              this.cdr.detectChanges();
              return;
            }

            if (Number.isNaN(authorId) || authorId !== this.currentUserId) {
              this.loading = false;
              this.errorMessage = 'Only the owner can edit this blog.';
              this.toast.show('Only the owner can edit this blog.', 'warning');
              this.cdr.detectChanges();
              return;
            }

            this.blog = {
              title: res?.title ?? res?.Title ?? '',
              content: res?.content ?? res?.Content ?? ''
            };
            this.loading = false;
            this.toast.show('Blog loaded for editing.', 'info');
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.log(err);
            this.loading = false;
            this.errorMessage = 'Unable to load blog details.';
            this.toast.show('Unable to load blog details.', 'danger');
            this.cdr.detectChanges();
          }
        });
      }
    });
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
        this.loading = false;
        this.errorMessage = 'Unable to load blogs right now.';
        this.cdr.detectChanges();
      }
    });
  }

  get editableBlogs() {
    return this.blogs.filter((blog) => this.canManageBlog(blog));
  }

  canManageBlog(blog: any) {
    return !!localStorage.getItem('token') && this.currentUserId !== null && Number(blog?.authorId) === this.currentUserId;
  }

  private getCurrentUserId() {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      const parsed = Number(storedUserId);
      if (!Number.isNaN(parsed)) {
        return parsed;
      }
    }

    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }

    try {
      const payloadPart = token.split('.')[1];
      if (!payloadPart) {
        return null;
      }

      const payload = JSON.parse(atob(payloadPart.replace(/-/g, '+').replace(/_/g, '/')));
      const userId = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']
        ?? payload.nameid
        ?? payload.sub
        ?? null;
      const parsed = Number(userId);
      return Number.isNaN(parsed) ? null : parsed;
    } catch {
      return null;
    }
  }

  submitForm() {
    if (!this.blogId) {
      this.errorMessage = 'Missing blog id.';
      return;
    }

    const token = localStorage.getItem('token');

    if (!token) {
      this.errorMessage = 'Session timed out. Please log in.';
      this.toast.show('Session timed out. Please log in.', 'warning');
      this.cdr.detectChanges();
      return;
    }

    this.service.updateBlog(this.blogId, this.blog).subscribe({
      next: () => {
        this.toast.show('Blog updated successfully.', 'success');
        this.router.navigate(['/view-blog']);
      },
      error: (err) => {
        console.log(err);
        this.errorMessage = 'Unable to update blog right now.';
        this.toast.show('Unable to update blog right now.', 'danger');
        this.cdr.detectChanges();
      }
    });
  }

  deleteBlog() {
    if (!this.blogId) {
      this.errorMessage = 'Missing blog id.';
      return;
    }

    const token = localStorage.getItem('token');

    if (!token) {
      this.errorMessage = 'Session timed out. Please log in.';
      this.toast.show('Session timed out. Please log in.', 'warning');
      this.cdr.detectChanges();
      return;
    }

    const shouldDelete = window.confirm('Delete this blog?');

    if (!shouldDelete) {
      return;
    }

    this.deleteService.deleteBlog(this.blogId).subscribe({
      next: () => {
        this.profileService.decrementBlogCount();
        this.toast.show('Blog deleted successfully.', 'success');
        this.router.navigate(['/update-blog']);
      },
      error: (err) => {
        console.log(err);

        if (err?.status === 403) {
          this.toast.show('You do not have permission to delete this blog.', 'warning');
          return;
        }

        if (err?.status === 401) {
          this.toast.show('Session timed out. Please log in.', 'warning');
          return;
        }

        this.toast.show('Unable to delete blog.', 'danger');
      }
    });
  }
}
