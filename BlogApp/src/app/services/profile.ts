import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, throwError, tap } from 'rxjs';

export interface ProfileSummary {
  userId: number;
  name: string;
  email: string;
  blogCount: number;
}

interface BlogItem {
  authorId?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:5030/api/Blog';
  private readonly profileSubject = new BehaviorSubject<ProfileSummary | null>(this.getCachedProfileSummary());

  readonly profileChanges = this.profileSubject.asObservable();

  getCachedProfileSummary(): ProfileSummary | null {
    const userId = Number(localStorage.getItem('userId'));
    const name = localStorage.getItem('userName');
    const email = localStorage.getItem('userEmail');
    const blogCount = Number(localStorage.getItem('profileBlogCount') ?? '0');

    if (!Number.isFinite(userId) || !name || !email) {
      return null;
    }

    return {
      userId,
      name,
      email,
      blogCount: Number.isFinite(blogCount) ? blogCount : 0,
    };
  }

  cacheProfileSummary(summary: ProfileSummary): void {
    localStorage.setItem('userId', String(summary.userId));
    localStorage.setItem('userName', summary.name);
    localStorage.setItem('userEmail', summary.email);
    localStorage.setItem('profileBlogCount', String(summary.blogCount));
    this.profileSubject.next(summary);
  }

  syncBlogCount(blogCount: number): void {
    const cachedProfile = this.getCachedProfileSummary();

    if (!cachedProfile) {
      return;
    }

    this.cacheProfileSummary({
      ...cachedProfile,
      blogCount: Math.max(0, blogCount),
    });
  }

  incrementBlogCount(): void {
    const cachedProfile = this.getCachedProfileSummary();

    if (!cachedProfile) {
      return;
    }

    this.cacheProfileSummary({
      ...cachedProfile,
      blogCount: cachedProfile.blogCount + 1,
    });
  }

  decrementBlogCount(): void {
    const cachedProfile = this.getCachedProfileSummary();

    if (!cachedProfile) {
      return;
    }

    this.cacheProfileSummary({
      ...cachedProfile,
      blogCount: Math.max(0, cachedProfile.blogCount - 1),
    });
  }

  getProfileSummary(): Observable<ProfileSummary> {
    const token = localStorage.getItem('token');

    if (!token) {
      const cachedProfile = this.getCachedProfileSummary();
      return cachedProfile ? of(cachedProfile) : throwError(() => new Error('No authentication token found.'));
    }

    const decodedUser = this.decodeToken(token);

    if (!decodedUser) {
      const cachedProfile = this.getCachedProfileSummary();
      return cachedProfile ? of(cachedProfile) : throwError(() => new Error('Unable to read the current user from the token.'));
    }

    return this.http.get<BlogItem[]>(this.baseUrl).pipe(
      map((blogs) => ({
        userId: decodedUser.userId,
        name: decodedUser.name,
        email: decodedUser.email,
        blogCount: blogs.filter((blog) => Number(blog?.authorId) === decodedUser.userId).length,
      })),
      tap((summary) => this.cacheProfileSummary(summary)),
      catchError(() => {
        const cachedProfile = this.getCachedProfileSummary();
        if (cachedProfile) {
          this.profileSubject.next(cachedProfile);
          return of(cachedProfile);
        }

        return throwError(() => new Error('Unable to load profile summary.'));
      }),
    );
  }

  private decodeToken(token: string): { userId: number; name: string; email: string } | null {
    try {
      const payloadPart = token.split('.')[1];

      if (!payloadPart) {
        return null;
      }

      const payloadJson = atob(payloadPart.replace(/-/g, '+').replace(/_/g, '/'));
      const payload = JSON.parse(payloadJson);
      const userId = Number(
        payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ?? payload.nameid ?? payload.sub,
      );

      if (!Number.isFinite(userId)) {
        return null;
      }

      return {
        userId,
        name: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ?? payload.unique_name ?? 'User',
        email: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ?? payload.email ?? 'N/A',
      };
    } catch {
      return null;
    }
  }
}
