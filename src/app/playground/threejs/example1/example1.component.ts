import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import * as THREE from 'three';

class MyCircle extends THREE.Mesh {
  constructor(mesh){
    super(mesh.geometry, mesh.material);
  }

  url: string[];
}

@Component({
  selector: 'app-example1',
  templateUrl: './example1.component.html',
  styleUrls: ['./example1.component.scss']
})
export class Example1Component implements OnInit {

  @ViewChild("myCanvas") myCanvas: ElementRef;

  renderer: THREE.WebGLRenderer;
  camera: THREE.Camera;
  scene: THREE.Scene;
  projector: THREE.Projector;

  objects: any[] = [];
  raycaster: THREE.Raycaster;
  mouse: { x: number, y: number } = {x: 1, y: 1};

  // camera rotation
  angle: number = 0;

  // flags
  selectFlag: boolean = false;
  mouseDownFlag: boolean = false;
  mouseMoveFlag: boolean = false;
  mouseUpFlag: boolean = false;
  dragFlag: boolean = false;

  constructor(
    private ngZone: NgZone,
    private router: Router
  ) { }

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => this.animate);
    this.init(this.myCanvas.nativeElement);
  }

  // draw
  animate = () => {
    // calculate objects intersecting the picking ray
    this.select();

    // drag
    this.drag();

    
    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame( this.animate );
    
    // this.j=(this.j+0.2)%360;
    // let rad = (this.j) * Math.PI / 180;
    // this.camera.position.set(0, 100 * Math.sin(rad), 100 * Math.cos(rad));
    // //this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    // this.camera.rotation.x=-this.j/180*Math.PI;

    //this.camera.rotateY(this.j);
    //this.camera.rotateZ(this.j*100);
  }
 j=0;
  init(canvas) {
    this.renderer = new THREE.WebGLRenderer({ canvas: canvas });
    this.renderer.setClearColor( 0xffffff, 1 );
    this.renderer.setSize(canvas.width, canvas.height);

    this.camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 1, 400);
    this.camera.position.set(0, 0, 100);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    this.scene = new THREE.Scene();
    this.drawCircle(5);
    this.renderer.setClearColor(0x000000);
    this.renderer.render(this.scene, this.camera);

    // raycaster
    this.raycaster = new THREE.Raycaster();
    this.raycaster.setFromCamera(this.mouse, this.camera);

    this.animate();
  }
  drawCircle(fanNumber) {
    // create circle

    for (var i = 0; i < fanNumber; i++) {
      let geometry = new THREE.CircleGeometry(30, 24, Math.PI * 2 / fanNumber * i, Math.PI * 2 / fanNumber);
      let material = new THREE.MeshBasicMaterial({ color: 0xffffe0 - i * 7000 });
      material.side=THREE.DoubleSide;
      let circle = new THREE.Mesh(geometry, material);
      let myCircle = new MyCircle(circle);
      myCircle.url = ['', 'playground', 'lesson' + i];
      this.scene.add(myCircle);
    }


  }

  onMouseClick($event: MouseEvent) {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components 
    this.mouse.x = ($event.clientX / this.myCanvas.nativeElement.width) * 2 - 1;
    this.mouse.y = - ($event.clientY / this.myCanvas.nativeElement.height) * 2 + 1;
    // this.selectFlag = true;
  }


  mouseDown: {x: number, y: number} = {x: 0, y: 0};
  onMouseDown($event: MouseEvent) {
    // console.log($event, $event.clientY);
    // get coordinates
    this.mouseDown.x = $event.clientX;
    this.mouseDown.y = $event.clientY;
    // set flag
    this.mouseDownFlag = true;
  }

  mouseMove: {x: number, y: number} = {x: 0, y: 0};
  onMouseMove($event: MouseEvent){
    // console.log($event.clientX);
    // get coordinates
    this.mouseMove.x = $event.clientX;
    this.mouseMove.y = $event.clientY;
    // dragFlag
    if(this.mouseDownFlag){
      this.dragFlag = true;
    }
  }

  onMouseUp($event: MouseEvent){
    // reset mouseDownFlag
    this.mouseDownFlag = false;
    // set mouseUpFlag
    this.mouseUpFlag = true;
  }

  select(){
    if(this.selectFlag){
      // update the picking ray with the camera and mouse position
      this.raycaster.setFromCamera(this.mouse, this.camera);

      let intersects: any = this.raycaster.intersectObjects(this.scene.children);
      for (let i = 0; i < intersects.length; i++) {
        intersects[i].object.material.color.set(0xff0000);
        this.router.navigate(intersects[i].object.url);
      }

      this.selectFlag = false;
    }
  }

  drag(){
    // check flag
    if(this.dragFlag){
      let angleUnit = Math.PI / 600 ;
      let distance = Math.sqrt(Math.pow(this.mouseDown.x - this.mouseMove.x, 2) + Math.pow(this.mouseDown.y - this.mouseMove.y, 2));
      let direction = this.mouseMove.x - this.mouseDown.x > 0 ? 1 : -1;
      let deltaAngle = angleUnit * distance * direction;
      this.camera.position.set(100*Math.sin(this.angle + deltaAngle), 0, 100*Math.cos(this.angle + deltaAngle));
      this.camera.rotation.y = (this.angle + deltaAngle);
      // this.camera.lookAt(new THREE.Vector3(0, 0, 0));

      if(this.mouseUpFlag){
        // store angle
        this.angle = this.angle + deltaAngle;
        this.mouseUpFlag = false;
        this.dragFlag = false;
      }
    }
  }


}
