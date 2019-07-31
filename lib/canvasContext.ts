import {
  Angle,
  Vector,
  Transform,
} from '@teedev/core';

export default class CanvasContext extends CanvasRenderingContext2D {
  private _transform: Transform

  private originalSetTransform : Function
  private originalTranslate    : Function
  private originalScale        : Function
  private originalRotate       : Function
  private originalSave         : Function
  private originalRestore      : Function
  
  constructor(context: CanvasRenderingContext2D) {
    super();

    this._transform = new Transform();

    this.originalSetTransform = context.setTransform.bind(context);
    this.originalTranslate    = context.translate.bind(context);
    this.originalScale        = context.scale.bind(context);
    this.originalRotate       = context.rotate.bind(context);
    this.originalSave         = context.save.bind(context);
    this.originalRestore      = context.restore.bind(context);
  }


  applyTransform(): void {
    this.originalSetTransform(
      this._transform.m11,
      this._transform.m12,
      this._transform.m21,
      this._transform.m22,
      this._transform.m31,
      this._transform.m32,
    );
  };

  translate(x: number, y: number): void {
    this._transform.translate(new Vector(x, y));

    this.applyTransform();
  };

  scale(x: number, y: number): void {
    this._transform.scale(new Vector(x, y));

    this.applyTransform();
  };

  rotate(a: number): void {
    this._transform.rotate(new Angle(a));

    this.applyTransform();
  };

  // setTransform(transform: Transform): void {
  //   this.transform = transform;
  // };

  save(): void {
    this._transform.push();
    this.originalSave();
  };

  restore(): void {
    this._transform.pop();
    this.applyTransform();
    this.originalRestore();
  };
}