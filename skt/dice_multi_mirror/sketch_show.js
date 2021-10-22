function eff_show(ent, vin) {
  // console.log('eff_show ent', ent);
  // console.log('eff_show vin', vin);
  if (!vin) return;
  let img = vin.get();
  image_scaled(img);
}

function image_scaled(img) {
  let w = width;
  let h = height;
  let w2 = img.width;
  let h2 = img.height;
  let hw = h2 / w2;
  if (hw < 1) {
    h = w * hw;
  } else {
    w = w2 * hw;
  }
  image(img, 0, 0, w, h, 0, 0, w2, h2);
}
