function eff_line(ent, vin) {
  //
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
      // ent.layer.noStroke();
    }
    if (!ent.mpos) {
      scan_initpos(ent);
    }
    scan_draw_step(ent);
  }

  function scan_draw_step(ent) {
    let mpos = ent.mpos;
    let layer = ent.layer;
    let img = ent.img;
    let col = img.get(mpos.x, mpos.y);
    layer.stroke(col);
    // layer.circle(mpos.x - mpos.d / 2, mpos.y, mpos.d);
    layer.strokeWeight(mpos.d);
    layer.line(mpos.startX, mpos.startY, mpos.stopX, mpos.stopY);
    mpos.x += 1;
    if (mpos.x >= img.width) {
      mpos.x = 0;
      mpos.y += 1;
      if (mpos.y >= img.height) {
        mpos.y = 0;
      }
    }
    mpos.gray += mpos.color_step;
    if (mpos.gray > 255 || mpos.gray < 0) {
      mpos.color_step *= -1;
      mpos.gray += mpos.color_step;
    }
    scan_nextpos(ent);
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
      d_range: [2, 4, 6, 8],
      color_step: 1,
      alpha: 255,
      sx: 0,
      sy: 0,
    };
  }
}
