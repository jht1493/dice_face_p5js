class eff_pose_net {
  static meta_props = { alpha: [255, 230, 180, 100, 10] };
  constructor(props) {
    Object.assign(this, props);
    this.init(this);
  }
  render() {
    if (this.poseNet) {
      this.poseNet.video = this.video;
    }
    a_poses = this.poses;
    // this.drawKeypoints(this.poses);
    this.drawSkeleton(this.poses);
    this.drawFigure(this.poses);
  }
  init() {
    this.video = this.input.elt;
    this.poses = [];
    ui_message('loading model...');
    this.poseNet = ml5.poseNet(this.video, function () {
      // console.log('eff_pose_net Model ready!');
      ui_message('');
    });
    this.poseNet.on('pose', (results) => {
      // console.log('eff_pose_net pose results.length', results.length);
      this.poses = results;
    });
  }
  drawFigure(poses) {
    // noFill();
    strokeWeight(0);
    let pad = this.isrc.pad;
    // let w = pad.width;
    let h = pad.height;
    this.px0 = pad.x0;
    this.py0 = pad.y0;
    this.r1 = h / this.input.height;
    // Loop through all the poses detected
    for (let i = 0; i < poses.length; i++) {
      let col = dot_colors[i % dot_colors.length];
      stroke(col);
      fill(col[0], col[1], col[2], 100);
      let pose = poses[i].pose;
      this.draw_pose(pose);
    }
  }
  draw_pose(pose) {
    this.draw_neck(pose);
    this.draw_torso(pose);
  }
  draw_neck(pose) {
    let { px0, py0, r1 } = this;
    let fw = pose.rightEar.x - pose.leftEar.x;
    let sl = pose.leftShoulder.y;
    let sr = pose.rightShoulder.y;
    let ds = sr - sl;
    sl += ds / 2;
    let fh = sl - pose.nose.y;
    let { x, y } = pose.nose;
    x = x * r1 + px0;
    y = y * r1 + py0;
    fw *= r1;
    fh *= r1;
    ellipse(x, y, fw, fh);
    let w = fw / 8;
    let h = fh / 2;
    let y1 = y + h;
    let x1 = x - w;
    let x2 = x + w;
    let y3 = y1 + h;
    quad(x1, y1, x2, y1, x2 + w, y3, x1 - w, y3);
    this.w = w;
    this.h = h;
  }
  draw_torso(pose) {
    let { px0, py0, r1, h } = this;
    let x1 = pose.rightShoulder.x * r1 + px0;
    let y1 = pose.rightShoulder.y * r1 + py0;
    let x2 = pose.leftShoulder.x * r1 + px0;
    let y2 = pose.leftShoulder.y * r1 + py0;
    let x3 = pose.leftHip.x * r1 + px0;
    let y3 = pose.leftHip.y * r1 + py0;
    let x4 = pose.rightHip.x * r1 + px0;
    let y4 = pose.rightHip.y * r1 + py0;
    let x5 = x4 + (x3 - x4) / 6;
    let y5 = y1 + ((y4 - y1) * 2) / 3;
    let x6 = x3 - (x3 - x4) / 6;
    let y6 = y2 + ((y3 - y2) * 2) / 3;
    // quad(x1, y1, x2, y2, x3, y3, x4, y4);
    quad(x1, y1, x2, y2, x6, y6, x5, y5);
    quad(x5, y5, x6, y6, x3, y3, x4, y4);
    this.draw_arm(pose.rightElbow, pose.rightWrist, x1, y1);
    this.draw_arm(pose.leftElbow, pose.leftWrist, x2, y2);
  }
  draw_arm(elbow, wrist, x2, y2) {
    let { px0, py0, r1, h } = this;
    let x1 = elbow.x * r1 + px0;
    let y1 = elbow.y * r1 + py0;
    let hh = h / 2;
    y2 += hh;
    circle(x2, y2, h);
    let dx = x2 - x1;
    let dy = y2 - y1;
    let r = sqrt(dx * dx + dy * dy);
    let dxh = dx * (hh / r);
    let dyh = dy * (hh / r);
    let x3 = x2 - dyh;
    let y3 = y2 - dxh;
    let x4 = x2 + dyh;
    let y4 = y2 + dxh;
    let j = hh / 2;
    let dxj = dx * (j / r);
    let dyj = dy * (j / r);
    let x5 = x1 - dyj;
    let y5 = y1 - dxj;
    let x6 = x1 + dyj;
    let y6 = y1 + dxj;
    quad(x3, y3, x4, y4, x6, y6, x5, y5);
    this.draw_fore_arm(wrist, x1, y1, j);
  }
  draw_fore_arm(wrist, x1, y1, j) {
    let { px0, py0, r1 } = this;
    let x0 = wrist.x * r1 + px0;
    let y0 = wrist.y * r1 + py0;
    circle(x1, y1, j * 2);
    let dx = x1 - x0;
    let dy = y1 - y0;
    let r = sqrt(dx * dx + dy * dy);
    let hh = j;
    let dxh = dx * (hh / r);
    let dyh = dy * (hh / r);
    let x3 = x1 - dyh;
    let y3 = y1 - dxh;
    let x4 = x1 + dyh;
    let y4 = y1 + dxh;
    let dxj = dxh;
    let dyj = dyh;
    let x5 = x0 - dyj;
    let y5 = y0 - dxj;
    let x6 = x0 + dyj;
    let y6 = y0 + dxj;
    quad(x3, y3, x4, y4, x6, y6, x5, y5);
  }
  drawKeypoints(poses) {
    // fill('yellow');
    noStroke();
    let pad = this.isrc.pad;
    // let w = pad.width;
    let h = pad.height;
    let px0 = pad.x0;
    let py0 = pad.y0;
    let r1 = h / this.input.height;
    // Loop through all the poses detected
    for (let i = 0; i < poses.length; i++) {
      // For each pose detected, loop through all the keypoints
      let col = dot_colors[i % dot_colors.length];
      fill(col);
      let pose = poses[i].pose;
      for (let j = 0; j < pose.keypoints.length; j++) {
        // A keypoint is an object describing a body part (like rightArm or leftShoulder)
        let keypoint = pose.keypoints[j];
        // Only draw an ellipse is the pose probability is bigger than 0.2
        if (keypoint.score > 0.2) {
          // ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
          let { x, y } = keypoint.position;
          x = x * r1 + px0;
          y = y * r1 + py0;
          ellipse(x, y, 10, 10);
        }
      }
    }
  }
  drawSkeleton(poses) {
    strokeWeight(1);
    // stroke('red');
    let pad = this.isrc.pad;
    // let w = pad.width;
    let h = pad.height;
    let px0 = pad.x0;
    let py0 = pad.y0;
    let r1 = h / this.input.height;
    // Loop through all the skeletons detected
    for (let i = 0; i < poses.length; i++) {
      // For every skeleton, loop through all body connections
      let col = dot_colors[i % dot_colors.length];
      stroke(col);
      let skeleton = poses[i].skeleton;
      for (let j = 0; j < skeleton.length; j++) {
        let skel = skeleton[j];
        let partA = skel[0].position;
        let partB = skel[1].position;
        let x1 = partA.x;
        let y1 = partA.y;
        let x2 = partB.x;
        let y2 = partB.y;
        x1 = x1 * r1 + px0;
        y1 = y1 * r1 + py0;
        x2 = x2 * r1 + px0;
        y2 = y2 * r1 + py0;
        line(x1, y1, x2, y2);
      }
    }
  }
}

let a_alpha = 255;
let dot_colors = [
  [255, 0, 0, a_alpha],
  [0, 255, 0, a_alpha],
  [255, 255, 0, a_alpha],
  [0, 0, 0, a_alpha],
];

// For debugging
let a_poses;

// https://learn.ml5js.org/#/reference/posenet
// https://editor.p5js.org/ml5/sketches/PoseNet_webcam
