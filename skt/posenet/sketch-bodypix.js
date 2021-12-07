let video;
let poseNet;
let poses = [];
let video_duration;
let new_pos;
// let mov_file = 'body/IMG_E0088-480p.mov';
// let mov_dim = { width: 640, height: 360 };
// let mov_file = './body/trim-cu-2.mov';
// let mov_file = './body/IMG_E0088-480p-trim.mov';
// let mov_file = '../assets/mov/IMG_E0088-480p-trim.mov';
// let mov_file = '../assets/mov/Trimed.mov';
// let mov_file = '../assets/mov/JHT-2011-07-Ashtanga.m4v';
let mov_file = '../assets/mov/JHT-2013-11-14-640x360.m4v';
// let mov_dim = { width: 640, height: 468 };
let mov_dim = { width: 640, height: 360 };
let cycle_period = 1000;
// let a_alpha = 10;
let a_alpha = 20;
let dot_colors = [
  [0, 0, 0, a_alpha],
  [255, 0, 0, a_alpha],
  [0, 255, 0, a_alpha],
  [255, 255, 0, a_alpha],
];
let dot_color_index = 0;
let dot_len = 5;
let line_len = 5;
let line_len_cycle = 1;
let line_len_delta = 0.1;
let line_len_val = line_len;
// let dot_color = [255, 255, 255];
let dot_color = [0, 0, 0, 10];
let g_layer;
let show_video = 1;
let n_segs = 10;
let a_jiggle = 1;
let bodypix;
let segmentation;
let video_ready;

function setup() {
  // createCanvas(320, 180);
  let w = mov_dim.width;
  let h = mov_dim.height;
  createCanvas(w, h);
  g_layer = createGraphics(w, h);

  create_ui();

  video = createVideo(mov_file, vidLoad);

  setInterval(perform_cycle, cycle_period);

  video.hide();

  bodypix = ml5.bodyPix();
}

function draw() {
  background(255);
  line_len_step();
  if (show_video) {
    image(video, 0, 0, width, height);
  }
  if (video_ready) {
    bodypix.segment(video, gotResults);
  }
  drawKeypoints();
  drawSkeleton();
  image(g_layer, 0, 0);
  select('#time_id').html(video.time());
}

function prepare_ml5() {
  console.log('prepare_ml5 video', video);
  // bodypix.segment(video, gotResults);
}

function gotResults(err, result) {
  if (err) {
    console.log(err);
    return;
  }
  segmentation = result;
  g_layer.image(segmentation.backgroundMask, 0, 0, width, height);
}

function line_len_step() {
  // let line_len_cycle = 1;
  // let line_len_delta = 0.1;
  // let line_len_val = line_len;
  if (!line_len_cycle) return;
  line_len_val += line_len_delta;
  if (line_len_val > line_len || line_len_val <= 0) {
    line_len_delta = -1 * line_len_delta;
  }
}

function create_ui() {
  create_video_slider();
  createSpan().id('status');
  create_buttons();
  createSpan().id('time_id');
  createElement('br');
  createCheckbox('Video', show_video).changed(function () {
    show_video = this.checked();
    // if (this.checked()) {
    //   video.show();
    // } else {
    //   video.hide();
    // }
  });
}

function perform_cycle() {
  dot_color = dot_colors[dot_color_index];
  dot_color_index = (dot_color_index + 1) % dot_colors.length;
  // g_layer.clear();
}

function perform_jump() {
  perform_clear();
  poseNet.video = null;
  // poseNet = null;
  video.time(new_pos);
  setTimeout(prepare_ml5, 1000);
}

function vidLoad() {
  console.log('vidLoad width', video.width, 'height', video.height);
  console.log('duration', video.duration());
  video_duration = video.duration();
  video.volume(0);
  video.loop();
  prepare_ml5();
  video_ready = 1;
}

function perform_clear() {
  // g_layer.background(255);
  g_layer.clear();
}

function create_buttons() {
  createButton('Jump').mousePressed(perform_jump);
  createButton('Clear').mousePressed(perform_clear);
  createButton('Red').mousePressed(function () {
    dot_color = [255, 0, 0, 10];
  });
  createButton('Green').mousePressed(function () {
    dot_color = [0, 255, 0, 10];
  });
  createButton('Yellow').mousePressed(function () {
    dot_color = [255, 255, 0, 10];
  });
  createButton('Black').mousePressed(function () {
    dot_color = [0, 0, 0, 10];
  });
}

function create_video_slider() {
  createSlider(0, width, 0)
    .id('slider_id')
    .input(function () {
      // console.log('slider value ', this.value());
      let pos = this.value();
      pos = map(pos, 0, width, 0, video_duration);
      console.log('slider pos ', pos);
      new_pos = pos;
      video.time(pos);
    });
  select('#slider_id').style('width', width + 'px');
  createElement('br');
}

function modelReady() {
  // select('#status').html('Model Loaded');
  console.log('Model Loaded');
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  g_layer.fill(dot_color);
  g_layer.noStroke();
  dot_len = line_len_val;
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        let pos = keypoint.position;
        g_layer.ellipse(pos.x, pos.y, dot_len, dot_len);
      }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  g_layer.stroke(dot_color);
  g_layer.strokeWeight(line_len_val);
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
      let pos1 = skeleton[j][0].position;
      let pos2 = skeleton[j][1].position;
      // g_layer.line(pos1.x, pos1.y, pos2.x, pos2.y);
      let dx = (pos2.x - pos1.x) / n_segs;
      let dy = (pos2.y - pos1.y) / n_segs;
      let px = pos1.x;
      let py = pos1.y;
      let ox = px;
      let oy = py;
      for (let i = 0; i < n_segs; i++) {
        let nx = px + dx + random(-a_jiggle, a_jiggle);
        let ny = py + dy + random(-a_jiggle, a_jiggle);
        g_layer.line(ox, oy, nx, ny);
        ox = nx;
        oy = ny;
        px += dx;
        py += dy;
      }
    }
  }
}

// https://editor.p5js.org/ml5/sketches/PoseNet_webcam

// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
PoseNet example using p5.js
=== */

// Uncaught (in promise) Error: The video element has not loaded data yet. Please wait for `loadeddata` event on the <video> element.
