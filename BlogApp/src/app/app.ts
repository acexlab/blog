import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { AppToast } from './components/app-toast/app-toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, AppToast],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('BlogApp');
}
