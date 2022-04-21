const s = (p) => {
  let theShader;

  p.preload = function () {
    //font = p.loadFont("ArchivoBlack-Regular.ttf");
    // load the shader
    theShader = p.loadShader('assets/webcam.vert', 'assets/webcam.frag');
  };

  p.setup = function () {
    p.canv = p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
    p.canv.position(0, 0);
  };

  p.draw = function () {
    // shader() sets the active shader with our shader
    p.shader(theShader);

    theShader.setUniform('iResolution', [p.width, p.height]);
    theShader.setUniform('iFrame', p.frameCount);
    // theShader.setUniform("iMouse", [
    //   p.mouseX,
    //   p.map(p.mouseY, 0, p.height, p.height, 0),
    // ]);

    // rect gives us some geometry on the screen
    p.rect(0, 0, p.width, p.height);
  };
};

const s2 = (p) => {
  let x = 100;
  let y = 100;
  let a_erase = 0;
  p.setup = function () {
    p.canv = p.createCanvas(p.windowWidth, p.windowHeight);
    p.canv.position(0, 0);
    p.canv.style('z-index', '100');
    p.clear();
    // p.background(255);
    p.noStroke();
  };

  p.draw = function () {
    //p.background(0, 20);
    // p.fill(0)
    // p.rect(0,0,p.width, p.height)
    //erase();
    p.fill(255);
    p.rect(p.mouseX, p.mouseY, 50, 50);
    // if (p.mouseIsPressed) {
    //p.background(0, 0, 0, 0);
    // p.clear();
    //p.erase();
    // }
  };

  p.mousePressed = function () {
    a_erase = !a_erase;
    if (a_erase) p.erase();
    else p.noErase();
  };
};

let myp5_1 = new p5(s);
let myp5_2 = new p5(s2);

// https://editor.p5js.org/jht1493/sketches/JMzjqwJQb
// BLM shadertoy
