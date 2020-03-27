import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  goToDashboard(): void {
    this.router.navigate(['']);
  }
}
