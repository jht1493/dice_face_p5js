class eff_mask {
  static meta_props = { period: [30, 0, 0.5, 1, 2, 5, 10, 20, 30, 60] };
  constructor(props) {
    Object.assign(this, props);
    let w = this.input.width;
    let h = this.input.height;
    this.layer = createGraphics(w, h);
    // this.layer.background(0, 0, 0, 0);
    this.layer.noStroke();
    this.src = createImage(w, h);
    this.mask_initpos();
    this.period_timer = new period_timer(this.period);
  }
  render() {
    image_copy(this.src, this.input);
    this.mask_draw_step();
    this.src.mask(this.layer);
    image_scaled_pad(this.src, this.isrc.pad);
    this.period_timer.check(() => {
      this.layer.clear();
    });
  }
  mask_draw_step() {
    let mpos = this.mpos;
    let layer = this.layer;
    layer.fill(mpos.gray, mpos.alpha);
    layer.circle(mpos.x - mpos.d / 2, mpos.y, mpos.d);
    mpos.gray += mpos.color_step;
    if (mpos.gray > 255 || mpos.gray < 0) {
      mpos.color_step *= -1;
      mpos.gray += mpos.color_step;
    }
    this.mask_step();
  }
  mask_step() {
    let mpos = this.mpos;
    if (mpos.pct < 1.0) {
      mpos.x = mpos.startX + (mpos.stopX - mpos.startX) * mpos.pct;
      mpos.y = mpos.startY + (mpos.stopY - mpos.startY) * mpos.pct;
      mpos.pct += mpos.step;
    } else {
      this.mask_nextpos();
    }
  }
  mask_nextpos() {
    let mpos = this.mpos;
    mpos.startX = mpos.stopX;
    mpos.startY = mpos.stopY;
    let w = this.layer.width;
    let h = this.layer.height;
    mpos.stopX = round(random(w));
    mpos.stopY = mpos.startY == h ? 0 : h;
    mpos.pct = 0;
    mpos.d = random(mpos.d_range);
  }
  mask_initpos() {
    this.mpos = this.mask_mpos_init();
    let mpos = this.mpos;
    let w = this.layer.width;
    let h = this.layer.height;
    mpos.step = (1 / width) * 7;
    mpos.startX = round(random(w));
    mpos.startY = 0;
    mpos.stopX = round(random(w));
    mpos.stopY = h;
    mpos.pct = 0;
    mpos.d = random(mpos.d_range);
  }
  mask_mpos_init() {
    return {
      step: 0.01, // each step (0.0 to 1.0)
      pct: 0, // Percthisage traveled (0.0 to 1.0)
      gray: 0,
      x: 0,
      y: 50,
      d: 100,
      d_range: [2, 4, 6, 8],
      color_step: 1,
      alpha: 255,
    };
  }
}
