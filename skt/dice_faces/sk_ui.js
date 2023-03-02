let a_app_ver = 'Dice?v=371 ';
let a_store_ver = '192';
let a_store_name = 'Store-A';
let a_store_prefix = '';
let a_effects = [
  { label: 'show', eff: eff_show_pad },
  { label: 'none', eff: eff_show_none },
  { label: 'mov', eff: eff_mov_show },
  { label: 'loop', eff: eff_loop },
  { label: 'tile_clock', eff: eff_tile_clock },
  { label: 'tile', eff: eff_tile },
  { label: 'bestill', eff: eff_bestill },
  { label: 'bright', eff: eff_bright },
  { label: 'delaunay', eff: eff_delaunay },
  { label: 'diff', eff: eff_diff },
  { label: 'face_mesh', eff: eff_face_mesh },
  { label: 'grid', eff: eff_grid },
  { label: 'image', eff: eff_image_show },
  { label: 'image_mesh', eff: eff_image_mesh },
  { label: 'maze', eff: eff_maze },
  { label: 'pose_net', eff: eff_pose_net },
  { label: 'sketchy', eff: eff_sketchy },
  { label: 'slant_scan', eff: eff_slant_scan },
  { label: 'slit_scan', eff: eff_slit_scan },
  { label: 'text', eff: eff_text },
  { label: 'triangle', eff: eff_triangle },
  { label: 'bodypix', eff: eff_bodypix },
  { label: 'face_band', eff: eff_face_band },
  { label: 'fft_polar', eff: eff_fft_polar },
  { label: 'fft_graph', eff: eff_fft_graph },
  // { label: 'face_flat', eff: eff_face_flat },
  // { label: 'face_points', eff: eff_face_points },
  // { label: 'line', eff: eff_line },
  // { label: 'mask', eff: eff_mask },
  // { label: 'mirror_x', eff: eff_mirror_x },
  // { label: 'reflect_x', eff: eff_reflect_x },
  // { label: 'scan_co', eff: eff_scan_co },
  // { label: 'scan_polar', eff: eff_scan_polar },
  // { label: 'tunnel', eff: eff_tunnel },
];
let a_ui = {
  setting: '',
  back_color: 200,
  room_name: 'Dice-Play-1',
  patch_layout: 'Single',
  canvas_size: '640x480',
  capture_size: '320x240',
  chat_name: 'jht',
  chat_chk: 0,
  live_index: 0,
  live_chk: 0,
  patches: [{ isrc: { ipatch: 0, imedia: 1, effect: 'show' } }],
  medias: [],
  pads_lock: 0,
  pads_count: 0,
  canvas_resize_ref: '',
  // pads_scale
  canvas_data_chk: 0,
};
let a_patch_instances = [];
let a_canvas_size_lock = 0;

let a_settings_pending; // url params s= will set
let a_hideui = 0; // Default is to hide using with s= settings
let a_settings_async; // settings from ?al= json load
