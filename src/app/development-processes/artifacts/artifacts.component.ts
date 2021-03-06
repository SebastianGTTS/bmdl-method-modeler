import { Component, OnInit } from '@angular/core';
import { MethodElement } from '../../development-process-registry/method-element';
import { FormGroup } from '@angular/forms';
import { ArtifactService } from '../../development-process-registry/artifact.service';

@Component({
  selector: 'app-artifacts',
  templateUrl: './artifacts.component.html',
  styleUrls: ['./artifacts.component.css']
})
export class ArtifactsComponent implements OnInit {

  elementLists: { listName: string, elements: MethodElement[] }[] = null;

  constructor(
    private artifactService: ArtifactService,
  ) {
  }

  ngOnInit() {
    this.load();
  }

  private load() {
    this.artifactService.getLists().then(
      lists => this.elementLists = lists,
    ).catch(
      error => console.log('Load: ' + error)
    );
  }

  delete(id: string) {
    this.artifactService.delete(id).then(
      () => this.load()
    ).catch(
      error => console.log('Delete: ' + error)
    );
  }

  add(form: FormGroup) {
    this.artifactService.add(form.value).then(
      () => this.load()
    ).catch(
      error => console.log('Add: ' + error)
    );
  }

}
