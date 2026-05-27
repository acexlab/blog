import { Component, DestroyRef, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProfileService, ProfileSummary } from '../../services/profile';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-profile-view',
  imports: [RouterLink],
  templateUrl: './profile-view.html',
  styleUrl: './profile-view.css',
})
export class ProfileView {
  private profileService = inject(ProfileService);
  private destroyRef = inject(DestroyRef);

  profile: ProfileSummary | null = this.profileService.getCachedProfileSummary();
  loading = !this.profile;
  errorMessage = '';

  ngOnInit() {
    this.profileService.profileChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((profile) => {
        this.profile = profile;
        this.loading = false;
      });

    this.loadProfile();
  }

  loadProfile() {
    this.loading = !this.profile;
    this.errorMessage = '';

    this.profileService.getProfileSummary().subscribe({
      next: (summary) => {
        this.profile = summary;
        this.loading = false;
      },
      error: () => {
        this.profile = null;
        this.errorMessage = 'Unable to load profile details right now.';
        this.loading = false;
      },
    });
  }
}
