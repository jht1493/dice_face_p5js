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
    this.drawKeypoints(this.poses);
    this.drawSkeleton(this.poses);
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
  drawKeypoints(poses) {
    let pad = this.isrc.pad;
    // let w = pad.width;
    let h = pad.height;
    let ox0 = pad.x0;
    let oy0 = pad.y0;
    let r1 = h / this.input.height;

    // Loop through all the poses detected
    for (let i = 0; i < poses.length; i++) {
      // For each pose detected, loop through all the keypoints
      let pose = poses[i].pose;
      for (let j = 0; j < pose.keypoints.length; j++) {
        // A keypoint is an object describing a body part (like rightArm or leftShoulder)
        let keypoint = pose.keypoints[j];
        // Only draw an ellipse is the pose probability is bigger than 0.2
        if (keypoint.score > 0.2) {
          fill(255, 255, 0);
          noStroke();
          // ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
          let { x, y } = keypoint.position;
          x = x * r1 + ox0;
          y = y * r1 + oy0;
          ellipse(x, y, 10, 10);
        }
      }
    }
  }
  drawSkeleton(poses) {
    // Loop through all the skeletons detected
    for (let i = 0; i < poses.length; i++) {
      let pad = this.isrc.pad;
      // let w = pad.width;
      let h = pad.height;
      let ox0 = pad.x0;
      let oy0 = pad.y0;
      let r1 = h / this.input.height;

      let skeleton = poses[i].skeleton;
      // For every skeleton, loop through all body connections
      for (let j = 0; j < skeleton.length; j++) {
        let partA = skeleton[j][0];
        let partB = skeleton[j][1];
        let x1 = partA.position.x;
        let y1 = partA.position.y;
        let x2 = partB.position.x;
        let y2 = partB.position.y;

        x1 = x1 * r1 + ox0;
        y1 = y1 * r1 + oy0;
        x2 = x2 * r1 + ox0;
        y2 = y2 * r1 + oy0;

        stroke(255, 0, 0);
        line(x1, y1, x2, y2);
      }
    }
  }
}

let a_poses;

// https://learn.ml5js.org/#/reference/posenet
// https://editor.p5js.org/ml5/sketches/PoseNet_webcam
