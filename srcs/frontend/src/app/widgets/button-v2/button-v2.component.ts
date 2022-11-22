import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-button-v2',
  templateUrl: './button-v2.component.html',
  styleUrls: ['./button-v2.component.css']
})
export class ButtonV2Component implements OnInit {

  @Input() text!: string;
  constructor() { }

  ngOnInit(): void {
  }

}
