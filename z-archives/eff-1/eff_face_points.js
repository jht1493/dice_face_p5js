class eff_face_points {
  static meta_props = {
    align: ['center', 'left', 'right', 'none'],
    alpha: [255, 230, 180, 100, 10],
    color: ['color', 'black', 'white'],
    ncell: [32, 64, 128, 256, 512, 16],
    shape: ['circle', 'rect'],
  };
  constructor(props) {
    Object.assign(this, props);
    this.col_black = this.color === 'black';
    this.col_white = this.color === 'white';
    this.shapef = this.shape === 'rect' ? rect : ellipse;
    this.init();
  }
  render() {
    if (this.facemesh) {
      this.facemesh.video = this.video;
    }
    this.drawKeypoints(this.predictions);
  }
  init() {
    this.video = this.input.elt;
    this.predictions = [];
    if (typeof ml5 == 'undefined') {
      // console.log('ml5 undefined');
      return;
    }
    ui_message('loading model...');
    this.facemesh = ml5.facemesh(this.video, function () {
      ui_message('');
    });
    this.facemesh.on('predict', (results) => {
      this.predictions = results;
    });
    let w = this.input.width;
    let h = this.input.height;
    this.img = createImage(w, h);
  }
  drawKeypoints(predictions) {
    let img = this.img;
    image_copy(img, this.input);
    let fget = (x, y) => {
      let col = img.get(x, y);
      col[3] = this.alpha;
      return col;
    };
    if (this.col_black) {
      fget = (x, y) => {
        return [0, 0, 0, this.alpha];
      };
    } else if (this.col_white) {
      fget = (x, y) => {
        return [255, 255, 255, this.alpha];
      };
    }
    let pad = this.isrc.pad;
    let w = pad.width;
    let h = pad.height;
    let ox0 = pad.x0;
    let oy0 = pad.y0;

    let rr = h / img.height;

    let c_len = w / this.ncell;

    let align_none = this.align === 'none';
    let align_center = this.align === 'center';
    let align_right = this.align === 'right';

    noStroke();

    for (let i = 0; i < predictions.length; i += 1) {
      const pred = predictions[i];
      const keypoints = pred.scaledMesh;

      // let box = pred.boundingBox;
      // let [x1, y1] = box.topLeft[0];
      // let [x2, y2] = box.bottomRight[0];

      let [x1, y1] = keypoints[10];
      let [x2, y2] = keypoints[152];
      x1 = keypoints[234][0];
      x2 = keypoints[454][0];

      let xlen = x2 - x1;
      let ylen = y2 - y1;

      noFill();
      rect(ox0 + x1 * rr, oy0 + y1 * rr, xlen * rr, ylen * rr);

      let r1 = h / ylen;
      let x0 = 0; // flush left
      if (align_right) x0 = w - xlen * r1;
      else if (align_center) x0 = (w - xlen * r1) / 2;
      else if (align_none) {
        r1 = rr;
        x1 = 0;
        y1 = 0;
      }

      // Draw facial keypoints.
      for (let j = 0; j < keypoints.length; j += 1) {
        let [x, y] = keypoints[j];
        let col = fget(x, y);
        x = (x - x1) * r1 + x0;
        y = (y - y1) * r1;
        fill(col);
        this.shapef(ox0 + x, oy0 + y, c_len, c_len);
      }
    }
  }
}

// https://editor.p5js.org/jht1900/sketches/ZxPcgHsS4
// ml5 Facemesh_Webcam resize

// https://editor.p5js.org/ml5/sketches/MuL4iKCo_
// ml5 Facemesh_Webcam

// https://learn.ml5js.org/#/reference/facemesh
