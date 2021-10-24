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
    data_index_up = 0;
    data_index_mid = Math.floor(data_index_down / 2);
    select_entry();
  });
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
      panel_top = panel_top + dot_y + char_len + y_margin;
      y_top = char_len * 3;
    }
    day_next++;
    dot_y = 0;
    dot_x = 0;
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
