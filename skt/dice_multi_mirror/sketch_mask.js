function eff_mask_ellipse(ent, vin) {
  let img = vin.get();
  ent.img = img;
  mask_img(img, ent);
  // image(img, 0, 0, width, height, 0, 0, img.width, img.height);
  image_scaled(img);

  function mask_img(img, ent) {
    if (!ent.layer) {
      ent.layer = createGraphics(img.width, img.height);
      ent.layer.background(0, 0, 0, 0);
      ent.layer.noStroke();
      // ent.layer.fill(255, 255, 255, 255);
      // let w = img.width;
      // let h = img.height;
      // ent.layer.ellipse(w / 2, h / 2, w, h);
    }
    if (!ent.mpos) {
      mask_initpos(ent);
    }
    mask_draw_step(ent);
    img.mask(ent.layer);
  }

  function mask_draw_step(ent) {
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
    mask_step(ent);
  }

  function mask_step(ent) {
    let mpos = ent.mpos;
    if (mpos.pct < 1.0) {
      mpos.x = mpos.startX + (mpos.stopX - mpos.startX) * mpos.pct;
      mpos.y = mpos.startY + (mpos.stopY - mpos.startY) * mpos.pct;
      mpos.pct += mpos.step;
    } else {
      mask_nextpos(ent);
    }
  }

  function mask_nextpos(ent) {
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

  function mask_initpos(ent) {
    ent.mpos = Object.assign({}, mask_mpos_init);
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

  function mask_mpos_init() {
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
    };
  }
}
