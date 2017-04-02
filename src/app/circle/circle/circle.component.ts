import { CircleModule } from './../circle.module';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
declare var THREE :any;
declare var Stats :any;
@Component({
  selector: 'app-circle',
  templateUrl: './circle.component.html',
  styleUrls: ['./circle.component.css']
})
export class CircleComponent implements OnInit {

  @ViewChild("myCanvas") myCanvas: ElementRef;
  @ViewChild("myCanvas2") myCanvas2: ElementRef;
  width= 300;
  height = 300;
   
  constructor() { }

  
  ngOnInit() {
  }
  
  
  ngAfterViewInit() {
  
  var gl = this.myCanvas.nativeElement.getContext('experimental-webgl');
     /*======= Defining and storing the geometry ======*/

         var vertices = [
           0,0,0,
        
           1*Math.cos(10),1*Math.sin(10),0,
          1*Math.cos(10*2),1*Math.sin(10*2),0,
          1*Math.cos(10*3),1*Math.sin(10*3),0,
          1*Math.cos(10*4),1*Math.sin(10*4),0,
          1*Math.cos(10*5),1*Math.sin(10*5),0,
          1*Math.cos(10*6),1*Math.sin(10*6),0,
          1*Math.cos(10*7),1*Math.sin(10*7),0,
          1*Math.cos(10*8),1*Math.sin(10*8),0,
          1*Math.cos(10*9),1*Math.sin(10*9),0,
          1*Math.cos(10*10),1*Math.sin(10*10),0,
          1*Math.cos(10*11),1*Math.sin(10*11),0,
          
          1*Math.cos(10*12),1*Math.sin(10*12),0,
          1*Math.cos(10*13),1*Math.sin(10*13),0,
          1*Math.cos(10*14),1*Math.sin(10*14),0,
          1*Math.cos(10*15),1*Math.sin(10*15),0,
          1*Math.cos(10*16),1*Math.sin(10*16),0,
          1*Math.cos(10*17),1*Math.sin(10*17),0,
          1*Math.cos(10*18),1*Math.sin(10*18),0,
          1*Math.cos(10*19),1*Math.sin(10*19),0,
          1*Math.cos(10*20),1*Math.sin(10*20),0,
          1*Math.cos(10*21),1*Math.sin(10*21),0,

          1*Math.cos(10*22),1*Math.sin(10*22),0,
          1*Math.cos(10*23),1*Math.sin(10*23),0,
          1*Math.cos(10*24),1*Math.sin(10*24),0,
          1*Math.cos(10*25),1*Math.sin(10*25),0,
          1*Math.cos(10*26),1*Math.sin(10*26),0,
          1*Math.cos(10*27),1*Math.sin(10*27),0,
          1*Math.cos(10*28),1*Math.sin(10*28),0,
          1*Math.cos(10*29),1*Math.sin(10*29),0,
          1*Math.cos(10*30),1*Math.sin(10*30),0,
          1*Math.cos(10*31),1*Math.sin(10*31),0,
          //0,0,0,
           // -0.4,0.8,0,
           //-0.4,0.6,0,
            //0.7,0.6,0 
         ]
          
         var pi = 3.14159;
var x = 2*pi/100;
var y = 2*pi/100;
var r = 0.5;

var vertices = [0,0,0]; //establish origin
for(var i = 0.0; i <= 101; i++){
    vertices.push(r*Math.cos(2*i*Math.PI/100), r*Math.sin(2*i*Math.PI/100),0);
    
}








         // Create an empty buffer object
         var vertex_buffer = gl.createBuffer();

         // Bind appropriate array buffer to it
         gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
      
         // Pass the vertex data to the buffer
         gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

         // Unbind the buffer
         gl.bindBuffer(gl.ARRAY_BUFFER, null);

         /*=================== Shaders ====================*/

         // Vertex shader source code
         var vertCode =
            'attribute vec3 coordinates;' +
            'void main(void) {' +
               ' gl_Position = vec4(coordinates, 1.0);' +
            '}';

         // Create a vertex shader object
         var vertShader = gl.createShader(gl.VERTEX_SHADER);

         // Attach vertex shader source code
         gl.shaderSource(vertShader, vertCode);

         // Compile the vertex shader
         gl.compileShader(vertShader);

         // Fragment shader source code
         var fragCode =
            'void main(void) {' +
               'gl_FragColor = vec4(0.0, 0.0, 0.0, 0.1);' +
            '}';

         // Create fragment shader object
         var fragShader = gl.createShader(gl.FRAGMENT_SHADER);

         // Attach fragment shader source code
         gl.shaderSource(fragShader, fragCode);

         // Compile the fragmentt shader
         gl.compileShader(fragShader);

         // Create a shader program object to store
         // the combined shader program
         var shaderProgram = gl.createProgram();

         // Attach a vertex shader
         gl.attachShader(shaderProgram, vertShader);

         // Attach a fragment shader
         gl.attachShader(shaderProgram, fragShader);

         // Link both the programs
         gl.linkProgram(shaderProgram);

         // Use the combined shader program object
         gl.useProgram(shaderProgram);

         /*======= Associating shaders to buffer objects ======*/

         // Bind vertex buffer object
         gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

         // Get the attribute location
         var coord = gl.getAttribLocation(shaderProgram, "coordinates");

         // Point an attribute to the currently bound VBO
         gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);

         // Enable the attribute
         gl.enableVertexAttribArray(coord);

         /*============ Drawing the triangle =============*/

         // Clear the canvas
         gl.clearColor(0.5, 0.5, 0.5, 0.9);

         // Enable the depth test
         gl.enable(gl.DEPTH_TEST);

         // Clear the color and depth buffer
         gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

         // Set the view port
         gl.viewport(0,0,this.width,this.height);

         // Draw the triangle


         
         
         gl.drawArrays(gl.TRIANGLE_FAN, 0, 102);

         // POINTS, LINE_STRIP, LINE_LOOP, LINES,
         // TRIANGLE_STRIP,TRIANGLE_FAN, TRIANGLES  









 }



}
