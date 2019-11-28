import {
  CanvasObject,
} from './index';

export class CanvasLayer {
  index  : number
  objects: CanvasObject[]

  constructor(index: number) {
    this.index   = index;
    this.objects = [];
  }

  public addObject(...object: CanvasObject[]): CanvasLayer {
    this.objects.push(...object);

    return this;
  }

  public _render(context: CanvasRenderingContext2D) {
    this.objects.forEach((object) => {
      object._render(context);
    });
  }
}
