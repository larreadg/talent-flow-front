import { Component, inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {
  private title = inject(Title);

  ngOnInit() {
    this.title.setTitle(`${environment.appName} ${environment.appVersion}`);
  }
}
