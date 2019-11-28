import {
  Vector,
  Transform,
} from '@teedev/core';

import {
  CanvasLayer,
  CanvasObject,
} from './index';
import { CanvasMouse } from './canvasMouse';

export interface CanvasParams {
  size   ?: Vector,
  canvas : HTMLCanvasElement,
  beforeRender ?: Function,
  afterRender  ?: Function,
}

export class Canvas {
  public canvas ?: HTMLCanvasElement;
  public layers : CanvasLayer[];

  public mouse : CanvasMouse;
  
  private size           : Vector;
  private renderingFrame : boolean;

  private beforeRenderHandler ?: Function;
  private afterRenderHandler  ?: Function;
  
  constructor({
    canvas,
    size = new Vector(100, 100),

    beforeRender,
    afterRender,
  }: CanvasParams) {
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

    this.mouse = new CanvasMouse({
      target: this.canvas,
    });

    this.mouse.registerClick(
      (mouse) => {
        console.log('Click Handler', mouse);
      },
    );

    this.mouse.registerUp(
      (mouse) => {
        console.log('Up Handler', mouse);
      },
    );

    this.mouse.registerDown(
      (mouse) => {
        console.log('Down Handler', mouse);
      },
    );

    this.mouse.registerDrag(
      (mouse) => {
        console.log('Drag Handler', mouse);
      },
    );

    this.mouse.registerDrop(
      (mouse) => {
        console.log('Drop Handler', mouse);
      },
    );
  }

  public destroy() {
    this.mouse.destroy();
  }

  public set width(value: number) {
    this.size.x = value;
  }

  public set height(value: number) {
    this.size.y = value;
  }

  public get width(): number {
    return this.size.x;
  }

  public get height(): number {
    return this.size.y;
  }

  public get context(): CanvasRenderingContext2D | null {
    if (!this.canvas) {
      return null;
    }

    return this.canvas.getContext('2d');
  }

  public getLayer(index: number) {
    const layer = this.layers.find(layer => layer.index === index);

    if (layer) {
      return layer;
    }

    return this.addLayer(index);
  }

  public addLayer(index: number) {
    const newLayer = new CanvasLayer(index);
    this.layers.push(newLayer);

    return newLayer;
  }

  public addObjects(
    objects: CanvasObject[],
    layerIndex: number = 0,
  ): Canvas {
    this.getLayer(layerIndex).addObject(...objects);

    objects.forEach(o => o._load(this));

    return this;
  }

  public render() {
    if (!this.renderingFrame) {
      this.renderingFrame = true;

      window.requestAnimationFrame(() => {
        if (this.context) {
          if (this.beforeRenderHandler) {
            this.beforeRenderHandler(this);
          }

          this.context.setTransform(new Transform());
          this.context.clearRect(0, 0, this.size.x, this.size.y);

          this.layers.sort((a, b) => a.index - b.index); // TODO - Lets not run a sort on render.
          this.layers.forEach((layer) => {
            if (this.context) {
              layer._render(this.context);
            }
          });

          if (this.afterRenderHandler) {
            this.afterRenderHandler(this);
          }
        }
      
        this.renderingFrame = false;
      });
    }

    return this;
  }
}
