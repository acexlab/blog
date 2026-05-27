import { Injectable, signal } from '@angular/core';

type ToastKind = 'success' | 'danger' | 'warning' | 'info';

@Injectable({
  providedIn: 'root',
})
export class UiToastService {
  readonly visible = signal(false);
  readonly message = signal('');
  readonly kind = signal<ToastKind>('info');

  private dismissTimer: ReturnType<typeof setTimeout> | undefined;

  show(message: string, kind: ToastKind = 'info', duration = 2500) {
    this.message.set(message);
    this.kind.set(kind);
    this.visible.set(true);

    if (this.dismissTimer) {
      clearTimeout(this.dismissTimer);
    }

    this.dismissTimer = setTimeout(() => {
      this.hide();
    }, duration);
  }

  hide() {
    this.visible.set(false);
    this.message.set('');
  }
}