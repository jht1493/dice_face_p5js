let a_info = {};

function eff_facemesh(ent, vin) {
  // let facemesh;
  // let video;
  // let predictions = [];
  if (!vin) return;
  ml_init(ent, vin);
  drawKeypoints(ent.predictions);

  // A function to draw ellipses over the detected keypoints
  function drawKeypoints(predictions) {
    let img = ent.video;
    let w = width;
    let h = height;
    let w2 = img.width;
    let h2 = img.height;
    let rw = w / w2;
    let rh = h / h2;
    // a_info = { rw, rh };
    for (let i = 0; i < predictions.length; i += 1) {
      const keypoints = predictions[i].scaledMesh;
      a_info = predictions[i];
      // Draw facial keypoints.
      for (let j = 0; j < keypoints.length; j += 1) {
        let [x, y] = keypoints[j];
        x = x * rw;
        y = y * rh;
        fill(0, 255, 0);
        ellipse(x, y, 5, 5);
      }
    }
  }

  function ml_init(ent, vin) {
    // createCanvas(640, 480);
    ent.video = vin.elt;
    if (ent.facemesh) {
      ent.facemesh.video = ent.video;
      return;
    }
    ent.predictions = [];
    // console.log('ent.video', ent.video);
    ent.facemesh = ml5.facemesh(ent.video, modelReady);
    ent.facemesh.on('predict', (results) => {
      // console.log('facemesh predict results.length', results.length);
      ent.predictions = results;
    });
  }

  function gotVideo(stream) {
    a_stream = stream;
    console.log('stream', stream);
    console.log('gotVideo video.width', video.width, video.height);
    resizeCanvas(video.width, video.height);
  }

  function modelReady() {
    console.log('Model ready!');
  }
}

// https://editor.p5js.org/jht1900/sketches/ZxPcgHsS4
// ml5 Facemesh_Webcam resize

// https://editor.p5js.org/ml5/sketches/MuL4iKCo_
// ml5 Facemesh_Webcam

// https://learn.ml5js.org/#/reference/facemesh
