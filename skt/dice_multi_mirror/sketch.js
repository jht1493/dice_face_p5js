// videos side by side

let myVideo;
let otherVideo;
let room_name = 'Dice-Play-1493';
let a_scale = 1;
let v_width = 640;
// let v_height = 360;
let v_height = 480;

let default_vis = 0;

function setup() {
  createCanvas(v_width, v_height);
  // createCanvas(640, 360);
  // createCanvas(640 / 2, 360 / 2);

  console.log('setup this', this);

  create_ui();

  media_enum();

  create_video();
}

// image(img, dx, dy, dWidth, dHeight, sx, sy, [sWidth], [sHeight])
// image(img, x, y, [width], [height])
// https://developer.mozilla.org/en-US/docs/Web/API/Media_Streams_API/Constraints

function draw() {
  background(255);
  stroke(255);

  tint(255, a_tint);

  if (uI.video_index_left < video_panes.length) {
    let vin = video_panes[uI.video_index_left].vcapture;
    let ent = a_effects[uI.eff_index_left];
    ent.eff(ent, vin);
  } else {
    draw_video();
  }

  if (uI.video_index_right < video_panes.length) {
    let vin = video_panes[uI.video_index_right].vcapture;
    let ent = a_effects[uI.eff_index_right];
    ent.eff(ent, vin);
  } else {
    draw_other();
  }

  update_ui();
}

// https://editor.p5js.org/jht1493/sketches/9AlTdNafC
// p5LiveMedia video dice twins mir

// https://editor.p5js.org/jht1493/sketches/NPAHU279L
// p5LiveMedia video dice twins

// https://editor.p5js.org/jht1493/sketches/0Oj2yPY7P
// p5LiveMedia video dice 1

// https://editor.p5js.org/shawn/sketches/jZQ64AMJc
// p5LiveMedia Test Video
// https://github.com/vanevery/p5LiveMedia
