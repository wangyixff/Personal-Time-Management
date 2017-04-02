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

   

var r=0.5;

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
