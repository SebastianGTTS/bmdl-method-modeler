import { Component, ViewChild } from '@angular/core';
import { NgbCarousel, NgbPagination, NgbSlideEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tool-explanation',
  templateUrl: './tool-explanation.component.html',
  styleUrls: ['./tool-explanation.component.css']
})
/**
 * The ToolExplanationComponent shows the explanation of the tool in the web application.
 *
 * @author Sebastian Gottschalk
 */
export class ToolExplanationComponent {

  @ViewChild(NgbCarousel, {static: false}) carousel: NgbCarousel;
  @ViewChild(NgbPagination, {static: false}) pagination: NgbPagination;

  updateCarousel(tab: number) {
    this.carousel.select(String(tab));
  }

  updatePagination(slideEvent: NgbSlideEvent) {
    this.pagination.selectPage(Number(slideEvent.current));
  }

}
