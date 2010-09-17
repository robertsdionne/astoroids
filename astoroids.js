// Copyright 2010 Robert Scott Dionne. All Rights Reserved.

var keys = {
  up: false,
  down: false,
  left: false,
  right: false,
  fire: false
};

var keydown = function(e) {
  switch(e.which) {
    case 32:
      keys.fire = true;
      break;
    case 37:
      keys.left = true;
      break;
    case 38:
      keys.up = true;
      break;
    case 39:
      keys.right = true;
      break;
    case 40:
      keys.down = true;
      break;
    default:
      return true;
  }
  return false;
};

var keyup = function(e) {
  switch(e.which) {
    case 32:
      keys.fire = false;
      break;
    case 37:
      keys.left = false;
      break;
    case 38:
      keys.up = false;
      break;
    case 39:
      keys.right = false;
      break;
    case 40:
      keys.down = false;
      break;
    default:
      return true;
  }
  return false;
};

var load = function() {
  var canvas = document.getElementById('c');
  document.body.onkeydown = keydown;
  document.body.onkeyup = keyup;
  canvas.width = 640;
  canvas.height = 640;
  var gl = canvas.getContext('experimental-webgl');
  var p = gl.createProgram();
  var b = gl.createBuffer();
  var g = gl.createBuffer();
  onCreate(gl, p, b, g);
  var width, height;
  window.setInterval(function() {
    if (width !== canvas.width || height !== canvas.height) {
      width = canvas.width;
      height = canvas.height;
      onChange(gl, width, height);
    }
    update();
    onDraw(gl, p, b, g);
  }, 10);
};

var X = 0.0;
var Y = 0.0;
var CHI = 0.00;

var XV = 0.0;
var YV = 0.0;

var BX = 0.0;
var BY = 0.0;

var BXV = 0.0;
var BYV = 0.0;

var pi = 3.141592653589793;

var update = function() {
  X += XV;
  Y += YV;
  BX += BXV;
  BY += BYV;
  if (keys.fire) {
    BX = X;
    BY = Y;
    BXV = XV + 0.005 * Math.cos(2.0 * pi * CHI);
    BYV = YV + 0.005 * Math.sin(2.0 * pi * CHI);
  }
  if (keys.up) {
    XV += 0.0001 * Math.cos(2.0 * pi * CHI);
    YV += 0.0001 * Math.sin(2.0 * pi * CHI);
  }
  if (keys.left) {
    CHI -= 0.01;
  }
  if (keys.right) {
    CHI += 0.01;
  }
  XV *= 0.995;
  YV *= 0.995;
};

var N = 3;
var M = 40;

var onCreate = function(gl, p, b, g) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  var v = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(v, document.getElementById('v').text);
  var result = gl.compileShader(v);
  gl.compileShader(v);
  if (!gl.getShaderParameter(v, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(v));
  }
  gl.attachShader(p, v);
  gl.deleteShader(v); v = null;
  var f = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(f, document.getElementById('f').text);
  gl.compileShader(f);
  if (!gl.getShaderParameter(f, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(f));
  }
  gl.attachShader(p, f);
  gl.deleteShader(f); f = null;
  gl.linkProgram(p);
  gl.useProgram(p);

  p.size = gl.getUniformLocation(p, 'size');
  p.xyChi = gl.getUniformLocation(p, 'xyChi');
  p.abRho = gl.getUniformLocation(p, 'abRho');
  p.position = gl.getAttribLocation(p, 'position');

  var data = [
    -0.01, -0.01,
     0.01,  0.00,
    -0.01,  0.01
  ];

  var a = new Float32Array(data);
  gl.bindBuffer(gl.ARRAY_BUFFER, b);
  gl.bufferData(gl.ARRAY_BUFFER, a.byteLength, gl.STATIC_DRAW);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, a);

  var data2 = [];
  for (var i = 0; i < M; ++i) {
    for (var j = 0; j < M; ++j) {
      data2.push(i * 1.0 / M, j * 1.0 / M);
    }
  }

  var d = new Float32Array(data2);
  gl.bindBuffer(gl.ARRAY_BUFFER, g);
  gl.bufferData(gl.ARRAY_BUFFER, d.byteLength, gl.STATIC_DRAW);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, d);
};


var onChange = function(gl, width, height) {
  gl.viewport(0, 0, width, height);
};

var abRho = new Float32Array([0.50, 0.2, 0.125]);

var onDraw = function(gl, p, b, g) {
  gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
  gl.bindBuffer(gl.ARRAY_BUFFER, b);
  var xyChi = new Float32Array([X, Y, CHI]);
  gl.uniform3fv(p.xyChi, xyChi);
  gl.uniform3fv(p.abRho, abRho);
  gl.vertexAttribPointer(p.position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(p.position);
  gl.drawArrays(gl.LINE_STRIP, 0, N);
  gl.disableVertexAttribArray(p.position);

  gl.bindBuffer(gl.ARRAY_BUFFER, g);
  var xyChi = new Float32Array([-0.02 * X, -0.02 * Y, 0.0]);
  gl.uniform1f(p.size, 0.7);
  gl.uniform3fv(p.xyChi, xyChi);
  gl.uniform3fv(p.abRho, abRho);
  gl.vertexAttribPointer(p.position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(p.position);
  gl.drawArrays(gl.POINTS, 0, M * M);
  gl.disableVertexAttribArray(p.position);
  gl.flush();

  gl.bindBuffer(gl.ARRAY_BUFFER, g);
  var xyChi = new Float32Array([BX, BY, 0.0]);
  gl.uniform1f(p.size, 2.0);
  gl.uniform3fv(p.xyChi, xyChi);
  gl.uniform3fv(p.abRho, abRho);
  gl.vertexAttribPointer(p.position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(p.position);
  gl.drawArrays(gl.POINTS, 0, 1);
  gl.disableVertexAttribArray(p.position);
  gl.flush();
};
