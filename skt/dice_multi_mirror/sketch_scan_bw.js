function eff_scan_bw(ent, vin) {
  ent.src = vin;
  ent.img = vin;
  scan_eff_step(ent);
  let img = ent.layer;
  image(img, 0, 0, width, height, 0, 0, img.width, img.height);

  function scan_eff_step(ent) {
    if (!ent.layer) {
      let src = ent.src;
      ent.layer = createGraphics(src.width, src.height);
      ent.layer.background(0, 0, 0, 0);
      ent.layer.noStroke();
    }
    if (!ent.mpos) {
      scan_initpos(ent);
    }
    scan_draw_step(ent);
  }

  function scan_draw_step(ent) {
    let mpos = ent.mpos;
    let layer = ent.layer;
    // layer.background(0, 0, 0, 255);
    // layer.clear();
    layer.fill(mpos.gray, mpos.alpha);
    // layer.fill(255, mpos.gray);
    layer.circle(mpos.x - mpos.d / 2, mpos.y, mpos.d);
    mpos.gray += mpos.color_step;
    if (mpos.gray > 255 || mpos.gray < 0) {
      mpos.color_step *= -1;
      mpos.gray += mpos.color_step;
    }
    scan_step(ent);
  }

  function scan_step(ent) {
    let mpos = ent.mpos;
    if (mpos.pct < 1.0) {
      mpos.x = mpos.startX + (mpos.stopX - mpos.startX) * mpos.pct;
      mpos.y = mpos.startY + (mpos.stopY - mpos.startY) * mpos.pct;
      mpos.pct += mpos.step;
    } else {
      scan_nextpos(ent);
    }
  }

  function scan_nextpos(ent) {
    let mpos = ent.mpos;
    mpos.startX = mpos.stopX;
    mpos.startY = mpos.stopY;
    let img = ent.img;
    let w = img.width;
    let h = img.height;
    mpos.stopX = round(random(w));
    // mpos.stopY = round(random(img.height));
    mpos.stopY = mpos.startY == h ? 0 : h;
    mpos.pct = 0;
    mpos.d = random(mpos.d_range);
  }

  function scan_initpos(ent) {
    ent.mpos = Object.assign({}, scan_mpos_init());
    let mpos = ent.mpos;
    let img = ent.img;
    let w = img.width;
    let h = img.height;
    mpos.step = (1 / width) * 7;
    mpos.startX = round(random(w));
    // mpos.startY = round(random(h));
    mpos.startY = 0;
    mpos.stopX = round(random(w));
    // mpos.stopY = round(random(h));
    mpos.stopY = h;
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
      d_range: [10, 20],
      color_step: 1,
      alpha: 255,
    };
  }
}
