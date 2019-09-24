import { Component } from '@angular/core';
import { Input, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'insoftar';


  constructor(
    private router: Router) {
  }

  fnRedireccion(tipo) {
    if (tipo == 'list') {
        this.router.navigate(['/usuarios']);
    } else {
      this.router.navigate(['/usuarios', '0' ]);
    }
  
  }

}
