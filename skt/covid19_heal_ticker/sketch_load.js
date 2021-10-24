function load_json() {
  json_loaded = 0;
  let url =
    'https://epvisual.com/COVID-19-Impact/Dashboard/a0/c_data/world/c_series/United_States.json';
  loadJSON(url, (data) => {
    console.log('load_json data last', JSON.stringify(data[data.length - 1]));
    console.log('data.length', data.length);
    console.log('load_count', load_count);
    json_loaded = 1;
    load_count++;
    data_index_start = 0;
    cycle_done = 0;
    a_data = data;
    data_index_down = data.length;
    data_index_down -= data_index_offset;
    data_index_up = 0;
    data_index_mid = Math.floor(data_index_down / 2);
    select_entry();
    // show_max_deaths();
    sort_max_deaths();
  });
}

// mindex 85 mdate 2020-04-16 mcount 4607
function show_max_deaths() {
  let mindex = -1;
  let mcount = -1;
  let mdate;
  for (let index = 1; index < a_data.length - 1; index++) {
    let ent1 = a_data[index];
    let ent0 = a_data[index - 1];
    let count = ent1.Deaths - ent0.Deaths;
    if (count > mcount) {
      mindex = index;
      mcount = count;
      mdate = ent1.on;
    }
  }
  console.log('mindex', mindex, 'mdate', mdate, 'mcount', mcount);
}

// 2020-04-16 4607
// 2021-01-20 4441
// 2021-01-12 4389
// 2021-01-08 4189
// 2021-01-21 4137
// 2021-01-27 4128
// 2021-01-07 4028
// 2021-01-13 4018
// 2021-01-26 3982
// 2020-12-30 3933
let a_max_deaths;
function sort_max_deaths() {
  let dates = [];
  let ent = a_data[0];
  dates.push({ count: ent.Deaths, on: ent.on });
  for (let index = 1; index < a_data.length - 1; index++) {
    let ent1 = a_data[index];
    let ent0 = a_data[index - 1];
    let count = ent1.Deaths - ent0.Deaths;
    dates.push({ count: count, on: ent1.on });
  }
  dates.sort((ent0, ent1) => ent1.count - ent0.count);
  a_max_deaths = dates;
  let n = 10;
  for (let index = 0; index < n; index++) {
    let ent = dates[index];
    console.log(ent.on, ent.count);
  }
}

function select_entry() {
  let ent1, ent0;
  if (a_dir === 'down') {
    select_down();
  } else if (a_dir === 'up') {
    select_up();
  } else {
    select_up_down();
  }
  a_date = ent1.on;
  let s = a_count > 1 ? 's' : '';
  if (day_next == 0) {
    a_string = a_date + '\n' + a_count + '\n';
    day_next++;
  } else {
    if (day_next == 1) {
      panel_top = panel_top + dot_y + char_len + y_margin * 2;
      y_top = char_len * 3;
    }
    day_next++;
    a_string = a_date + '\n' + a_count + '\nUSA Death' + s + '\n' + a_postfix;
  }
  end_index = a_string.length - 1;
  begin_day();

  function select_down() {
    do {
      data_index_down--;
      if (data_index_down < 1) {
        data_index_down = a_data.length - 1;
        cycle_done = 1;
      }
      data_index = data_index_down;
      ent1 = a_data[data_index];
      ent0 = a_data[data_index - 1];
      a_count = ent1.Deaths - ent0.Deaths;
    } while (a_count < 1);
  }
  function select_up() {
    do {
      data_index_up++;
      if (data_index_up >= a_data.length) {
        data_index_up = 1;
        cycle_done = 1;
      }
      data_index = data_index_up;
      ent1 = a_data[data_index];
      ent0 = a_data[data_index - 1];
      a_count = ent1.Deaths - ent0.Deaths;
    } while (a_count < 1);
    if (!data_index_start) {
      data_index_start = data_index_up;
    }
  }
  function select_up_down() {
    do {
      if (a_down) {
        data_index_down--;
        if (data_index_down < data_index_mid) {
          data_index_down = a_data.length - 1;
          cycle_done = 1;
        }
        data_index = data_index_down;
      } else {
        data_index_up++;
        if (data_index_up > data_index_mid) {
          data_index_up = 0;
          cycle_done = 1;
        }
        data_index = data_index_up;
      }
      ent1 = a_data[data_index];
      ent0 = a_data[data_index - 1];
      a_count = ent1.Deaths - ent0.Deaths;
    } while (a_count < 1);
    a_down ^= 1;
  }
}
