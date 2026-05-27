import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CreateblogService } from '../../services/createblog-service';
import { ProfileService } from '../../services/profile';
import { UiToastService } from '../../services/ui-toast.service';

@Component({
  selector: 'app-create-blog',
  imports: [FormsModule],
  templateUrl: './create-blog.html',
  styleUrl: './create-blog.css',
})
export class CreateBlog {

  service = inject(CreateblogService);
  profileService = inject(ProfileService);
  router = inject(Router);
  toast = inject(UiToastService);

  blog = {
    title: '',
    content: ''
  };

  submitForm() {

    console.log(this.blog);

    this.service.createblog(this.blog).subscribe({
      next: (res) => {
        console.log('Blog Created Successfully');
        console.log(res);

        this.profileService.incrementBlogCount();

        this.toast.show('Blog created successfully.', 'success');

        this.router.navigate(['/home']);
      },

      error: (err) => {
        console.log(err);
        this.toast.show('Unable to create blog right now.', 'danger');
      }
    });
  }
}