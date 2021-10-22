// Are we setting up store from our url query?
function store_url_check() {
  let afound = 0;
  let loc = window.location.href;
  let ind = loc.indexOf('?');
  if (ind >= 0) {
    let query = loc.substring(ind + 1);
    // console.log('store_url_check query', query);
    let params = params_query(query);
    // console.log('store_url_check params', params);
    let a_str = params['a'];
    if (a_str) {
      afound = url_a_restore(a_str);
    }
    let u_str = params['u'];
    if (u_str) {
      a_store_prefix = u_str;
      // console.log('a_store_prefix', a_store_prefix);
    }
    let s_str = params['s'];
    if (s_str) {
      console.log('store_url_check s_str', s_str);
      let ent = a_settings.find((ent) => ent.setting === s_str);
      a_settings_pending = ent;
      console.log('store_url_check a_settings_pending', a_settings_pending);
    }
  }
  return afound;
}

function url_a_restore(str) {
  // decode not Needed
  // str = decodeURIComponent(str);
  if (str) {
    // console.log('store_url_check str');
    // console.log(str);
    let ui = JSON.parse(str);
    if (!ui) {
      // console.log('store_url_check parse failed');
    } else {
      // console.log('store_url_check ui', ui);
      a_ui = ui;
      // Reflect url parameters in local storage
      for (prop in a_ui) {
        a_ui_set(prop, a_ui[prop]);
      }
      return 1;
    }
  }
  return 0;
}

// Return current location a_store_prefix
function location_url() {
  let loc = window.location.href;
  let ii = loc.indexOf('?');
  if (ii >= 0) {
    loc = loc.substring(0, ii);
  }
  loc += '?';
  if (a_store_prefix) {
    let ustr = encodeURIComponent(a_store_prefix);
    loc += 'u=' + ustr + '&';
  }
  return loc;
}

function store_export_json() {
  store_export(0);
}
function store_export_url() {
  store_export(1);
}

function store_export(updateUrl) {
  pad_layout_update();
  let fn = a_ui.setting || 'setting';
  saveJSON(a_ui, fn);
  let str = JSON.stringify(a_ui);
  // console.log('store_export str');
  // console.log(str);
  str = encodeURIComponent(str);
  let loc = location_url();
  loc += 'a=' + str;
  // console.log('loc', loc);
  if (updateUrl) {
    window.location = loc;
  }
}

function store_name_restore() {
  let nstore = localStorage.getItem('a_store_name');
  if (nstore) a_store_name = nstore;
}

function store_name_update(name) {
  console.log('store_name_update', name);
  localStorage.setItem('a_store_name', name);
  let loc = location_url();
  window.location = loc;
}

let isrc_props = {
  ipatch: 1,
  imedia: 1,
  effect: 1,
  pad: 1,
  pad_ref: 1,
  ihide: 1,
  ipipe: 1,
};

function store_restore_from(ent) {
  console.log('store_restore_from', ent);
  store_restore_ent(ent);
  let loc = location_url();
  window.location = loc;
}

function store_restore_ent(ent) {
  store_restore_create_isrc(ent);
  if (a_canvas_size_lock) {
    // Canvas size is locked
    // Save reference pad per patch before we save in local storage
    for (let patch of ent.patches) {
      patch.isrc.pad_ref = Object.assign({}, patch.isrc.pad);
    }
  }
  // Save settings to local storage
  for (let prop in ent) {
    let nprop = prop;
    if (a_canvas_size_lock) {
      if (prop === 'canvas_size') {
        // ui.canvas_size is replaced by a_ui.canvas_resize_ref
        // to enable scaling relative to original canvas size
        nprop = 'canvas_resize_ref';
      } else if (prop === 'canvas_resize_ref') {
        continue;
      }
    }
    a_ui_set(nprop, ent[prop]);
  }
  if (a_canvas_size_lock) {
    // Force pad_layout_update
    a_ui_set('pads_count', 0);
  } else {
    // Canvas is not locked
    // clear a_ui.canvas_resize_ref to prevent scaling
    a_ui_set('canvas_resize_ref', '');
  }
}

// "patches": [
//   {
//     "isrc": {
//       "ipatch": 0,
//       "imedia": 1,
//       "effect": "bestill",
//       "pad": {
//         "width": 1920,
//         "height": 1080,
//         "x0": 0,
//         "y0": 0
//       }
//     },
//     "eff": {
//       "factor": 200,
//       "mirror": 0
//     }
//   }
// ],

function store_restore_create_isrc(ent) {
  // For prior version of patches recode to { src, eff }
  let npatches = [];
  for (let patch of ent.patches) {
    if (patch.isrc) continue;
    let isrc = {};
    let eff = {};
    for (let prop in patch) {
      if (prop === 'ieff') continue;
      if (isrc_props[prop]) {
        isrc[prop] = patch[prop];
      } else {
        eff[prop] = patch[prop];
      }
    }
    npatches.push({ isrc, eff });
  }
  if (npatches.length > 0) {
    ent.patches = npatches;
  }
}

// https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams

function params_query(query) {
  // eg. query='abc=foo&def=%5Basf%5D&xyz=5'
  // params={abc: "foo", def: "[asf]", xyz: "5"}
  const urlParams = new URLSearchParams(query);
  const params = Object.fromEntries(urlParams);
  return params;
}
