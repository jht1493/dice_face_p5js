let a_devices = [];
let v_dim = [
  0, // 0
  { width: 320, height: 180 }, // 1
  { width: 320, height: 240 }, // 2
  { width: 640, height: 480 }, // 3
];
let dim_index = 2;
let p_livem;

function create_video() {
  let vconstraints = {
    video: true,
    // video: {
    //   width: v_width,
    //   height: v_height,
    // },
  };
  myVideo = createCapture(vconstraints, function (stream) {
    console.log('create_video stream', stream);
    console.log('create_video this', this);
    p_livem = new p5LiveMedia(this, 'CAPTURE', stream, room_name);
    p_livem.on('stream', gotStream);
    p_livem.on('data', gotData);
    p_livem.on('disconnect', gotDisconnect);
  });
  console.log('create_video myVideo', myVideo);
  myVideo.muted = true;
  if (!default_vis) myVideo.hide();
  create_video_pane(myVideo, 'main');
}

// We got a new stream!
function gotStream(stream, id) {
  console.log('gotStream id', id);
  // This is just like a video/stream from createCapture(VIDEO)
  otherVideo = stream;
  //otherVideo.id and id are the same and unique identifiers
  if (!default_vis) otherVideo.hide();
  create_video_pane(otherVideo, id);
  create_device_selection();
  console.log(
    'otherVideo width',
    otherVideo.width,
    'height',
    otherVideo.height
  );
}

function gotData(theData, id) {
  console.log('gotData theData', theData, 'id', id);
}

function gotDisconnect(id) {
  console.log('gotDisconnect id', id);
  remove_video_pane(id);
}

function create_videos(devices) {
  for (let ent of devices) {
    let vcap = {
      video: {
        deviceId: { exact: ent.deviceId },
      },
    };
    let dim = v_dim[dim_index];
    if (dim) {
      vcap.video.width = { exact: dim.width };
      vcap.video.height = { exact: dim.height };
    }
    let vcapture = createCapture(vcap, function (stream) {
      console.log('create_videos stream', stream);
      ent.stream = stream;
    });
    console.log('create_videos vcapture', vcapture);
    if (dim) {
      vcapture.size(dim.width, dim.height);
    }
    if (!default_vis) vcapture.hide();
    ent.vcapture = vcapture;
    create_video_pane(vcapture, ent.deviceId, ent.label);
  }
  create_device_selection();
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
          console.log('device.deviceId', device.deviceId, device.label);
          let { label, deviceId } = device;
          a_devices.push({ label, deviceId });
        }
      });
      // console.log('a_devices', a_devices);
      create_videos(a_devices);
    })
    .catch(function (err) {
      console.log(err.name + ': ' + err.message);
    });
}
