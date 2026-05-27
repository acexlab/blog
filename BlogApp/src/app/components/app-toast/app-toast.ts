import { Component, inject } from '@angular/core';
import { UiToastService } from '../../services/ui-toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './app-toast.html',
  styleUrl: './app-toast.css',
})
export class AppToast {
  toast = inject(UiToastService);
}