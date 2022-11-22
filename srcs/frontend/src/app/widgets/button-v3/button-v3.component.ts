import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-button-v3',
  templateUrl: './button-v3.component.html',
  styleUrls: ['./button-v3.component.css']
})
export class ButtonV3Component implements OnInit {
  @Input() text!: string;
  constructor() { }

  ngOnInit(): void {
  }

}
