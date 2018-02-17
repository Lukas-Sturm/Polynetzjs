export default class Animation_Loop {
  constructor(callback, fps=30) {
    this.delay = 1000 / fps;
    this.time = -1;
    this.frame = -1;
    this.callback = callback;
    this.tref = {};
  }

  setFPS(fps) {
    this.constructor(fps, this.callback);
  }

  loop(timestamp) {
    if (this.time === -1) this.time = timestamp;
    let seg = Math.floor((timestamp - this.time) / this.delay);
    if (seg > this.frame) {
      this.frame = seg;
      this.callback({
        time: timestamp,
        frame: this.frame
      });
    }
    this.tref = window.requestAnimationFrame(this.loop.bind(this))
  }

  start() {
    this.tref = window.requestAnimationFrame(this.loop.bind(this));
  }

  stop() {
    cancelAnimationFrame(this.tref);
    this.time = null;
    this.frame = -1;
  }
}