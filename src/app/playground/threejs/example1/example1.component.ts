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

  objects: any[] = [];
  raycaster: THREE.Raycaster;
  mouse: { x: number, y: number } = {x: 1, y: 1};

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
    // update the picking ray with the camera and mouse position
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // calculate objects intersecting the picking ray
    var intersects: any = this.raycaster.intersectObjects(this.scene.children);

    for (var i = 0; i < intersects.length; i++) {console.log("found");console.log(this.scene.children);
      intersects[i].object.material.color.set(0xff0000);console.log("intersects:", intersects);console.log("mouse: ", this.mouse.x, this.mouse.y);
      this.router.navigate(intersects[i].object.url);
    }

    this.mouse.x = 1;
    this.mouse.y = 1;

    //this.camera.position.x=(10*Math.PI/180);
   // this.camera.rotation.y=(20*Math.PI/180,0);
    //this.camera.rotation.z=(90*Math.PI/180,0);
    
    this.renderer.render(this.scene, this.camera);


//this.camera.position.set(10, 10, 0);
    requestAnimationFrame( this.animate );
    
    this.j=(this.j+1)%360;
    let rad = this.j * Math.PI / 180;
    this.camera.position.set(0, 100 * Math.sin(rad), 100 * Math.cos(rad));
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

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
      let circle = new THREE.Mesh(geometry, material);
      let myCircle = new MyCircle(circle);
      myCircle.url = ['', 'playground', 'lesson' + i];
      this.scene.add(myCircle);
    }


  }

  onMouseMove($event) {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components 
    this.mouse.x = ($event.clientX / this.myCanvas.nativeElement.width) * 2 - 1;
    this.mouse.y = - ($event.clientY / this.myCanvas.nativeElement.height) * 2 + 1;
  }




}
