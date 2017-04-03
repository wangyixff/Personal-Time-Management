import { CircleModule } from './../circle.module';
import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
declare var THREE :any;
declare var Stats :any;
declare var webglUtils:any;
declare var Detector: any;
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
   
  constructor(private ngZone: NgZone) { }

  
  ngOnInit() {
    this.ngZone.runOutsideAngular(() => this.render1);
  
  var gl = this.myCanvas.nativeElement.getContext('experimental-webgl');
  var gl2 = this.myCanvas2.nativeElement.getContext('experimental-webgl');
  
     /*======= Defining and storing the geometry ======*/

   

var r=0.5;

var vertices = [0,0,0]; //establish origin
for(var i = 0.0; i <= 101; i++){
    vertices.push(r*Math.cos(2*i*Math.PI/100), r*Math.sin(2*i*Math.PI/100),0);
    
}

var vertices2 = [0,0,0]; //establish origin
for(var i = 1; i <= 101; i++){
    vertices2.push(r*Math.cos(2*i*Math.PI/100), r*Math.sin(2*i*Math.PI/100),0);
    
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
               'gl_FragColor = vec4(0.0, 0.0, 0.0, 0.5);' +
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
         gl.clearColor(1.0, 1.0, 1.0, 0.9);

         // Enable the depth test
         gl.enable(gl.DEPTH_TEST);

         // Clear the color and depth buffer
         gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

         // Set the view port
         gl.viewport(0,0,this.width,this.height);

         // Draw the triangle


         
         
         gl.drawArrays(gl.TRIANGLE_FAN, 0, 20);

         // POINTS, LINE_STRIP, LINE_LOOP, LINES,
         // TRIANGLE_STRIP,TRIANGLE_FAN, TRIANGLES  
         this.ini_draw(gl, vertices, 80, 0.8);

         this.ini_draw(gl, vertices, 90, 0.7);

         this.ini_draw(gl, vertices, 100, 0.6);

         this.ini_draw(gl, vertices, 102, 0.5);
 
         //this.ini_draw(gl2,vertices, 50, 0.5);
///playaround  
this.renderer=new THREE.WebGLRenderer({canvas: this.myCanvas2.nativeElement, antialias:true});
this.renderer.setClearColor(0x000000);
this.renderer.setSize(300, 300);

this.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 300);
this.camera.position.set(0,0,0);
this.scene = new THREE.Scene();

var light = new THREE.AmbientLight(0xffffff,0.5);
this.scene.add(light);
var light1 = new THREE.PointLight(0xffffff,0.5);
this.scene.add(light1);



//var geometry = new THREE.CubeGeometry(50,50,50);
var geometry = new THREE.Geometry();
geometry.vertices.push(
  new THREE.Vector3(-10,10,0),
  new THREE.Vector3(-10,-10,0),
  new THREE.Vector3(10,-10,0),
  
)
geometry.faces.push(new THREE.Face3(0,1,2));

// var loader = new THREE.FontLoader();
// loader.load( 'assets/font/helvetiker_bold.typeface.json', function ( font ) {

//     var textGeo = new THREE.TextGeometry( "My Text", {

//         font: font,

//         size: 20,
//         height: 50,
//         curveSegments: 12,

//         bevelThickness: 2,
//         bevelSize: 5,
//         bevelEnabled: true

//     } );

//     var textMaterial = new THREE.MeshPhongMaterial( { color: 0xffff00 } );

//     var mesh2 = new THREE.Mesh( textGeo, textMaterial );
//     mesh2.position.set( 0, 0, -10 );
//     var scene2 = new THREE.Scene();
//     scene2.add( mesh2 );

// } );


var material = new THREE.MeshLambertMaterial({color:0xF3FFE2});
this.mesh = new THREE.Mesh(geometry,material);
this.mesh.position.set(0,0,-200);

this.scene.add(this.mesh);
this.renderer.render(this.scene, this.camera);



this.running = true;
requestAnimationFrame(this.render1);





}


renderer;
camera;
scene;
mesh;
running: boolean = false;
textMesh;

 ini_draw (gl, vertices, percentage, color){

         var colorSentence ='gl_FragColor = vec4('+ color.toString()+', 0.0, 0.0, 1.0);';


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
               colorSentence +
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

           // Bind vertex buffer object
         gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

         // Get the attribute location
         var coord = gl.getAttribLocation(shaderProgram, "coordinates");

         // Point an attribute to the currently bound VBO
         gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);

         // Enable the attribute
         gl.enableVertexAttribArray(coord);

          gl.drawArrays(gl.TRIANGLE_FAN, 0, percentage);

}

  
render1 = () => {
  if(this.running){
    this.mesh.rotation.x += 0.01;
    this.mesh.rotation.y += 0.01;
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render1);
  
  }
}
















}
