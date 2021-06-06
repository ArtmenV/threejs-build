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
renderer.setPixelRatio(devicePixelRatio)

document.body.appendChild(renderer.domElement)

camera.position.z = 5

const planeGeometry = new THREE.PlaneGeometry(5, 5, 10, 10)
const planeMaterial = new THREE.MeshPhongMaterial({
  color: 0xff0000,
  side: THREE.DoubleSide
})
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
scene.add(planeMesh)

const {array} = planeMesh.geometry.attributes.position

for (let index = 0; index < array.length; index += 3) {
  console.log(array[index]);
  const x = array[index]
  const y = array[index + 1]
  const z = array[index + 2]

  array[index + 2] = z + Math.random() * 1
}

const light = new THREE.DirectionalLight(
  0xffffff, 1
)
light.position.set(0, 0, 1)
scene.add(light)

function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  // planeMesh.rotation.x += 0.01
}

animate()
