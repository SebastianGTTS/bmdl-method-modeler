import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Type } from '../../development-process-registry/type';
import { TypeService } from '../../development-process-registry/type.service';

@Component({
  selector: 'app-type',
  templateUrl: './type.component.html',
  styleUrls: ['./type.component.css']
})
export class TypeComponent implements OnInit, OnDestroy {

  type: Type;

  private routeSubscription: Subscription;

  constructor(
    private typeService: TypeService,
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
    this.typeService.get(id).then((type) => {
      this.type = type;
    }).catch(error => console.log('Load: ' + error));
  }

  updateValue(value: any) {
    const update = (currentElement: Type) => {
      currentElement.update(value);
      return currentElement;
    };
    this.typeService.update(this.type._id, update).then(
      () => this.load(this.type._id)
    ).catch((error) => console.log('UpdateValue: ' + error));
  }

}
