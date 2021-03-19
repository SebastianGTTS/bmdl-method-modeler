import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Tool } from '../../development-process-registry/tool';
import { ToolService } from '../../development-process-registry/tool.service';

@Component({
  selector: 'app-tool',
  templateUrl: './tool.component.html',
  styleUrls: ['./tool.component.css']
})
export class ToolComponent implements OnInit, OnDestroy {

  tool: Tool;

  private routeSubscription: Subscription;

  constructor(
    private toolService: ToolService,
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
    this.toolService.get(id).then((tool) => {
      this.tool = tool;
    }).catch(error => console.log('Load: ' + error));
  }

  updateValue(value: any) {
    const update = (currentElement: Tool) => {
      currentElement.update(value);
      return currentElement;
    };
    this.toolService.update(this.tool._id, update).then(
      () => this.load(this.tool._id)
    ).catch((error) => console.log('UpdateValue: ' + error));
  }

}
