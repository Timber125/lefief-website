import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ContactComponent } from './contact/contact.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ContactComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App { }
