let a_vid;
let stiff_f = [10, 100, 500];
// let stiff_f = [1, 1, 1];
let a_buf = [];
let a_state = {};
let a_scale = 0.5;
let i_width = 640 * a_scale;
let i_height = 360 * a_scale;
// let i_height = 480 * a_scale;
let a_img;
let small_img;
let small_scale = 1;

function setup() {
  createCanvas(i_width, i_height);
  pixelDensity(1);
  let vconstraints = {
    video: {
      width: 1920,
      height: 1080,
    },
  };
  a_vid = createCapture(vconstraints, function(stream) {
    a_state.ready = 1;
  });
  a_vid.size(width, height);
  a_vid.hide(); // hide it
  a_img = createImage(width, height);
  let sw = int(width/small_scale);
  let sh = int(height/small_scale);
  small_img = createImage(sw, sh);
  console.log('a_img', a_img);
  background(255);
  create_ui();
}

function draw() {
  if (a_state.ready && !a_state.inited) {
    vid_init();
  }
  update_img();
  let dx = 0;
  let dy = 0;
  let sWidth = a_img.width;
  let sHeight = a_img.height;
  let dWidth = width;
  let rr = (dWidth / sWidth);
  let dHeight = sHeight * rr;
  image(a_img,dx,dy,dWidth,dHeight,0,0);
  
  small_img.copy(a_vid,0,0,a_vid.width,a_vid.height,0,0,small_img.width,small_img.height);
  small_img.filter(BLUR,5);
  image(small_img,0,0,width/2,dHeight,0,0,small_img.width/2,small_img.height);
  
  update_ui();
}

// copy(srcImage, sx, sy, sw, sh, dx, dy, dw, dh)

// image(img, x, y, [width], [height])
// image(img, dx, dy, dWidth, dHeight, sx, sy, [sWidth], [sHeight])

function update_img() {
  a_img.loadPixels();
  a_vid.loadPixels();
  let rf = stiff_f[0];
  let bf = stiff_f[1];
  let gf = stiff_f[2];
  let rm = rf - 1;
  let bm = bf - 1;
  let gm = gf - 1;
  let w = a_vid.width;
  let h = a_vid.height;
  // console.log({w,h});
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      let ii = (w * y + x) * 4;
      a_buf[ii + 0] = (a_buf[ii + 0] * rm + a_vid.pixels[ii + 0]) / rf;
      a_buf[ii + 1] = (a_buf[ii + 1] * bm + a_vid.pixels[ii + 1]) / bf;
      a_buf[ii + 2] = (a_buf[ii + 2] * gm + a_vid.pixels[ii + 2]) / gf;
      a_img.pixels[ii + 0] = a_buf[ii + 0];
      a_img.pixels[ii + 1] = a_buf[ii + 1];
      a_img.pixels[ii + 2] = a_buf[ii + 2];
      a_img.pixels[ii + 3] = 255;
    }
  }
  a_img.updatePixels();
}

function vid_init() {
  print('vid_init');
  a_state.inited = 1;
  let w = a_vid.width;
  let h = a_vid.height;
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      let ii = (w * y + x) * 4;
      a_buf[ii + 0] = a_vid.pixels[ii + 0];
      a_buf[ii + 1] = a_vid.pixels[ii + 1];
      a_buf[ii + 2] = a_vid.pixels[ii + 2];
    }
  }
}

function create_ui() {
  createSpan().id('isti');
  createSpan().id('ifps');
  createElement('br');
  createButton('Size Full ').mousePressed(function() {
    resizeCanvas(windowWidth, windowHeight);
  });
  createButton('Inset').mousePressed(function() {
    resizeCanvas(i_width, i_height);
  });
  createElement('br');
}

function update_ui() {
  select('#ifps').html('[fps=' + round(frameRate(), 2) + '] ')
  select('#isti').html(stiff_f + '')
}

// https://editor.p5js.org/jht1493/sketches/xt90rp8XO
// dice video HD filter

// https://editor.p5js.org/jht1493/sketches/NA9J3TLcV
// dice video HD

// https://editor.p5js.org/jht1493/sketches/3pLIbunoP
// dice pixel bestill rgb HD

// https://editor.p5js.org/jht1493/sketches/eiIj2eA05
// https://editor.p5js.org/jht1493/present/eiIj2eA05
// dice pixel bestill rgb ghost resize

// https://editor.p5js.org/jht1493/sketches/vCM9rRyan
// dice pixel bestill rgb ghost

// https://editor.p5js.org/jht1493/sketches/zIXjQotQf
// dice pixel bestill rgb ui

// https://editor.p5js.org/jht1493/sketches/1fCy5yqiP
// dice pixel bestill