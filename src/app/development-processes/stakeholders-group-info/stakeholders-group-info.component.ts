import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Stakeholder } from '../../development-process-registry/stakeholder';
import { StakeholderService } from '../../development-process-registry/stakeholder.service';
import { FormGroup } from '@angular/forms';
import { GroupSelection } from '../../development-process-registry/decision';
import { MultipleSelection } from '../../development-process-registry/multiple-selection';

@Component({
  selector: 'app-stakeholders-group-info',
  templateUrl: './stakeholders-group-info.component.html',
  styleUrls: ['./stakeholders-group-info.component.css']
})
export class StakeholdersGroupInfoComponent implements OnInit {

  @Input() groups: MultipleSelection<Stakeholder>[][];
  @Input() selection: GroupSelection<Stakeholder>;

  @Output() submitGroupsForm = new EventEmitter<FormGroup>();

  methodElements: Stakeholder[] = [];

  constructor(
    private stakeholderService: StakeholderService,
  ) {
  }

  ngOnInit() {
    this.loadMethodElements();
  }

  private loadMethodElements() {
    this.stakeholderService.getAll().then((stakeholders) => this.methodElements = stakeholders.docs);
  }

}
