import {
  Vector,
} from '@teedev/core';

import {
  CanvasObject,
} from '../index';

export default class CanvasRectangle extends CanvasObject {
  size   : Vector
  fill   : string
  stroke : string

  constructor({
    size   = new Vector(0, 0),

    fill   = '',
    stroke = '',
  } = {}) {
    super(...arguments);

    this.size   = size;

    this.fill   = fill;
    this.stroke = stroke;
  }

  render(context: CanvasRenderingContext2D) {
    super.render(
      context,
      () => {
        context.fillStyle = this.fill;
        context.strokeStyle = this.stroke;

        context.fillRect(
          0,
          0,
          this.size.x,
          this.size.y,
        );
      },
    );
  }
}
