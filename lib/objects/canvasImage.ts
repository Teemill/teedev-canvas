import {
  Vector,
} from '@teedev/core';

import {
  CanvasObject,
  CanvasObjectParams,
} from '../index';

interface CanvasImageParams extends CanvasObjectParams {
  src    ?: string
  size   ?: Vector
  fill   ?: string
  stroke ?: string
}

export class CanvasImage extends CanvasObject {
  size   : Vector
  fill   : string
  stroke : string

  image  : HTMLImageElement

  constructor({
    src    = '',
    size   = new Vector(0, 0),
    fill   = '',
    stroke = '',
  }: CanvasImageParams) {
    // @ts-ignore
    super(...arguments);

    this.size   = size;

    this.image  = new Image();
    this.image.onload = this.onImageLoaded.bind(this);
    this.src    = src;

    this.fill   = fill;
    this.stroke = stroke;
  }

  set src(value: string) {
    this.image.src = value;
  }

  onImageLoaded() {
    if (this.canvas) {
      this.canvas.render();
    }
  }

  render(context: CanvasRenderingContext2D) {
    super.render(
      context,
      () => {
        context.fillStyle = this.fill;
        context.strokeStyle = this.stroke;

        context.drawImage(
          this.image,
          0,
          0,
          this.size.x,
          this.size.y,
        );
      },
    );
  }
}
