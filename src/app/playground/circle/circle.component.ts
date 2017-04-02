import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';


// import * as 'assets/js/sylvester.js';

@Component({
  selector: 'app-circle',
  templateUrl: './circle.component.html',
  styleUrls: ['./circle.component.scss']
})
export class CircleComponent implements OnInit {

  @ViewChild('myCanvas') myCanvas: ElementRef;
  gl: any;
  squareVerticesBuffer;
  mvMatrix;
  shaderProgram;
  vertexPositionAttribute;
  perspectiveMatrix;

  constructor() { }

  ngOnInit() {
    this.start();
  }

  start() {
    let canvas = this.myCanvas.nativeElement;

    // Initialize the this.gl context
    this.gl = this.initWebGL(canvas);

    // Only continue if WebGL is available and working
    if (!this.gl) {
      return;
    }

    // Set clear color to black, fully opaque
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Enable depth testing
    this.gl.enable(this.gl.DEPTH_TEST);
    // Near things obscure far things
    this.gl.depthFunc(this.gl.LEQUAL);
    // Clear the color as well as the depth buffer.
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }

  initWebGL(canvas) {
    this.gl = null;

    // Try to grab the standard context. If it fails, fallback to experimental.
    this.gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    // If we don't have a this.gl context, give up now
    if (!this.gl) {
      alert('Unable to initialize WebGL. Your browser may not support it.');
    }

    return this.gl;
  }

  initShaders() {
    var fragmentShader = this.getShader(this.gl, 'shader-fs');
    var vertexShader = this.getShader(this.gl, 'shader-vs');

    // Create the shader program

    this.shaderProgram = this.gl.createProgram();
    this.gl.attachShader(this.shaderProgram, vertexShader);
    this.gl.attachShader(this.shaderProgram, fragmentShader);
    this.gl.linkProgram(this.shaderProgram);

    // If creating the shader program failed, alert

    if (!this.gl.getProgramParameter(this.shaderProgram, this.gl.LINK_STATUS)) {
      console.log('Unable to initialize the shader program: ' + this.gl.getProgramInfoLog(this.shaderProgram));
    }

    this.gl.useProgram(this.shaderProgram);

    this.vertexPositionAttribute = this.gl.getAttribLocation(this.shaderProgram, 'aVertexPosition');
    this.gl.enableVertexAttribArray(this.vertexPositionAttribute);
  }

  getShader(gl, id, type = '') {
    var shaderScript, theSource, currentChild, shader;

    shaderScript = document.getElementById(id);

    if (!shaderScript) {
      return null;
    }

    theSource = shaderScript.text;

    if (!type) {
      if (shaderScript.type == 'x-shader/x-fragment') {
        type = gl.FRAGMENT_SHADER;
      } else if (shaderScript.type == 'x-shader/x-vertex') {
        type = gl.VERTEX_SHADER;
      } else {
        // Unknown shader type
        return null;
      }
    }
    shader = gl.createShader(type);
    gl.shaderSource(shader, theSource);

    // Compile the shader program
    gl.compileShader(shader);

    // See if it compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.log('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }


}
