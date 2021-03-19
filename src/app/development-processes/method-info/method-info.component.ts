import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DevelopmentMethod } from '../../development-process-registry/development-method';
import { Decision } from '../../development-process-registry/decision';

@Component({
  selector: 'app-method-info',
  templateUrl: './method-info.component.html',
  styleUrls: ['./method-info.component.css']
})
export class MethodInfoComponent implements OnInit {

  @Input() developmentMethod: DevelopmentMethod;
  @Input() decision: Decision;

  @Output() updateDecisions = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit() {
  }

}
