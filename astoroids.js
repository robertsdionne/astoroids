// Copyright 2010 Robert Scott Dionne. All Rights Reserved.

var big = [
  [ 0.00000, 0.03753,
    0.00000, 0.09383,
    0.02410, 0.15013,
    0.06225, 0.13137,
    0.08635, 0.15282,
    0.11044, 0.11260,
    0.06225, 0.07775,
    0.11245, 0.05362,
    0.11245, 0.03753,
    0.07028, 0.00000,
    0.02811, 0.00000,
    0.04217, 0.03753 ],

  [ 0.00000, 0.03485,
    0.00000, 0.11796,
    0.02209, 0.15013,
    0.07028, 0.15013,
    0.11044, 0.10992,
    0.09438, 0.06702,
    0.11044, 0.02681,
    0.08434, 0.00000,
    0.05422, 0.02949,
    0.02610, 0.00000 ],

  [ 0.00000, 0.05898,
    0.02811, 0.07239,
    0.00000, 0.09383,
    0.02209, 0.15013,
    0.05020, 0.08311,
    0.04217, 0.15013,
    0.07028, 0.15013,
    0.11245, 0.08311,
    0.11245, 0.05362,
    0.08434, 0.00000,
    0.04016, 0.00000 ],

  [ 0.00000, 0.04021,
    0.01406, 0.07507,
    0.00000, 0.11528,
    0.02811, 0.15013,
    0.04016, 0.13137,
    0.07631, 0.15013,
    0.11044, 0.09383,
    0.07831, 0.05630,
    0.11044, 0.04021,
    0.08233, 0.00000,
    0.05422, 0.02145,
    0.03414, 0.00000 ]
];

var subdivideLoop = function(k, points) {
  var out = [];
  var m = points.length;
  for (var i = 0; i < m; i += 2) {
    var x0 = points[i % m];
    var y0 = points[(i+1) % m];
    var x1 = points[(i+2) % m];
    var y1 = points[(i+3) % m];
    for (var j = 0; j < k; ++j) {
      out.push(x0 + j * (x1 - x0) / k);
      out.push(y0 + j * (y1 - y0) / k);
    }
  }
  return out;
};


var keys = new Keys();


var load = function() {
  var canvas = document.getElementById('c');
  keys.install(document.body);
  canvas.width = 640;
  canvas.height = 640;
  var gl = canvas.getContext('experimental-webgl');
  var p = gl.createProgram();
  var b = gl.createBuffer();
  var g = gl.createBuffer();
  var asteroid = gl.createBuffer();
  onCreate(gl, p, b, g, asteroid);
  var width, height;
  window.setInterval(function() {
    if (width !== canvas.width || height !== canvas.height) {
      width = canvas.width;
      height = canvas.height;
      onChange(gl, width, height);
    }
    update();
    onDraw(gl, p, b, g, asteroid);
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

var asteroidX = Math.random();
var asteroidY = Math.random();

var asteroidXV = (Math.random() - 0.5) / 250.0;
var asteroidYV = (Math.random() - 0.5) / 250.0;

var pi = 3.141592653589793;

var shoot = new Sound('sound/wav/shoot.wav');
var thrust = new Sound('sound/wav/thrust.wav');

var update = function() {
  X += XV;
  Y += YV;
  BX += BXV;
  BY += BYV;
  asteroidX += asteroidXV;
  asteroidY += asteroidYV;
  if (keys.justDown(Key.FIRE)) {
    shoot.play();
    BX = X;
    BY = Y;
    BXV = XV + 0.005 * Math.cos(2.0 * pi * CHI);
    BYV = YV + 0.005 * Math.sin(2.0 * pi * CHI);
  }
  if (keys.isDown(Key.UP)) {
    if (keys.justDown(Key.UP)) {
      thrust.play();
    }
    XV += 0.00005 * Math.cos(2.0 * pi * CHI);
    YV += 0.00005 * Math.sin(2.0 * pi * CHI);
  }
  if (keys.isDown(Key.LEFT)) {
    CHI -= 0.01;
  }
  if (keys.isDown(Key.RIGHT)) {
    CHI += 0.01;
  }
  XV *= 0.995;
  YV *= 0.995;
  keys.update();
};

var N = 23;
var M = 8000;

var onCreate = function(gl, p, b, g, asteroid) {
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

  var data = [];
  for (var i = 0; i < 10; ++i) {
    data.push(-0.03217 + i * 2.0 * 0.03217 / 10.0);
    data.push(-0.01406 + i * 0.01406 / 10.0);
  }
  for (var i = 0; i < 11; ++i) {
    data.push(0.03217 + i * -2.0 * 0.03217 / 10.0);
    data.push(i * 0.01406 / 10.0);
  }
  data.push(data[36], data[37]);
  data.push(data[4], data[5]);

  var a = new Float32Array(data);
  gl.bindBuffer(gl.ARRAY_BUFFER, b);
  gl.bufferData(gl.ARRAY_BUFFER, a.byteLength, gl.STATIC_DRAW);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, a);

  var data2 = [0.0, 0.0];
  for (var i = 0; i < M; ++i) {
    data2.push(Math.random(), Math.random());
  }

  var d = new Float32Array(data2);
  gl.bindBuffer(gl.ARRAY_BUFFER, g);
  gl.bufferData(gl.ARRAY_BUFFER, d.byteLength, gl.STATIC_DRAW);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, d);

  var asteroidBuffer = new Float32Array(subdivideLoop(10, big[3]));
  gl.bindBuffer(gl.ARRAY_BUFFER, asteroid);
  gl.bufferData(gl.ARRAY_BUFFER, asteroidBuffer.byteLength, gl.STATIC_DRAW);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, asteroidBuffer);
};


