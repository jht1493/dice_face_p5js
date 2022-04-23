class eff_tile {
  static meta_props = {
    ncell: [1, 2, 3, 4, 5, 6, 7, 8],
    period: [1, -1, 0, 0.5, 1, 2, 3, 4, 5, 6, 10, 20, 30, 60],
    next: {
      button: (ent, aPatch) => {
        ent.next_action(aPatch);
      },
    },
    prev: {
      button: (ent, aPatch) => {
        ent.previous_action(aPatch);
      },
    },
    _freeze_patch: [0, 1],
    livem_cycle: [0, 1],
  };
  constructor(props) {
    Object.assign(this, props);
    this.init();
    // stash instance for debugging
    tile_inst = this;
  }
  render() {
    this.check_patches();
    if (this.advancePending) {
      if (this.livem_cycle) {
        this.livem_step();
      } else {
        this.draw_step();
      }
      // this.draw_step();
      // this.trigger_index = (this.trigger_index + 1) % this.trigger_count;
      this.advancePending = 0;
    }
    // console.log( 'this.wasFrozen', this.wasFrozen, 'advancePending', this.advancePending, 'got_freeze', this.got_freeze );
    if (this.freeze_patch && this.wasFrozen) {
      this.draw_freeze();
    } else {
      this.draw_stamp();
    }
    this.period_timer.check(() => {
      this.iperiod++;
      if (this.freeze_patch) {
        if (!this.wasFrozen) {
          this.capture_freeze();
        }
      } else {
        this.advancePending = 1;
      }
    });
    // this.check_tile_op_que();
  }
  livem_step() {
    if (!this.livem_cycle) return;
    let ipatch = this.isrc.ipatch;
    console.log('livem_step ipatch', ipatch);
    let uiPatch = a_ui.patches[ipatch];
    let imedia = uiPatch.isrc.imedia;
    if (imedia >= a_media_panes.length) {
      imedia = 2;
    }
    imedia = (imedia + 1) % a_media_panes.length;
    if (imedia < 2) imedia = 2;
    if (imedia >= a_media_panes.length) imedia = uiPatch.isrc.imedia;
    console.log('livem_step old imedia', uiPatch.isrc.imedia, 'new', imedia);
    let change = uiPatch.isrc.imedia !== imedia;
    uiPatch.isrc.imedia = imedia;
    if (change) {
      this.draw_step();
    }
  }
  init() {
    this.wasFrozen = 0;
    this.iperiod = 0;
    this.period_timer = new period_timer(this.period);
    this.twidth = width;
    this.theight = height;
    this.output = createGraphics(this.twidth, this.theight);
    this.x = 0;
    this.y = 0;
    this.xstep = Math.floor(this.twidth / this.ncell);
    this.ystep = Math.floor(this.theight / this.ncell);
    this.img_freeze = createImage(this.xstep, this.ystep);
    // this.trigger_index = 0;
    // this.trigger_count = this.ncell * this.ncell;
  }
  patch_stepper() {
    this.advancePending = 1;
  }
  draw_stamp() {
    let simg = this.src_image();
    if (this.advancePending) return;
    let sx = 0;
    let sy = 0;
    let sw = simg.width;
    let sh = simg.height;
    let { x, y, xstep, ystep } = this;
    this.output.copy(simg, sx, sy, sw, sh, x, y, xstep, ystep);
    // copy(srcImage, sx, sy, sw, sh, dx, dy, dw, dh)
    this.last_x = x;
    this.last_y = y;
  }
  draw_step(dir) {
    if (!dir) dir = 1;
    this.x += this.xstep * dir;
    if (this.x + this.xstep / 2 >= this.output.width || this.x < 0) {
      if (this.x < 0) {
        this.x = this.xstep * (this.ncell - 1);
      } else {
        this.x = 0;
      }
      this.y += this.ystep * dir;
      if (this.y < 0) {
        this.y = this.ystep * (this.ncell - 1);
      }
      if (this.y >= this.output.height) {
        this.y = 0;
      }
    }
  }
  src_image() {
    return this.input;
  }
  next_action(aPatch) {
    this.draw_step();
  }
  previous_action(aPatch) {
    this.draw_step(-1);
  }
  check_patches() {
    if (this.freeze_patch) {
      let src = patch_index1(this.freeze_patch);
      if (src) {
        // console.log('src.frozen', src.frozen);
        if (!this.wasFrozen && src.frozen) {
          this.advancePending = 1;
        }
        this.wasFrozen = src.frozen;
      }
    }
  }
  draw_freeze() {
    let simg = this.img_freeze;
    let sx = 0;
    let sy = 0;
    let sw = simg.width;
    let sh = simg.height;
    let { xstep, ystep } = this;
    let x = this.last_x;
    let y = this.last_y;
    this.output.copy(simg, sx, sy, sw, sh, x, y, xstep, ystep);
  }
  capture_freeze() {
    let dimg = this.img_freeze;
    let { xstep, ystep } = this;
    let sx = this.last_x;
    let sy = this.last_y;
    dimg.copy(this.output, sx, sy, xstep, ystep, 0, 0, dimg.width, dimg.height);
    // this.got_freeze = this.iperiod;
  }
  // check_tile_op_que() {
  //   // tile_op_que
  //   let opt = tile_op_que.splice(0, 1);
  //   if (opt.length < 1) return;
  //   let op = opt[0];
  //   console.log('check_tile_op_que op', op);
  // }
}

let tile_op_que = [];
let tile_inst;

// opt={add:id}
// opt={remove:id}
//
// function tile_notify_media_update(opt) {
//   console.log('tile_inst opt', opt);
//   console.log('tile_inst tile_inst', tile_inst);
//   console.log('tile_notify_media_update a_media_panes', a_media_panes);
//   console.log('tile_notify_media_update a_media_devices', a_media_devices);
//   tile_op_que.push(opt);
// }
