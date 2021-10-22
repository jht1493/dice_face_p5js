class eff_scan_polar {
  static meta_props = {
    max: [5, 10],
    delta: [1, 5, 10, 15],
    period: [30, 5, 10, 20, 30, 60],
    ncell: [128, 512],
  };
  constructor(props) {
    Object.assign(this, props);
    this.init();
    this.fft_init();
  }
  render() {
    image_copy(this.image, this.input);
    this.period_timer.check(() => {
      this.period_next();
    });
    this.draw_fft();
    image_scaled_pad(this.layer, this.isrc.pad);
  }
  init() {
    this.in_width = this.input.width;
    this.in_height = this.input.height;
    this.init_image();
    this.init_src();
  }
  init_image() {
    let w = this.ncell;
    let h = int(this.ncell * (this.in_height / this.in_width));
    this.image = createImage(w, h);
  }
  init_src() {
    this.src = {};
    this.src.xstart = 0;
    this.src.xend = this.image.width;
    this.src.xdim = this.src.xend - this.src.xstart;
    this.src.ystart = 0;
    this.src.yend = this.image.height;
    this.src.ydim = this.src.yend - this.src.ystart;
    this.src.xstep = 0.01;
    this.src.ystep = 1;
    this.src.x = this.src.xstart;
    this.src.y = this.src.ystart;
  }
  fft_init() {
    this.layer = createGraphics(this.isrc.pad.width, this.isrc.pad.height);
    // this.layer.noStroke();
    let layer = this.layer;
    this.alpha_line = 80;
    // this.alpha_hist = 20;
    this.start = 0; // Window onto fft data
    this.end = this.max * 100;
    this.base = 0;
    this.vols = [];
    this.fft_maxs = [];
    this.vol_len = 1;
    this.n_vol = int(layer.width / this.vol_len);
    this.th_offset = 0;
    this.th_delta = (TWO_PI / 360) * this.delta;
    this.x0 = layer.width / 2;
    this.y0 = layer.height / 2;
    this.dim = this.y0;
    this.iorg = 0;
    this.org = [];
    this.org.push([this.x0, this.y0]);
    let n = 8;
    for (let isec = 0; isec < n; isec++) {
      let th = TWO_PI * (isec / n);
      let rr = this.y0;
      let x1 = rr * cos(th) + this.x0;
      let y1 = rr * sin(th) + this.y0;
      this.org.push([x1, y1]);
    }
    let dhalf = this.dim / 2;
    this.org.push([0, 0 + dhalf]);
    this.org.push([0, 0]);
    this.org.push([layer.width, 0]);
    this.org.push([layer.width, 0 + dhalf]);
    this.org.push([layer.width, layer.height - dhalf]);
    this.org.push([layer.width, layer.height]);
    this.org.push([0, layer.height]);
    this.org.push([0, layer.height - dhalf]);
    this.period_timer = new period_timer(this.period);
    this.init_analyser();
  }
  init_analyser() {
    let a_audioCtx = getAudioContext();
    a_audioCtx.resume();
    this.analyser = a_audioCtx.createAnalyser();
    let stream = this.media.device.stream;
    let source = a_audioCtx.createMediaStreamSource(stream);
    source.connect(this.analyser);
  }
  draw_fft() {
    if (!this.analyser) return;
    let spectrum = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(spectrum);
    let layer = this.layer;
    let i_start = Math.round((spectrum.length * this.start) / 1000);
    let i_end = Math.round((spectrum.length * this.end) / 1000);
    let b_len = layer.width / (i_end - i_start);
    let imax = 0;
    for (let i = i_end; i > i_start; i--) {
      let ff = spectrum[i];
      if (ff > 0) {
        imax = i;
        break;
      }
    }
    let fmax = 0;
    let x0 = this.x0;
    let y0 = this.y0;
    for (let i = i_start; i < i_end; i++) {
      let ff = spectrum[i];
      // let th = map(i, i_start, i_end, 0, TWO_PI);
      let th = map(i, i_start, imax, 0, TWO_PI);
      let rr = map(ff, this.base, 255, 0, 1);
      // layer.fill(ff, 0, 0, this.alpha2);
      // layer.rect(x, layer.height - h, b_len, h);
      let dd = this.dim * 2;
      if (this.iorg != 0) dd = dd / 4;
      rr = rr * dd;
      th = th + this.th_offset;
      let x1 = rr * cos(th);
      let y1 = rr * sin(th);
      let col = this.image.get(this.src.x, this.src.y);
      col[3] = this.alpha_line;
      layer.stroke(col);
      // layer.stroke(ff, 0, 0, this.alpha_line);
      layer.line(x0, y0, x0 + x1, y0 + y1);
      this.src.x += this.src.xstep;
      if (this.src.x > this.src.xend) {
        this.src.x = this.src.xstart;
        this.src.y += this.src.ystep;
        if (this.src.y > this.src.yend) {
          this.src.y = this.src.ystart;
        }
      }
    }
    this.fft_maxs.push(fmax);
    if (this.fft_maxs.length > this.n_vol) {
      this.fft_maxs.splice(0, 1);
    }
    this.th_offset += this.th_delta;
  }
  period_next() {
    this.iorg = (this.iorg + 1) % this.org.length;
    [this.x0, this.y0] = this.org[this.iorg];
  }
}
