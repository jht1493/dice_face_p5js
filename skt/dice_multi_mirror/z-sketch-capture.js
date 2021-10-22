let a_devices = [];
let i_width = 320;
let i_height = 240;
let a_masks = [];

function setup() {
  createCanvas(i_width, i_height);
  create_masks();
  create_ui();
  media_enum();
}

function draw() {
  background(255);
  for (let ii = 0; ii < a_devices.length; ii++) {
    let ent = a_devices[ii];
    let img = ent.vcapture.get();
    img.mask(a_masks[ii % a_masks.length]);
    image(img, 0, 0, width, height, 0, 0, i_width, i_height);
  }
  update_ui();
}

// image(img, x, y, [width], [height])
// image(img, dx, dy, dWidth, dHeight, sx, sy, [sWidth], [sHeight])

function create_ui() {
  createButton('Fullscreen').mousePressed(function () {
    toggleFullScreen();
  });
  createButton('Resize ').mousePressed(function () {
    resizeCanvas(windowWidth, windowHeight);
  });
  createButton('Inset').mousePressed(function () {
    resizeCanvas(i_width, i_height);
  });
  createSpan().id('ifps').style('background', 'gray');
  createElement('br');
}

function update_ui() {
  let fps = round(frameRate(), 2);
  select('#ifps').html('[fps=' + fps + ']');
}

function windowResized() {
  // resizeCanvas(windowWidth, windowHeight);
}

function toggleFullScreen() {
  if (!document.documentElement.requestFullscreen) {
    console.log('NO document.documentElement.requestFullscreen');
    return;
  }
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

function create_masks() {
  a_masks[0] = mask_0();
  a_masks[1] = mask_1();
}

function mask_0() {
  let msk = createGraphics(i_width, i_height);
  msk.background(0, 0, 0, 0);
  msk.fill(255, 255, 255, 255);
  let w = i_width;
  let h = i_height;
  msk.rect(0, 0, w, h);
  return msk.get();
}

function mask_1() {
  let msk = createGraphics(i_width, i_height);
  msk.background(0, 0, 0, 0);
  msk.fill(255, 255, 255, 255);
  let w = i_width;
  let h = i_height;
  let wp = int(w / 3);
  let x1 = w - wp;
  let y1 = 0;
  let x2 = w;
  let y2 = 0;
  let x3 = w;
  let y3 = h;
  let x4 = wp;
  let y4 = h;
  msk.quad(x1, y1, x2, y2, x3, y3, x4, y4);
  return msk.get();
}

// quad(x1, y1, x2, y2, x3, y3, x4, y4, [detailX], [detailY])

function create_videos(devices) {
  for (let ent of devices) {
    // for (let ii = 0; ii < devices.length; ii++) {
    //   let ent = devices[ii];
    let vwidth = i_width;
    let vcap = {
      video: {
        deviceId: { exact: ent.deviceId },
        width: { exact: vwidth },
      },
    };
    let vcapture = createCapture(vcap);
    vcapture.size(320, 240);
    vcapture.hide();
    //a_videos.push(vid);
    ent.vcapture = vcapture;
    createSpan(ent.label);
    createElement('br');
  }
}

function media_enum() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    console.log('enumerateDevices() not supported.');
    return;
  }
  // List cameras and microphones.
  navigator.mediaDevices
    .enumerateDevices()
    .then(function (devices) {
      devices.forEach(function (device) {
        // console.log('device', device);
        // console.log(device.kind + ": " + device.label + " id = [" + device.deviceId + ']');
        if (device.kind == 'videoinput') {
          console.log('device.deviceId', device.deviceId);
          let { label, deviceId } = device;
          a_devices.push({ label, deviceId });
        }
      });
      console.log('a_devices', a_devices);
      create_videos(a_devices);
    })
    .catch(function (err) {
      console.log(err.name + ': ' + err.message);
    });
}

// https://editor.p5js.org/jht1900/sketches/kgjA4AMHu
// capture mask slant

// https://editor.p5js.org/jht1900/sketches/Gx8gNq4kt
// capture mask oval

// https://editor.p5js.org/jht1900/sketches/VZ3dNvyZL
// capture mediaDevices.enumerateDevices

// https://editor.p5js.org/jht1900/sketches/V_2B-60A9
// capture invert mediaDevices.enumerateDevices