var onChange = function(gl, width, height) {
  gl.viewport(0, 0, width, height);
};

var abRho = new Float32Array([0.32, 0.44, 0.125]);

var wrap = function(coord) {
  return coord - Math.floor(coord);
};

var onDraw = function(gl, p, b, g, asteroid) {
  gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
  gl.bindBuffer(gl.ARRAY_BUFFER, b);
  var xyChi = new Float32Array([wrap(X), wrap(Y), CHI]);
  gl.uniform3fv(p.xyChi, xyChi);
  gl.uniform3fv(p.abRho, abRho);
  gl.vertexAttribPointer(p.position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(p.position);
  gl.drawArrays(gl.LINE_STRIP, 0, N);
  gl.disableVertexAttribArray(p.position);

//gl.bindBuffer(gl.ARRAY_BUFFER, g);
//var xyChi = new Float32Array([wrap(-0.02 * X), wrap(-0.02 * Y), 0.0]);
//gl.uniform1f(p.size, 0.7);
//gl.uniform3fv(p.xyChi, xyChi);
//gl.uniform3fv(p.abRho, abRho);
//gl.vertexAttribPointer(p.position, 2, gl.FLOAT, false, 0, 0);
//gl.enableVertexAttribArray(p.position);
//gl.drawArrays(gl.POINTS, 0, M);
//gl.disableVertexAttribArray(p.position);
//gl.flush();

  gl.bindBuffer(gl.ARRAY_BUFFER, g);
  var xyChi = new Float32Array([wrap(BX), wrap(BY), 0.0]);
  gl.uniform1f(p.size, 2.5);
  gl.uniform3fv(p.xyChi, xyChi);
  gl.uniform3fv(p.abRho, abRho);
  gl.vertexAttribPointer(p.position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(p.position);
  gl.drawArrays(gl.POINTS, 0, 1);
  gl.disableVertexAttribArray(p.position);

  gl.bindBuffer(gl.ARRAY_BUFFER, asteroid);
  var xyChi = new Float32Array([wrap(asteroidX), wrap(asteroidY), 0.0]);
  gl.uniform1f(p.size, 1.0);
  gl.uniform3fv(p.xyChi, xyChi);
  gl.uniform3fv(p.abRho, abRho);
  gl.vertexAttribPointer(p.position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(p.position);
  gl.drawArrays(gl.LINE_LOOP, 0, 110);
  gl.disableVertexAttribArray(p.position);
  gl.flush();
};
