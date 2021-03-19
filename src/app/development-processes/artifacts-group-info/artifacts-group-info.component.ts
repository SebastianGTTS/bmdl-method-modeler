import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Artifact } from '../../development-process-registry/artifact';
import { ArtifactService } from '../../development-process-registry/artifact.service';
import { FormGroup } from '@angular/forms';
import { GroupSelection } from '../../development-process-registry/decision';
import { MultipleSelection } from '../../development-process-registry/multiple-selection';

@Component({
  selector: 'app-artifacts-group-info',
  templateUrl: './artifacts-group-info.component.html',
  styleUrls: ['./artifacts-group-info.component.css']
})
export class ArtifactsGroupInfoComponent implements OnInit {

  @Input() groups: MultipleSelection<Artifact>[][];
  @Input() selection: GroupSelection<Artifact>;

  @Output() submitGroupsForm = new EventEmitter<FormGroup>();

  methodElements: Artifact[] = [];

  constructor(
    private artifactService: ArtifactService,
  ) {
  }

  ngOnInit() {
    this.loadMethodElements();
  }

  private loadMethodElements() {
    this.artifactService.getAll().then((artifacts) => this.methodElements = artifacts.docs);
  }

}
