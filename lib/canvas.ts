import {
  Vector,
  Transform,
} from '@teedev/core';

import {
  CanvasLayer,
  CanvasObject,
} from './index';

export default class Canvas {
  public canvas : HTMLCanvasElement | null
  public layers : CanvasLayer[]
  
  private size           : Vector
  private renderingFrame : boolean

  private beforeRenderHandler : Function | null
  private afterRenderHandler  : Function | null
  
  constructor({
    size   = new Vector(100, 100),
    canvas = null,

    beforeRender = null,
    afterRender  = null,
  } = {}) {
    this.size   = size;
    this.canvas = canvas;

    this.layers = [];

    this.renderingFrame = false;

    this.beforeRenderHandler = beforeRender;
    this.afterRenderHandler  = afterRender;

    if (this.canvas) {
      this.canvas!.width = this.width;
      this.canvas!.height = this.height;
    }
  }

  set width(value: number) {
    this.size.x = value;
  }

  set height(value: number) {
    this.size.y = value;
  }

  get width(): number {
    return this.size.x;
  }

  get height(): number {
    return this.size.y;
  }

  get context(): CanvasRenderingContext2D | null {
    if (!this.canvas) {
      return null;
    }

    return this.canvas.getContext('2d');
  }

  getLayer(index: number) {
    // eslint-disable-next-line
    const layer = this.layers.find(layer => layer.index === index);

    if (layer) {
      return layer;
    }

    return this.addLayer(index);
  }

  addLayer(index: number) {
    const newLayer = new CanvasLayer(index);
    this.layers.push(newLayer);

    return newLayer;
  }

  addObject(
    object: CanvasObject,
    layerIndex: number = 0,
  ) {
    this.getLayer(layerIndex).addObject(object);

    object.load(this);
  }

  render() {
    if (
      this.context &&
      !this.renderingFrame
    ) {
      this.renderingFrame = true;

      if (this.beforeRenderHandler) {
        this.beforeRenderHandler(this);
      }

      this.context.setTransform(new Transform());
      this.context.clearRect(0, 0, this.size.x, this.size.y);

      this.layers.sort((a, b) => a.index - b.index);
      this.layers.forEach((layer) => {
        if (this.context) {
          layer.render(this.context);
        }
      });

      if (this.afterRenderHandler) {
        this.afterRenderHandler(this);
      }

      window.requestAnimationFrame(() => {
        this.renderingFrame = false;
      });
    }
  }
}
