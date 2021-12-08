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
    strokeWeight(4);
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
    let dx = fw / 8;
    let dy = fh / 2;
    let y1 = y + dy;
    let x1 = x - dx;
    let x2 = x + dx;
    let y3 = y1 + dy;
    quad(x1, y1, x2, y1, x2 + dx, y3, x1 - dx, y3);
    this.dy = dy;
    this.dx = dx;
  }
  draw_torso(pose) {
    let { px0, py0, r1, dy } = this;
    let y1;
    let x1;
    let y2;
    let x2;
    let y3;
    let x3;
    let y4;
    let x4;
    let y5;
    let x5;
    let y6;
    let x6;
    {
      let { x, y } = pose.rightShoulder;
      x = x * r1 + px0;
      y = y * r1 + py0;
      circle(x, y, dy);
      x1 = x;
      y1 = y;
    }
    {
      let { x, y } = pose.leftShoulder;
      x = x * r1 + px0;
      y = y * r1 + py0;
      circle(x, y, dy);
      x2 = x;
      y2 = y;
    }
    {
      let { x, y } = pose.leftHip;
      x = x * r1 + px0;
      y = y * r1 + py0;
      x3 = x;
      y3 = y;
    }
    {
      let { x, y } = pose.rightHip;
      x = x * r1 + px0;
      y = y * r1 + py0;
      x4 = x;
      y4 = y;
    }
    quad(x1, y1, x2, y2, x3, y3, x4, y4);
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
