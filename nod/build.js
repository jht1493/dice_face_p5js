const fs = require('fs-extra');
const path = require('path');
// const axios = require('axios');
const build_index = require('./build_index');

// require('dotenv').config();
// const user_name = process.env.USER_NAME || 'jht1493';
// console.log('user_name', user_name);

// skt/dice_faces
// skt/dice_faces/settings/2x2-20x15.json

// Directory of sketches
const skt_dir = '../skt';

// source files that will have ?v=<buildnumber> updated
const buildnum_files = [
  '../index.html',
  'index.html',
  'covid19_heal_ticker/index.html',
  'covid19_heal_ticker/sk_ui.js',
  'covid19_usa_recent/index.html',
  'covid19_usa_recent/sk_ui.js',
  'dice_faces/index.html',
  'dice_faces/src/let/a_ui.js',
  'posenet/index.html',
  // 'dice_faces/sketch_check.js',
];

const skt_path = path.join(__dirname, skt_dir);

const dicef_path = path.join(__dirname, skt_dir, 'dice_faces');

let build_num;
let nbuild_num;
let buildnum_path;

function get_build_nums() {
  buildnum_path = path.join(skt_path, '..', '_build_num.txt');
  const str = fs.readFileSync(buildnum_path, 'utf8');
  if (!str) {
    console.log('read failed buildnum_path', buildnum_path);
    return;
  }
  build_num = parseFloat(str);
  nbuild_num = build_num + 1;
}

function build_num_run() {
  const from_str = '\\?v=' + build_num;
  const to_str = '?v=' + nbuild_num;
  const re = new RegExp(from_str, 'g');
  for (let afile of buildnum_files) {
    const fpath = path.join(skt_path, afile);
    const str = fs.readFileSync(fpath, 'utf8');
    if (!str) {
      console.log('read failed fpath', fpath);
      continue;
    }
    const nstr = str.replace(re, to_str);
    fs.writeFileSync(fpath, nstr);
  }
  fs.writeFileSync(buildnum_path, nbuild_num + '');
  console.log('nbuild_num', nbuild_num);
}

function build_webdb() {
  // assets/webdb/a-fema/212.jpg
  const webdbPath = path.join(__dirname, skt_dir, 'assets/webdb');
  const outPath = path.join(dicef_path, 'sk_images.js');

  let dirs = fs.readdirSync(webdbPath);
  dirs = dirs.filter((item) => item.substr(0, 1) !== '.');
  dirs.sort();
  // console.log('build_webdb dirs', dirs);

  // let files = [];
  let files = {};
  for (let adir of dirs) {
    // if (adir.substr(0, 1) === '.') continue;
    // console.log('adir', adir);
    const dpath = path.join(webdbPath, adir);

    let dfiles = fs.readdirSync(dpath);
    dfiles = dfiles.filter(filter_out_json);
    // (item) => item.substr(0, 1) !== '.' && item.substr(3, 5) !== '.json'
    dfiles.sort();

    console.log('build_webdb adir', adir, 'n', dfiles.length);

    // console.log('build_webdb files', files);
    // files.push(dfiles.map((item) => path.join(adir, item)));
    files[adir] = dfiles;
  }
  // files = files.flat();

  files.fmfm = interleave(files, 'fema', 'male');

  let str = 'let a_images = ';
  str += JSON.stringify(files, null, 2);

  fs.writeFileSync(outPath, str);
}

function filter_out_json(item) {
  if (item.substr(0, 1) == '.') return false;
  let lindex = item.lastIndexOf('.');
  if (lindex < 0) return false;
  if (item.substr(lindex, 5) == '.json') return false;
  return true;
}

function interleave(files, aprop, bprop) {
  let aitems = files[aprop];
  let bitems = files[bprop];
  let arr = [];
  let n = Math.max(aitems.length, bitems.length);
  for (i = 0; i < n; i++) {
    let a = aitems[i % aitems.length];
    let b = bitems[i % bitems.length];
    arr.push('../' + aprop + '/' + a, '../' + bprop + '/' + b);
  }
  return arr;
}

function build_settings() {
  const outPath = path.join(dicef_path, 'sk_settings.js');
  const settingsPath = path.join(dicef_path, 'settings');
  const files = fs.readdirSync(settingsPath);
  files.sort();
  // console.log('files', files);
  let settings = [{ setting: '' }];
  for (let afile of files) {
    const fparts = path.parse(afile);
    // console.log('fparts', fparts);
    if (fparts.ext !== '.json') continue;
    const fpath = path.join(settingsPath, afile);
    // console.log('afile', afile);
    console.log(afile);
    const str = fs.readFileSync(fpath, 'utf8');
    if (!str) {
      console.log('read failed fpath', fpath);
      continue;
    }
    let ent = JSON.parse(str);
    if (!ent) {
      console.log('parse failed fpath', fpath, 'str', str);
      continue;
    }
    // console.log('ent', ent);
    delete ent.setting;
    ent = Object.assign({ setting: fparts.name }, ent);
    settings.push(ent);
  }
  let str = 'let a_settings = ';
  str += JSON.stringify(settings, null, 2);
  fs.writeFileSync(outPath, str);
  console.log('settings.length', settings.length);
}

get_build_nums();

// build_webdb();

// build_settings();

build_num_run();

build_index(dicef_path, nbuild_num);
