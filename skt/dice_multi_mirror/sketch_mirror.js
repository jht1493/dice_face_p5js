function draw_video() {
  if (myVideo != null) {
    let v1 = myVideo.get();
    mirror_left(v1);
    image(v1, 0, 0, width / 2, height, 0, 0, v1.width / 2, v1.height);
    text('Here ' + v1.width + ' ' + v1.height, 10, 10);
  }
}

function draw_other() {
  if (otherVideo != null) {
    let v2 = otherVideo.get();
    mirror_right(v2);
    let w2 = width / 2;
    let v2w = v2.width / 2;
    image(v2, w2, 0, w2, height, v2w, 0, v2w, v2.height);
    text('Other ' + v2.width + ' ' + v2.height, width / 2, 10);
  }
}

function eff_mirror_left(ent, vin) {
  let v1 = vin.get();
  mirror_left(v1);
  image(v1, 0, 0, width / 2, height, 0, 0, v1.width / 2, v1.height);
}

function eff_mirror_right(ent, vin) {
  let v2 = vin.get();
  mirror_right(v2);
  let w2 = width / 2;
  let v2w = v2.width / 2;
  image(v2, w2, 0, w2, height, v2w, 0, v2w, v2.height);
}

function mirror_left(vimage) {
  mirror_x(vimage, 0);
}

function mirror_right(vimage) {
  mirror_x(vimage, 1);
}

function mirror_x(vimage, right) {
  // console.log('vimage',vimage);
  // console.log('vimage.pixels',vimage.pixels);
  vimage.loadPixels();
  let w = vimage.width;
  let h = vimage.height;
  // console.log('w', w, 'h', h)
  let whalf = w / 2;
  let xstart = 0;
  let xstop = whalf;
  if (right) {
    xstart = whalf;
    xstop = w;
  }
  for (let y = 0; y < h; y++) {
    for (let x = xstart; x < xstop; x++) {
      let ii = (w * y + x) * 4;
      let ri = (w * y + (w - x - 1)) * 4;
      // console.log('x', x, 'y', y)
      // console.log('ii', ii, 'ri', ri)
      vimage.pixels[ii + 0] = vimage.pixels[ri + 0];
      vimage.pixels[ii + 1] = vimage.pixels[ri + 1];
      vimage.pixels[ii + 2] = vimage.pixels[ri + 2];
    }
  }
  vimage.updatePixels();
}
