import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';

declare var mat4: any;

@Component({
  selector: 'app-lesson3',
  templateUrl: './lesson3.component.html',
  styleUrls: ['./lesson3.component.scss']
})
export class Lesson3Component implements OnInit {

  @ViewChild('myCanvas') myCanvas: ElementRef;
  gl: any;
  squareVerticesBuffer;
  
  vertexPositionAttribute;
  perspectiveMatrix;

  constructor(
    private ngZone: NgZone
  ) { }

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => this.tick);
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
    
    this.tick();
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

  getShader(gl, id) {
    let type = '';
    let shader;
    let theSource;

    if (id) {
      if (id == 'shader-fs') {
        type = gl.FRAGMENT_SHADER;
        theSource = `
          precision mediump float;

          varying vec4 vColor;

          void main(void) {
              gl_FragColor = vColor;
          }
        `;
      } else if (id == 'shader-vs') {
        type = gl.VERTEX_SHADER;
        theSource = `
          attribute vec3 aVertexPosition;
          attribute vec4 aVertexColor;

          uniform mat4 uMVMatrix;
          uniform mat4 uPMatrix;

          varying vec4 vColor;

          void main(void) {
              gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
              vColor = aVertexColor;
          }
        `;
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

    this.shaderProgram.vertexColorAttribute = this.gl.getAttribLocation(this.shaderProgram, "aVertexColor");
    this.gl.enableVertexAttribArray(this.shaderProgram.vertexColorAttribute);

    this.shaderProgram.pMatrixUniform = this.gl.getUniformLocation(this.shaderProgram, "uPMatrix");
    this.shaderProgram.mvMatrixUniform = this.gl.getUniformLocation(this.shaderProgram, "uMVMatrix");
  }

  mvMatrix = mat4.create();
  mvMatrixStack = [];
  pMatrix = mat4.create();

  setMatrixUniforms() {
    this.gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, this.pMatrix);
    this.gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, this.mvMatrix);
  }


  triangleVertexPositionBuffer;
  triangleVertexColorBuffer;
  squareVertexPositionBuffer;
  squareVertexColorBuffer;

  initBuffers(){
    // triangle
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

    this.triangleVertexColorBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.triangleVertexColorBuffer);
    let colors = [
      1.0, 0.0, 0.0, 1.0,
      0.0, 1.0, 0.0, 1.0,
      0.0, 0.0, 1.0, 1.0
    ];
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW);
    this.triangleVertexColorBuffer.itemSize = 4;
    this.triangleVertexColorBuffer.numItems = 3;


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

    this.squareVertexColorBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.squareVertexColorBuffer);
    colors = [
      1.0, 0.0, 0.0, 1.0,
      0.0, 1.0, 0.0, 1.0,
      0.0, 0.0, 1.0, 1.0,
      1.0, 1.0, 0.0, 1.0
    ];
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW);
    this.squareVertexColorBuffer.itemSize = 4;
    this.squareVertexColorBuffer.numItems = 4;
  }

  drawScene() {
    this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
    // clear scene
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    // view perspective
    mat4.perspective(45, this.gl.viewportWidth / this.gl.viewportHeight, 0.1, 100.0, this.pMatrix);
    mat4.identity(this.mvMatrix);

    mat4.translate(this.mvMatrix, [-1.5, 0.0, -7.0]);
    this.mvPushMatrix();
    mat4.rotate(this.mvMatrix, this.degToRad(this.rTri), [0, 1, 0]);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.triangleVertexPositionBuffer);
    this.gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, this.triangleVertexPositionBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.triangleVertexColorBuffer);
    this.gl.vertexAttribPointer(this.shaderProgram.vertexColorAttribute, this.triangleVertexColorBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
    this.setMatrixUniforms();
    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.triangleVertexPositionBuffer.numItems);

    this.mvPopMatrix();

    mat4.translate(this.mvMatrix, [3.0, 0.0, -7.0]);
    this.mvPushMatrix();
    mat4.rotate(this.mvMatrix, this.degToRad(this.rSquare), [1, 1, 0]);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.squareVertexPositionBuffer);
    this.gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, this.squareVertexPositionBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.squareVertexColorBuffer);
    this.gl.vertexAttribPointer(this.shaderProgram.vertexColorAttribute, this.squareVertexColorBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
    this.setMatrixUniforms();
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, this.squareVertexPositionBuffer.numItems);
    this.mvPopMatrix();
  }

  rTri = 0;
  rSquare = 0;
  lastTime = 0;

  animate(){
    let timeNow = new Date().getTime();
    if (this.lastTime != 0) {
      var elapsed = timeNow - this.lastTime;

      this.rTri += (90 * elapsed) / 1000.0;
      this.rSquare += (75 * elapsed) / 1000.0;
    }
    this.lastTime = timeNow;
  }

  degToRad(deg){
    return deg * Math.PI / 180;
  }

  mvPushMatrix() {
    var copy = mat4.create();
    mat4.set(this.mvMatrix, copy);
    this.mvMatrixStack.push(copy);
  }

  mvPopMatrix() {
    if (this.mvMatrixStack.length == 0) {
      throw "Invalid popMatrix!";
    }
    this.mvMatrix = this.mvMatrixStack.pop();
  }

  tick = () => {
    requestAnimationFrame(this.tick);
    this.drawScene();
    this.animate();
  }

}
