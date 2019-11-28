import { Vector } from '@teedev/core';

export type MouseEventCallback = (mouse: CanvasMouse) => void;

export type MouseButton = 'left' | 'right' | 'middle';
export type MouseButtons = { [button in MouseButton]?: Boolean };

export interface CanvasMouseParams {
  up     ?: MouseEventCallback;
  down   ?: MouseEventCallback;
  move   ?: MouseEventCallback;
  click  ?: MouseEventCallback; 
  drag   ?: MouseEventCallback;
  drop   ?: MouseEventCallback;
  scroll ?: MouseEventCallback;
  target :  HTMLElement;
}

export class CanvasMouse {
  public startPosition : Vector;
  public position      : Vector;
  public movement      : Vector;
  public delta         : Vector;
  public distance      : number;

  public buttons: MouseButtons;

  public target: HTMLElement;

  public dragTollerance = 10;

  private upHandlers     : MouseEventCallback[];
  private downHandlers   : MouseEventCallback[];
  private moveHandlers   : MouseEventCallback[];
  private clickHandlers  : MouseEventCallback[];
  private dragHandlers   : MouseEventCallback[];
  private dropHandlers   : MouseEventCallback[];
  private scrollHandlers : MouseEventCallback[];

  constructor({
    up,
    down,
    move,
    click,
    drag,
    drop,
    scroll,
    target,
  }: CanvasMouseParams) {
    this.startPosition = new Vector();
    this.position      = new Vector();
    this.movement      = new Vector();
    this.delta         = new Vector();
    this.distance      = 0;

    this.buttons = {
      left:   false,
      right:  false,
      middle: false,
    };

    this.onUp     = this.onUp.bind(this);
    this.onDown   = this.onDown.bind(this);
    this.onMove   = this.onMove.bind(this);
    
    this.upHandlers     = up     ? [up]     : [];
    this.downHandlers   = down   ? [down]   : [];
    this.moveHandlers   = move   ? [move]   : [];
    this.clickHandlers  = click  ? [click]  : [];
    this.dragHandlers   = drag   ? [drag]   : [];
    this.dropHandlers   = drop   ? [drop]   : [];
    this.scrollHandlers = scroll ? [scroll] : [];

    this.target = target;
  }

  public destroy() {
    if (this.target) {
      this.target.removeEventListener('mousemove', this.onMove);
    }
  }

  public registerUp(callback: MouseEventCallback) {
    this.addHandler(callback, this.upHandlers);

    this.target.addEventListener(
      'mouseup',
      this.onUp,
      { passive: false },
    );
  }

  public registerDown(callback: MouseEventCallback) {
    this.addHandler(callback, this.downHandlers);

    this.target.addEventListener(
      'mousedown',
      this.onDown,
      { passive: false },
    );
  }

  public registerMove(callback: MouseEventCallback) {
    this.addHandler(callback, this.moveHandlers);

    this.target.addEventListener(
      'mousemove',
      this.onMove,
      { passive: false },
    );
  }

  public unRegisterMove(callback: MouseEventCallback) {
    this.removeHandler(callback, this.moveHandlers);

    if (!this.moveHandlers.length) {
      this.target.removeEventListener(
        'mousemove',
        this.onMove,
      );
    }
  }

  public registerClick(
    callback: MouseEventCallback,
    button: MouseButton = 'left',
  ) {
    this.registerUp((mouse) => {
      if (
        !mouse.buttons[button] &&
        mouse.distance <= mouse.dragTollerance
      ) {
        callback(this);
      }
    });
  }

  public registerDrag(
    callback: MouseEventCallback,
    button: MouseButton = 'left',
  ) {
    const onDrag = (mouse: CanvasMouse) => {
      if (mouse.distance > mouse.dragTollerance) {
        callback(mouse);
      }
    }

    this.registerDown((mouse) => {
      if (mouse.buttons[button]) {
        this.registerMove(onDrag);
      }
    });

    this.registerUp((mouse) => {
      if (!mouse.buttons[button]) {
        this.unRegisterMove(onDrag);
      }
    });
  }

  public registerDrop(
    callback: MouseEventCallback,
    button: MouseButton = 'left',
  ) {
    this.registerUp((mouse) => {
      if (
        !mouse.buttons[button] &&
        mouse.distance > mouse.dragTollerance
      ) {
        callback(this);
      }
    });
  }

  public registerScroll(callback: MouseEventCallback) {

  }

  private addHandler(
    handler: MouseEventCallback,
    handlers: MouseEventCallback[],
  ) {
    handlers.push(handler);
  }

  private removeHandler(
    handler: MouseEventCallback,
    handlers: MouseEventCallback[],
  ) {
    handlers.forEach((h, i) => {
      if (h === handler) {
        handlers.splice(i, 1);
      }
    });
  }

  private callHandlers(
    handlers: MouseEventCallback[],
  ) {
    handlers.forEach((handler) => {
      handler(this);
    });
  }

  private onUp(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.updateMouseData(event, 'up');

    this.callHandlers(this.upHandlers);
  }

  private onDown(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    
    this.resetMouseData(event);
    this.updateMouseData(event, 'down');

    this.callHandlers(this.downHandlers);
  }

  private onMove(event: MouseEvent) {
    this.updateMouseData(event, 'none');

    this.callHandlers(this.moveHandlers);
  }

  private resetMouseData(event: MouseEvent) {
    this.startPosition.x = event.clientX;
    this.startPosition.y = event.clientY;
  }

  private updateMouseData(
    event: MouseEvent,
    action: 'up' | 'down' | 'none',
  ) {
    this.position.x = event.clientX;
    this.position.y = event.clientY;

    this.movement.x = event.movementX;
    this.movement.y = event.movementY;

    this.delta = this.position
      .copy()
      .subtract(this.startPosition);

    this.distance = this.delta.getMagnitude();

    if (action !== 'none') {
      switch (event.button) {
        case 0:
          this.buttons.left = action === 'down';
          break;
        case 1:
          this.buttons.middle = action === 'down';
          break;
        case 2:
          this.buttons.right = action === 'down';
          break;
      }
    }
  }
}
