import './style.css'

import * as THREE from 'https://cdn.skypack.dev/three@0.129.0';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75, 
  innerWidth / innerHeight, 
  0.1, 
  1000
)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(innerWidth, innerHeight)

document.body.appendChild(renderer.domElement)

const boxGeometry = new THREE.BoxGeometry(
  15, 15, 15,
)
const material = new THREE.MeshBasicMaterial({color: 0x00FF00})

const mesh = new THREE.Mesh(boxGeometry, material)
scene.add(mesh)
camera.position.z = 50

renderer.render(scene, camera)
