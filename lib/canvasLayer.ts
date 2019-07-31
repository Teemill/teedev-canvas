import {
  CanvasObject,
} from './index';

export default class CanvasLayer {
  index  : number
  objects: CanvasObject[]

  constructor(index: number) {
    this.index   = index;
    this.objects = [];
  }

  addObject(object: CanvasObject) {
    this.objects.push(object);
  }

  render(context: CanvasRenderingContext2D) {
    this.objects.forEach((object) => {
      object.render(context);
    });
  }
}
