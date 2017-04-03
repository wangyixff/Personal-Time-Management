import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import THREE from 'assets/js/three.min.js';

@Component({
  selector: 'app-example1',
  templateUrl: './example1.component.html',
  styleUrls: ['./example1.component.scss']
})
export class Example1Component implements OnInit {

  @ViewChild("myCanvas") myCanvas: ElementRef;

  constructor() { }

  ngOnInit() {
    let scene = new THREE.Scene();
  }

}

var scene, camera, renderer;
var geometry, material, mesh;

function init() {
 
    scene = new THREE.Scene();
 
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 1000;
 
    geometry = new THREE.BoxGeometry( 200, 200, 200 );
    material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
 
    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );
 
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
 
    document.body.appendChild( renderer.domElement );
 
}
 
function animate() {
 
    requestAnimationFrame( animate );
 
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;
 
    renderer.render( scene, camera );
 
}
