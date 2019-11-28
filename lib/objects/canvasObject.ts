import {
  Angle,
  Vector,
} from '@teedev/core';

import {
  Canvas,
} from "../index";

export interface CanvasObjectParams {
  position     ?: Vector;
  angle        ?: Angle;
  scale        ?: Vector;
  children     ?: CanvasObject[];
  beforeRender ?: Function;
  onRender     ?: Function;
  afterRender  ?: Function;
}

export class CanvasObject {
  canvas   ?: Canvas;

  position : Vector;
  angle    : Angle;
  scale    : Vector;

  children : CanvasObject[];

  beforeRenderHandler ?: Function;
  onRenderHandler     ?: Function;
  afterRenderHandler  ?: Function;

  constructor({
    angle    = new Angle(0),
    scale    = new Vector(1, 1),
    position = new Vector(0, 0),

    children = [],

    beforeRender,
    onRender,
    afterRender,
  }: CanvasObjectParams = {}) {
    this.canvas = undefined;

    this.angle    = angle;
    this.scale    = scale;
    this.position = position;

    this.children = children;

    this.beforeRenderHandler = beforeRender;
    this.onRenderHandler     = onRender;
    this.afterRenderHandler  = afterRender;
  }

  public get mouse() {
    if (!this.canvas) {
      return undefined;
    }

    return this.canvas.mouse;
  }

  public _load(canvas: Canvas) {
    // TODO - Might need to be an array so element can be rendered on multiple canvases.
    this.canvas = canvas;

    this.load(canvas);

    if (this.children.length) {
      this.children.forEach((child) => {
        child._load(canvas);
      });
    }
  }

  public _render(context: CanvasRenderingContext2D) {
    context.save();
    
    if (this.beforeRenderHandler) {
      this.beforeRenderHandler(this, context);
    }
    
    context.translate(this.position.x, this.position.y);
    context.rotate(this.angle.radians);
    context.scale(this.scale.x, this.scale.y);

    this.render(context);

    if (this.onRenderHandler) {
      this.onRenderHandler(this, context);
    }
    
    if (this.children.length) {
      this.children.forEach((child) => {
        child._render(context);
      });
    }

    if (this.afterRenderHandler) {
      this.afterRenderHandler(this, context);
    }

    context.restore();
  }

  protected load(
    canvas: Canvas
  ) {}

  protected render(
    context: CanvasRenderingContext2D,
  ) {}
}
