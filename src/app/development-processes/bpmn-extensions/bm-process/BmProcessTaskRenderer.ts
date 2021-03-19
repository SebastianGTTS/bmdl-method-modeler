import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';
import BpmnRenderer from 'bpmn-js/lib/draw/BpmnRenderer';
import TextRenderer from 'bpmn-js/lib/draw/TextRenderer';
import { is } from 'bpmn-js/lib/util/ModelUtil';
import { append, attr, remove, select } from 'tiny-svg';

export default class BmProcessTaskRenderer extends BaseRenderer {

  static $inject = [
    'eventBus',
    'bpmnRenderer',
    'textRenderer',
  ];

  private static readonly HIGH_PRIORITY = 1500;

  private bpmnRenderer: BpmnRenderer;
  private textRenderer: TextRenderer;

  constructor(eventBus, bpmnRenderer, textRenderer) {
    super(eventBus, BmProcessTaskRenderer.HIGH_PRIORITY);

    this.bpmnRenderer = bpmnRenderer;
    this.textRenderer = textRenderer;
  }

  canRender(element) {
    return is(element, 'bpmn:Task') || is(element, 'bpmn:CallActivity');
  }

  drawShape(parentNode: SVGGElement, element) {
    const shape: SVGRectElement = this.bpmnRenderer.drawShape(parentNode, element);
    const method = element.businessObject.get('method');
    if (method) {
      remove(select(parentNode, 'text'));
      const methodName = this.textRenderer.createText(method.name, {
        box: element,
        align: 'center-middle',
        padding: 5
      });
      append(parentNode, methodName);
      attr(shape, {stroke: 'green', rx: 0, ry: 0});
    } else {
      attr(shape, {stroke: 'red'});
    }
    return shape;
  }

  getShapePath(shape) {
    return this.bpmnRenderer.getShapePath(shape);
  }

}
