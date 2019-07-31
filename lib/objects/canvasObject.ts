import {
  Angle,
  Vector,
} from '@teedev/core';

import {
  Canvas,
} from "../index";

export default class CanvasObject {
  canvas   : Canvas | null

  position : Vector
  angle    : Angle
  scale    : Vector

  children : CanvasObject[]

  beforeRenderHandler : Function | null
  onRenderHandler     : Function | null
  afterRenderHandler  : Function | null

  constructor({
    angle    = new Angle(0),
    scale    = new Vector(1, 1),
    position = new Vector(0, 0),

    children = [],

    beforeRender = null,
    onRender     = null,
    afterRender  = null,
  } = {}) {
    this.canvas = null;

    this.angle    = angle;
    this.scale    = scale;
    this.position = position;

    this.children = children;

    this.beforeRenderHandler = beforeRender;
    this.onRenderHandler     = onRender;
    this.afterRenderHandler  = afterRender;
  }

  load(
    canvas    : Canvas,
    callback ?: Function
  ) {
    // TODO - Might need to be an array so element can be rendered on multiple canvases.
    this.canvas = canvas;

    if (callback) {
      callback(canvas);
    }

    if (this.children.length) {
      this.children.forEach((child) => {
        child.load(canvas, callback);
      });
    }
  }

  render(
    context   : CanvasRenderingContext2D,
    callback ?: Function
  ) {
    if (this.beforeRenderHandler) {
      this.beforeRenderHandler(this, context);
    }

    context.save();
    context.translate(this.position.x, this.position.y);
    context.rotate(this.angle.radians);
    context.scale(this.scale.x, this.scale.y);

    if (callback) {
      callback();
    }

    if (this.onRenderHandler) {
      this.onRenderHandler(this, context);
    }
    
    this.children.forEach((child) => {
      child.render(context);
    });

    if (this.afterRenderHandler) {
      this.afterRenderHandler(this, context);
    }

    context.restore();
  }
}
