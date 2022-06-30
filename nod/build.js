const fs = require('fs-extra');
const path = require('path');

const { get_build_nums, build_num_run } = require('./build_num');
const build_index = require('./build_index');
const build_webdb = require('./build_webdb');
const build_settings = require('./build_settings');

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
const buildnum_path = path.join(skt_path, '..', '_build_num.txt');

let build_num = get_build_nums(buildnum_path);

const dice_faces_path = path.join(skt_path, 'dice_faces');

const webdbPath = path.join(skt_path, 'assets/webdb');
const imagesOutPath = path.join(dice_faces_path, 'src/let/a_images.js');

build_webdb(webdbPath, imagesOutPath);

const settingsPath = path.join(dice_faces_path, 'settings/_menu');
const settingsOutPath = path.join(dice_faces_path, 'src/let/a_settings.js');

build_settings(settingsPath, settingsOutPath);

build_num_run(buildnum_path, build_num, skt_path, buildnum_files);

build_index(dice_faces_path, build_num.next);
