import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

declare var mat4: any;

@Component({
  selector: 'app-circle',
  templateUrl: './circle.component.html',
  styleUrls: ['./circle.component.scss']
})
export class CircleComponent implements OnInit {

  @ViewChild('myCanvas') myCanvas: ElementRef;
  gl: any;
  squareVerticesBuffer;
  
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

    this.initShaders()
    this.initBuffers();

    // Set clear color to black, fully opaque
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Enable depth testing
    this.gl.enable(this.gl.DEPTH_TEST);
    
    this.drawScene();
  }

  initWebGL(canvas) {
    this.gl = null;

    // Try to grab the standard context. If it fails, fallback to experimental.
    this.gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    // If we don't have a this.gl context, give up now
    if (!this.gl) {
      alert('Unable to initialize WebGL. Your browser may not support it.');
    }
    this.gl.viewportWidth = canvas.width;
    this.gl.viewportHeight = canvas.height;

    return this.gl;
  }

  getShader(gl, id, type = null) {
    var shaderScript, theSource, currentChild, shader;

    shaderScript = document.getElementById(id);console.log(shaderScript);

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

  shaderProgram;

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

    this.shaderProgram.vertexPositionAttribute = this.gl.getAttribLocation(this.shaderProgram, 'aVertexPosition');
    this.gl.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);

    this.shaderProgram.pMatrixUniform = this.gl.getUniformLocation(this.shaderProgram, "uPMatrix");
    this.shaderProgram.mvMatrixUniform = this.gl.getUniformLocation(this.shaderProgram, "uMVMatrix");
  }

  mvMatrix = mat4.create();
  pMatrix = mat4.create();

  setMatrixUniforms() {
    this.gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, this.pMatrix);
    this.gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, this.mvMatrix);
  }


  triangleVertexPositionBuffer;
  squareVertexPositionBuffer

  initBuffers(){
    this.triangleVertexPositionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.triangleVertexPositionBuffer);

    var vertices = [
         0.0,  1.0,  0.0,
        -1.0, -1.0,  0.0,
         1.0, -1.0,  0.0
    ];

    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);

    this.triangleVertexPositionBuffer.itemSize = 3;
    this.triangleVertexPositionBuffer.numItems = 3;


    // square
    this.squareVertexPositionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.squareVertexPositionBuffer);

    vertices = [
         1.0,  1.0,  0.0,
        -1.0,  1.0,  0.0,
         1.0, -1.0,  0.0,
        -1.0, -1.0,  0.0
    ];

    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
    this.squareVertexPositionBuffer.itemSize = 3;
    this.squareVertexPositionBuffer.numItems = 4;
  }

  drawScene() {
    this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
    // clear scene
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    // view perspective
    mat4.perspective(45, this.gl.viewportWidth / this.gl.viewportHeight, 0.1, 100.0, this.pMatrix);
    mat4.identity(this.mvMatrix);

    mat4.translate(this.mvMatrix, [-1.5, 0.0, -7.0]);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.triangleVertexPositionBuffer);
    this.gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, this.triangleVertexPositionBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
    this.setMatrixUniforms();
    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.triangleVertexPositionBuffer.numItems);


    mat4.translate(this.mvMatrix, [3.0, 0.0, -7.0]);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.squareVertexPositionBuffer);
    this.gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, this.squareVertexPositionBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
    this.setMatrixUniforms();
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, this.squareVertexPositionBuffer.numItems);
  }


}
