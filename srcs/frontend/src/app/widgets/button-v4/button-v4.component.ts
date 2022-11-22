import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-button-v4',
  templateUrl: './button-v4.component.html',
  styleUrls: ['./button-v4.component.css']
})
export class ButtonV4Component implements OnInit {
  @Input() text!: string;
  constructor() { }

  ngOnInit(): void {
  }

}
