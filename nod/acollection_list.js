const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');

require('dotenv').config();

const user_name = process.env.USER_NAME || 'jht1493';
console.log('user_name', user_name);

let my_root_path = path.join(__dirname, '..', 'mine');
let my_meta_path = path.join(my_root_path, 'meta');

fs.ensureDirSync(my_meta_path);

const json_path = path.join(my_meta_path, 'collections.json');
const list_path = path.join(my_meta_path, 'collections.md');

const collection_href = `https://editor.p5js.org/editor/${user_name}/collections`;

let href_read = 1;
let cols;

async function run() {
  if (!fs.pathExistsSync(json_path) || href_read) {
    await read_href(collection_href, json_path);
  }
  cols = fs.readJsonSync(json_path);

  let lines = [];
  lines.push('# Collections for ' + user_name);
  lines.push(cols.length + ' collections  ');

  cols_as_links(cols, lines);

  cols.forEach((col) => cols_item_as_links(col, lines));

  fs.writeFileSync(list_path, lines.join('\n'));
}

function cols_as_links(cols, lines) {
  cols.forEach((item) => {
    // console.log(index, 'project.name', item.project.name);
    // console.log(index, 'projectId', item.projectId);
    let name = item.name;
    let id = item.id;
    let updatedAt = item.updatedAt;
    updatedAt = `<!-- ${updatedAt} -->`;
    lines.push(
      `[${name}](https://editor.p5js.org/${user_name}/collections/${id})${updatedAt}  `
    );
  });
}

function cols_item_as_links(col, lines) {
  // console.log('col', col);
  lines.push('');
  lines.push('# ' + col.name);
  // console.log('# ' + col.name);
  let items = col.items;
  items = items.filter((item) => item.project && item.project.name);
  lines.push(items.length + ' sketches  ');
  // console.log(items.length + ' sketches  ');
  items.sort((item1, item2) =>
    item1.project.name.localeCompare(item2.project.name)
  );
  items.forEach((item) => {
    // console.log(index, 'project.name', item.project.name);
    // console.log(index, 'projectId', item.projectId);
    let name = item.project.name;
    let id = item.projectId;
    let updatedAt = item.updatedAt;
    updatedAt = `<!-- ${updatedAt} -->`;
    updatedAt = ''; // !!@ Disable
    lines.push(
      `[${name}](https://editor.p5js.org/${user_name}/sketches/${id})${updatedAt}  `
    );
  });
}

async function read_href(collection_href, json_path) {
  console.time('read_href');
  try {
    const response = await axios.get(collection_href);
    const cols = response.data;
    console.log('read_href cols.length', cols.length);
    cols.sort((item1, item2) => item1.name.localeCompare(item2.name));
    fs.writeJsonSync(json_path, cols, { spaces: 2 });
  } catch (err) {
    console.log('read_href err', err);
  }
  console.timeEnd('read_href');
}

run();

// [Ex_05_99 Robot03_Response](https://editor.p5js.org/jht1493/sketches/sWEVGT4bm)
