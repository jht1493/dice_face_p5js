class eff_tunnel {
  static meta_props = {
    delay: [0, 1, 2, 3, 4, 5, 10],
    cross: [1, 0],
    cross_len: [4, 1, 2, 4, 8, 16],
    slit_h: [2, 4, 6, 8],
  };
  constructor(props) {
    Object.assign(this, props);
    this.ndelay = this.delay;
    this.init();
  }
  render() {
    this.tunnel_draw();
    image_scaled_pad(this.layer, this.isrc.pad);
  }
  init() {
    // this.cross_len = 4;
    // this.slit_h = 2;
    this.src = this.input;
    let w = this.input.width;
    let h = this.input.height;
    let layer = createGraphics(w, h);
    layer.noStroke();
    this.layer = layer;
    this.a_image = createImage(w, h);
    this.a_step = 1;
    this.a_colors = [];
    this.a_colr = 0;
    this.a_track = 0;
    this.x_off = 0;
    this.y_off = 0;
    this.idelay = 0;
    this.init_size();
  }
  init_size() {
    let layer = this.layer;
    this.x_pos = this.a_image.width / 2;
    this.y_pos = this.a_image.height / 2;
    if (layer.width > layer.height) {
      this.x_margin = layer.height / 2 - this.cross_len * this.slit_h;
      this.y_margin = 0;
    } else {
      this.x_margin = layer.width / 2 - this.cross_len * this.slit_h;
      this.y_margin = 0;
    }
    this.cross_n = int(width / this.cross_len);
    this.x_off = (layer.width - this.src.width) / 2;
    if (this.x_off < 0) this.x_off = 0;
    this.y_off = (layer.height - this.src.height) / 2;
    if (this.y_off < 0) this.y_off = 0;
    // this.src.position(this.x_off, this.y_off);
  }
  tunnel_draw() {
    let layer = this.layer;
    layer.clear();
    this.draw_video();
    this.idelay++;
    if (this.idelay > this.ndelay) {
      this.idelay = 0;
      this.x_pos += this.a_step;
      if (this.x_pos >= this.a_image.width) {
        this.x_pos = 0;
        this.y_pos += this.a_step;
        if (this.y_pos >= this.a_image.height) {
          this.y_pos = 0;
        }
      }
    }
    if (this.a_track) {
      layer.fill(this.a_colr);
      layer.rect(this.x_pos + this.x_off, 0, this.cross_len, layer.height);
      layer.rect(0, this.y_pos + this.y_off, layer.width, this.cross_len);
    }
  }
  draw_video() {
    let layer = this.layer;
    image_copy(this.a_image, this.src);
    this.a_colr = this.a_image.get(this.x_pos, this.y_pos);
    // this.a_image.filter(BLUR, 5);
    let xm = layer.width / 2;
    let ym = layer.height / 2;
    layer.image(this.a_image, xm - this.x_pos, ym - this.y_pos);
    this.draw_bands(this.a_colr);
  }
  draw_bands(col) {
    let layer = this.layer;
    let cross_len = this.cross_len;
    if (this.idelay == 0) {
      this.a_colors.push(col);
      if (this.a_colors.length > this.cross_n) {
        // Remove first
        this.a_colors.splice(0, 1);
      }
    }
    let w = int(layer.width / 2);
    let h = int(layer.height / 2);
    let xm = w - cross_len / 2;
    // let ym = h - cross_len / 2;
    let ym = h;
    layer.fill(col);
    let xl = xm;
    layer.rect(xl, ym, cross_len, cross_len);
    let xr = xl + cross_len;
    xl -= cross_len;
    let yt = ym - cross_len;
    let yb = ym + cross_len;
    let ci = this.a_colors.length - 2;
    while (ci >= 0) {
      // while (w > this.x_margin && ci >= 0) {
      let co = this.a_colors[ci];
      layer.fill(co);
      if (xl < this.x_margin) {
        let hh = layer.height - xl * 2;
        layer.rect(xl, xl, cross_len, hh);
        layer.rect(xr, xl, cross_len, hh);
        let ww = layer.width - xl * 2;
        layer.rect(xl, xl, ww, cross_len);
        layer.rect(xl, xl + hh, ww, cross_len);
      } else {
        if (this.cross) layer.rect(xl, ym, cross_len, cross_len);
      }
      if (xr <= layer.width - this.x_margin) {
        if (this.cross) layer.rect(xr, ym, cross_len, cross_len);
      }
      xl -= cross_len;
      xr += cross_len;
      // yt -= cross_len;
      // yb += cross_len;
      ci--;
    }
    ci = this.a_colors.length - 2;
    while (ci >= 0) {
      let co = this.a_colors[ci];
      layer.fill(co);
      if (yt >= this.y_margin) {
        if (this.cross) layer.rect(xm, yt, cross_len, cross_len);
      }
      if (yb <= layer.height - this.y_margin) {
        if (this.cross) layer.rect(xm, yb, cross_len, cross_len);
      }
      yt -= cross_len;
      yb += cross_len;
      ci--;
    }
  }
}
