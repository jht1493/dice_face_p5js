function eff_triangle(ent, vin) {
  ent.src = vin;
  ent.img = vin;
  scan_init(ent);
  let mpos = ent.mpos;
  for (let ii = 0; ii < mpos.nstep; ii++) {
    scan_draw_step(ent);
  }
  scan_draw_step(ent);
  let img = ent.layer;
  image(img, 0, 0, width, height, 0, 0, img.width, img.height);

  function scan_init(ent) {
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
    // layer.strokeWeight(mpos.d);
    let d = mpos.d;
    let x1 = mpos.x;
    let y1 = mpos.y;
    let x2 = x1 + d;
    let y2 = y1 + d;
    let x3 = x1 - d;
    let y3 = y1 + d;
    if (mpos.s) {
      x1 = mpos.x - d;
      x2 = mpos.x + d;
      y2 = y1;
      x3 = mpos.x;
    }
    mpos.s = !mpos.s;
    // let w = img.width;
    // let h = img.height;
    // let x2 = x1 + random(-d, d);
    // let y2 = y1 + random(-d, d);
    // let x3 = x1 + random(-d, d);
    // let y3 = y1 + random(-d, d);
    // let x4 = x1 + random(-d, d);
    // let y4 = y1 + random(-d, d);
    // let n = random([0, 1, 2]);
    // if (n == 0) layer.line(x1, y1, x2, y2);
    // else if (n == 1) layer.triangle(x1, y1, x2, y2, x3, y3);
    // else if (n == 2) layer.quad(x1, y1, x2, y2, x3, y3, x4, y4);
    // layer.quad(x1, y1, x2, y2, x3, y3, x4, y4);
    layer.triangle(x1, y1, x2, y2, x3, y3);

    mpos.x += d;
    if (mpos.x >= img.width) {
      mpos.x = 0;
      mpos.y += d;
      mpos.s = !mpos.s;
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
      d: 5,
      d_range: [5],
      s: 1,
      color_step: 1,
      alpha: 255,
      nstep: 100,
    };
  }
}
