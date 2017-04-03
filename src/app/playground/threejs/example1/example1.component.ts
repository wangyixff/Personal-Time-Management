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

    let camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 1, 500);
    camera.position.set(0, 0, 100);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    let scene = new THREE.Scene();

    // create circle
    let geometry = new THREE.CircleBufferGeometry( 5, 32, Math.PI/2, Math.PI );
    let material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
    let circle = new THREE.Mesh( geometry, material );
    scene.add(circle);
    
    // create circle
    let geometry2 = new THREE.CircleBufferGeometry( 5, 32, 0, Math.PI/2 );
    let material2 = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    let circle2 = new THREE.Mesh( geometry2, material2 );
    scene.add(circle2);
    


    this.renderer.render(scene, camera);
  }

}
