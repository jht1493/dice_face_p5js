let video_panes = [];
let a_effects = [
  { label: 'mirror-left', eff: eff_mirror_left },
  { label: 'mirror-right', eff: eff_mirror_right },
  { label: 'mask-ellipse', eff: eff_mask_ellipse },
  { label: 'show', eff: eff_show },
  { label: 'scan', eff: eff_scan },
  { label: 'line', eff: eff_line },
  { label: 'scan_bw', eff: eff_scan_bw },
  { label: 'triangle', eff: eff_triangle },
  { label: 'facemesh', eff: eff_facemesh },
];
let a_save_name = 'multi_mirror';
let a_tints = [
  { label: '0', value: 0 },
  { label: '10', value: 10 },
  { label: '100', value: 100 },
  { label: '255', value: 255 },
];
let a_tint = 255;
let uI = {
  eff_index_left: 0,
  eff_index_right: 1,
  video_index_left: 0,
  video_index_right: 1,
  tint_index: 3,
};

function create_ui() {
  uI_restore();
  createButton('Save').mousePressed(function () {
    let dt = new Date().toISOString().substring(0, 10);
    // "2021-04-25T14:44:31.227Z"
    saveCanvas(a_save_name + '_' + dt, 'png');
  });
  createButton('Fill').mousePressed(function () {
    resizeCanvas(windowWidth, windowHeight);
  });
  createButton('Inset').mousePressed(function () {
    resizeCanvas(v_width, v_height);
  });
  createSpan().id('ifps');
  createElement('br');
  create_device_selection();
  create_effects_selection();
}

function update_ui() {
  select('#ifps').html(' [fps=' + round(frameRate(), 2) + '] ');
}

function uI_(prop, value) {
  uI[prop] = value;
  localStorage.setItem('uI_' + prop, value);
}

function uI_restore() {
  for (prop in uI) {
    let valu = localStorage.getItem('uI_' + prop);
    if (valu !== null) {
      uI[prop] = parseFloat(valu);
      // console.log('uI_restore prop', prop, 'valu', valu);
    }
  }
}

function create_effects_selection() {
  let div = select('#effect_list');
  // console.log('create_device_selection div', div);
  if (!div) {
    div = createDiv().id('effect_list');
  } else {
    let children = div.child();
    // console.log('create_device_selection children', children);
    for (let ii = children.length - 1; ii >= 0; ii--) {
      let elm = children[ii];
      elm.remove();
    }
  }
  {
    let span = createSpan('Effect0:');
    // span.style('font-size', '16pt');
    let aselect = createSelect();
    for (let index = 0; index < a_effects.length; index++) {
      aselect.option(a_effects[index].label, index);
    }
    aselect.changed(function () {
      let index = this.value();
      // uI.eff_index_left = index;
      uI_('eff_index_left', index);
      console.log('eff_index_left', uI.eff_index_left);
    });
    aselect.selected(uI.eff_index_left);
    span.parent(div);
    aselect.parent(div);
  }
  {
    let span = createSpan('Effect1:');
    // span.style('font-size', '16pt');
    let aselect = createSelect();
    for (let index = 0; index < a_effects.length; index++) {
      aselect.option(a_effects[index].label, index);
    }
    aselect.changed(function () {
      let index = this.value();
      // uI.eff_index_right = index;
      uI_('eff_index_right', index);
      console.log('eff_index_right', uI.eff_index_right);
    });
    aselect.selected(uI.eff_index_right);
    span.parent(div);
    aselect.parent(div);
  }
  {
    let span = createSpan('Tint:');
    // span.style('font-size', '16pt');
    let aselect = createSelect();
    for (let index = 0; index < a_tints.length; index++) {
      aselect.option(a_tints[index].label, index);
    }
    aselect.changed(function () {
      let index = this.value();
      a_tint = a_tints[index].value;
      uI_('tint_index', index);
      console.log('a_tint', a_tint);
    });
    aselect.selected(a_tints.length - 1);
    span.parent(div);
    aselect.parent(div);
  }
}

function create_device_selection() {
  let div = select('#device_list');
  // console.log('create_device_selection div', div);
  if (!div) {
    div = createDiv().id('device_list');
  } else {
    let children = div.child();
    for (let ii = children.length - 1; ii >= 0; ii--) {
      let elm = children[ii];
      elm.remove();
    }
  }
  {
    let span = createSpan('Device0:');
    let aselect = createSelect();
    for (let index = 0; index < video_panes.length; index++) {
      aselect.option(video_panes[index].label, index);
    }
    aselect.changed(function () {
      let index = this.value();
      console.log('create_device_selection index', index);
      myVideo = video_panes[index].vcapture;
      // uI.video_index_left = index;
      uI_('video_index_left', index);
    });
    aselect.selected(uI.video_index_left);
    span.parent(div);
    aselect.parent(div);
  }
  {
    let span = createSpan('Device1:');
    let aselect = createSelect();
    for (let index = 0; index < video_panes.length; index++) {
      aselect.option(video_panes[index].label, index);
    }
    aselect.changed(function () {
      let index = this.value();
      console.log('create_device_selection index', index);
      otherVideo = video_panes[index].vcapture;
      uI.video_index_right = index;
      uI_('video_index_right', index);
    });
    aselect.selected(uI.video_index_right);
    span.parent(div);
    aselect.parent(div);
  }
}

function display_vis(elm, vis) {
  console.log('display_vis elm ', elm.width, 'height', elm.height);
  elm.style(vis ? 'display:inline' : 'display:none');
}

// !!@ Consider splitting up so info appears above video div
// !!@ find video event change to update width and height
function create_video_pane(vcapture, id, label) {
  if (!label) label = id;
  let div = createDiv();
  let info = createSpan();
  let vis = default_vis;
  let chk = createCheckbox('Show', vis);
  chk.style('display:inline');
  let ent = { id, label, div, chk, vis, vcapture, info };
  video_panes.push(ent);
  chk.parent(div);
  info.parent(div);
  info.html(
    ' ' + label + ' width=' + vcapture.width + ' height=' + vcapture.height
  );
  chk.changed(function () {
    ent.vis = this.checked();
    vcapture.style(ent.vis ? 'display:inline' : 'display:none');
    info.html(
      ' ' + label + ' width=' + vcapture.width + ' height=' + vcapture.height
    );
    console.log('vcapture width', vcapture.width, 'height', vcapture.height);
  });
  // !!@ causes removeDomElement failure
  // vcapture.parent(div);
}

function remove_video_pane(id) {
  console.log('remove_video_pane', id);
  let ent = video_panes.find((item) => item.id === id);
  if (ent) {
    ent.div.remove();
  }
  video_panes = video_panes.filter((item) => item.id !== id);
}
