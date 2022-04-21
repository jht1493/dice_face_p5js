// a shader variable
let theShader;

function preload(){
  // load the shader
   theShader = loadShader('assets/webcam.vert', 'assets/webcam.frag');
}

function setup() {
  // shaders require WEBGL mode to work
  createCanvas(windowWidth, windowHeight, WEBGL);
  
  pixelDensity(1);
  noStroke();
}

function draw() {  
  // shader() sets the active shader with our shader
  shader(theShader);
  
  theShader.setUniform("iResolution", [width, height]);
  theShader.setUniform("iFrame", frameCount);
  theShader.setUniform("iMouse", [mouseX, map(mouseY, 0, height, height, 0)]);

  // rect gives us some geometry on the screen
  rect(0,0,width, height);
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}

// https://editor.p5js.org/jht1493/sketches/P_J51He7l
// shadertoy
// https://itp-xstory.github.io/p5js-shaders/#/./docs/examples/shadertoy

// https://editor.p5js.org/jht1493/sketches/xQ1qbzSxv
// 3d-shader-using-webcam

// https://p5js.org/examples/3d-shader-using-webcam.html

// https://github.com/processing/p5.js-website/tree/main/src/data/examples/assets
