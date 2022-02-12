class eff_scan_co {
  static meta_props = {};
  constructor(props) {
    Object.assign(this, props);
    this.init();
  }
  render() {
    this.img = this.input.get();
    let nstep = this.mpos.nstep;
    for (let ii = 0; ii < nstep; ii++) {
      this.scan_draw_step();
    }
    // let img = this.layer;
    // image(img, 0, 0, width, height, 0, 0, img.width, img.height);
    image_scaled_pad(this.layer, this.isrc.pad);
  }
  init() {
    let src = this.input;
    this.layer = createGraphics(src.width, src.height);
    // this.layer.background(0, 0, 0, 0);
    this.layer.noStroke();
    this.scan_initpos();
  }
  scan_draw_step() {
    let mpos = this.mpos;
    let layer = this.layer;
    let img = this.img;
    let col = img.get(mpos.x, mpos.y);
    layer.fill(col);
    // layer.circle(mpos.x - mpos.d / 2, mpos.y, mpos.d);
    layer.circle(mpos.x - mpos.dx / 2, mpos.y, mpos.dx);
    mpos.gray += mpos.color_step;
    if (mpos.gray > 255 || mpos.gray < 0) {
      mpos.color_step *= -1;
      mpos.gray += mpos.color_step;
    }
    if (mpos.pct < 1.0) {
      let dx = mpos.stopX - mpos.startX;
      let dy = mpos.stopY - mpos.startY;
      mpos.x = mpos.startX + dx * mpos.pct;
      mpos.y = mpos.startY + dy * mpos.pct;
      mpos.pct += mpos.step;
      mpos.dx = dx * mpos.step * 2;
      mpos.dy = dy * mpos.step * 2;
    } else {
      this.scan_nextpos();
    }
  }
  scan_nextpos() {
    let mpos = this.mpos;
    // mpos.startX = mpos.stopX;
    mpos.irange ^= 1;
    mpos.startX = mpos.range[mpos.irange];
    mpos.irange ^= 1;
    mpos.stopX = mpos.range[mpos.irange];
    mpos.startY = mpos.stopY;
    let img = this.img;
    let h = img.height;
    mpos.stopY = round(random(h));
    mpos.pct = 0;
    mpos.d = random(mpos.d_range);
  }
  scan_initpos() {
    this.mpos = this.scan_mpos_init();
    let mpos = this.mpos;
    let w = this.input.width;
    let h = this.input.height;
    let istartX = 0;
    let istopX = w;
    mpos.irange = 0;
    mpos.range = [istartX, istopX];
    mpos.step = (1 / this.isrc.pad.width) * 7;
    mpos.startX = istartX;
    mpos.startY = round(random(h));
    mpos.stopX = istopX;
    mpos.stopY = round(random(h));
    mpos.pct = 0;
    mpos.d = random(mpos.d_range);
  }
  scan_mpos_init() {
    return {
      step: 0.01, // each step (0.0 to 1.0)
      pct: 0, // Percthisage traveled (0.0 to 1.0)
      gray: 0,
      x: 0,
      y: 50,
      d: 100,
      // d_range: [5],
      // d_range: [2, 4, 6, 8],
      // d_range: [20, 40, 60, 80],
      // d_range: [1, 2, 4, 8, 16],
      d_range: [10],
      dx: 10,
      dy: 10,
      color_step: 1,
      alpha: 255,
      // wdiv: 2,
      nstep: 100,
    };
  }
}
// !!@ why is sketch_scan slower than sketc_sketchy
// maybe accessing video pixel is slow
