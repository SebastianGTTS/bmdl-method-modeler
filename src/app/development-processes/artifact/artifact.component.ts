import { Component, OnDestroy, OnInit } from '@angular/core';
import { Artifact } from '../../development-process-registry/artifact';
import { ArtifactService } from '../../development-process-registry/artifact.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-artifact',
  templateUrl: './artifact.component.html',
  styleUrls: ['./artifact.component.css']
})
export class ArtifactComponent implements OnInit, OnDestroy {

  artifact: Artifact;

  private routeSubscription: Subscription;

  constructor(
    private artifactService: ArtifactService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.routeSubscription = this.route.paramMap.subscribe(map => this.load(map.get('id')));
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  load(id: string) {
    this.artifactService.get(id).then((artifact) => {
      this.artifact = artifact;
    }).catch(error => console.log('Load: ' + error));
  }

  updateValue(value: any) {
    const update = (currentElement: Artifact) => {
      currentElement.update(value);
      return currentElement;
    };
    this.artifactService.update(this.artifact._id, update).then(
      () => this.load(this.artifact._id)
    ).catch((error) => console.log('UpdateValue: ' + error));
  }

}
