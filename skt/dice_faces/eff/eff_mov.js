class eff_mov_show {
  static meta_props = {
    group: ['covid19mov'],
    ifile: [0, 1],
    ispeed: [1],
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
    reset: {
      button: (ent, aPatch) => {
        ent.reset_action(aPatch);
      },
    },
    _loop: [0, 1],
    period: [5, 10, 20, 30, 60],
  };
  constructor(props) {
    Object.assign(this, props);
    this.init();
  }
  render() {
    if (this.loop) {
      this.period_timer.check(() => {
        this.period_next();
      });
    }
    // console.log('eff_mov_show', this.vid.duration(), this.vid.time());
  }
  init() {
    this.predictions = [];
    this.period_timer = new period_timer(this.period);
    this.load_from_group();
  }
  load_from_group() {
    this.files = a_images[this.group];
    if (this.shuffle) {
      this.files = shuffle(this.files);
    }
    let file_name = this.file_name;
    if (this.ifile !== undefined) {
      console.log('eff_mov_show this.ifile=' + this.ifile);
      if (this.ifile >= this.files.length) {
        this.ifile = this.files.length - 1;
      }
      file_name = this.group + '/' + this.files[this.ifile];
    }
    let ipath = '../assets/webdb/' + file_name;
    console.log('eff_mov_show ipath=' + ipath);
    console.log('eff_mov_show vid', this.vid);
    this.vid = createVideo(ipath, () => {
      console.log('eff_mov_show loaded');
      this.vid.play();
      // this.vid.loop();
    });
    this.vid.onended(() => {
      // this.ispeed = this.ispeed == 1 ? -1 : 1;
      console.log('eff_mov_show onended', this.ispeed);
      this.vid.play();
      // this.vid.speed(this.ispeed);
    });
    this.vid.size(width, height);
    this.vid.position(0, 0);
  }
  remove_eff() {
    console.log('eff_mov_show remove_eff vid', this.vid);
    if (this.vid) {
      this.vid.remove();
    }
  }
}
