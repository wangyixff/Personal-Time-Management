import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-example1',
  templateUrl: './example1.component.html',
  styleUrls: ['./example1.component.scss']
})
export class Example1Component implements OnInit {

  @ViewChild("myCanvas") myCanvas: ElementRef;

  renderer: THREE.Renderer;
  camera: THREE.Camera;
  scene: THREE.Scene;

  constructor(
    private ngZone: NgZone
  ) { }

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => this.animate);
    this.init(this.myCanvas.nativeElement);
  }

  // draw
  animate = () => {

  }
 
  init(canvas) {
    this.renderer = new THREE.WebGLRenderer({ canvas: canvas });
    this.renderer.setSize(canvas.width, canvas.height);

    let camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 1, 400);
    camera.position.set(0, 0, 100);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.scene = new THREE.Scene();
    this.drawCircle(5);
    this.renderer.render(this.scene, camera);
  }
  drawCircle(fanNumber) {
     // create circle
   
    for(var i = 0; i < fanNumber; i++){
    let geometry = new THREE.CircleBufferGeometry( 30, 100, Math.PI*2/fanNumber*i, Math.PI*2/fanNumber );
    let material = new THREE.MeshBasicMaterial( { color: 0xffffe0-i*7000 } );
    let circle = new THREE.Mesh( geometry, material );
    this.scene.add(circle);
    }
    

  }

}
