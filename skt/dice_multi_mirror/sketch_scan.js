function eff_scan(ent, vin) {
  scan_init(ent, vin);
  let mpos = ent.mpos;
  for (let ii = 0; ii < mpos.nstep; ii++) {
    scan_draw_step(ent);
  }
  // scan_eff_step(ent);
  let img = ent.layer;
  image(img, 0, 0, width, height, 0, 0, img.width, img.height);

  function scan_init(ent, vin) {
    a_save_name = 'mirror-scan';
    ent.src = vin;
    ent.img = vin;
    if (!ent.layer) {
      let src = ent.src;
      ent.layer = createGraphics(src.width, src.height);
      ent.layer.background(0, 0, 0, 0);
      ent.layer.noStroke();
    }
    if (!ent.mpos) {
      scan_initpos(ent);
    }
  }

  function scan_draw_step(ent) {
    let mpos = ent.mpos;
    let layer = ent.layer;
    let img = ent.img;
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
      scan_nextpos(ent);
    }
  }

  function scan_nextpos(ent) {
    let mpos = ent.mpos;
    mpos.startX = mpos.stopX;
    mpos.startY = mpos.stopY;
    let img = ent.img;
    let wdiv = mpos.wdiv;
    let w = img.width / wdiv;
    let h = img.height;
    mpos.stopX = mpos.startX == w ? 0 : w;
    mpos.stopY = round(random(h));
    // mpos.stopY = mpos.startY == h ? 0 : h;
    mpos.pct = 0;
    mpos.d = random(mpos.d_range);
  }

  function scan_initpos(ent) {
    ent.mpos = Object.assign({}, scan_mpos_init());
    let mpos = ent.mpos;
    let img = ent.img;
    let wdiv = mpos.wdiv;
    let w = img.width / wdiv;
    let h = img.height;
    mpos.step = (1 / width) * 7;
    mpos.startX = 0;
    // mpos.startX = round(random(w));
    mpos.startY = round(random(h));
    // mpos.startY = 0;
    mpos.stopX = w;
    // mpos.stopX = round(random(w));
    mpos.stopY = round(random(h));
    // mpos.stopY = h;
    mpos.pct = 0;
    mpos.d = random(mpos.d_range);
    // console.log(frameCount, 'start', ob.startX,
    // ob.startY, 'stop', ob.stopX, ob.stopY)
  }

  function scan_mpos_init() {
    return {
      step: 0.01, // each step (0.0 to 1.0)
      pct: 0, // Percentage traveled (0.0 to 1.0)
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
      wdiv: 2,
      nstep: 100,
    };
  }
}
