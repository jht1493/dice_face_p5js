class eff_reflect_x {
  static meta_props = {};
  constructor(props) {
    Object.assign(this, props);
  }
  render() {
    let img = this.input.get();
    this.reflect_x(img);
    image_scaled_pad(img, this.isrc.pad);
  }
  reflect_x(img) {
    // console.log('img', img);
    // console.log('img.pixels',img.pixels);
    img.loadPixels();
    let w = img.width;
    let h = img.height;
    let tmp;
    let wstop = Math.floor(w / 2);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < wstop; x++) {
        let ii = (w * y + x) * 4;
        let ri = (w * y + (w - x - 1)) * 4;

        img.pixels[ii + 0] = img.pixels[ri + 0];
        img.pixels[ii + 1] = img.pixels[ri + 1];
        img.pixels[ii + 2] = img.pixels[ri + 2];
      }
    }
    img.updatePixels();
  }
}
