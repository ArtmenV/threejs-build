import './style.css'

import gsap from 'gsap'
import * as THREE from 'https://cdn.skypack.dev/three@0.129.0';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';

const gui = new dat.GUI()
const world = {
  plane: {
    width: 500,
    height: 500,
    widthSegments: 60,
    heightSegments: 60,
  }
}

gui.add(world.plane, 'width', 1, 700)
  .onChange(generatePlane)

gui.add(world.plane, 'height', 1, 700)
  .onChange(generatePlane)

gui.add(world.plane, 'widthSegments', 1, 120)
  .onChange(generatePlane)

gui.add(world.plane, 'heightSegments', 1, 50)
  .onChange(generatePlane)

function generatePlane() {
  planeMesh.geometry.dispose()
  planeMesh.geometry = new THREE.PlaneGeometry(
    world.plane.width,
    world.plane.height, 
    world.plane.widthSegments,
    world.plane.heightSegments,
  )
  const {array} = planeMesh.geometry.attributes.position

  for (let index = 0; index < array.length; index += 3) {
    const x = array[index]
    const y = array[index + 1]
    const z = array[index + 2]

    array[index + 2] = z + Math.random() * 1
  }

  const colors = []
  for (let index = 0; index < count; index++) {
    colors.push(0, 0.19, 0.4)
  }

  planeMesh.geometry.setAttribute(
    'color', 
    new THREE.BufferAttribute(new Float32Array(colors), 3)
  )
}

const raycaster = new THREE.Raycaster()
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

new OrbitControls(camera, renderer.domElement)

camera.position.z = 50

const {
  width, 
  height,
  widthSegments,
  heightSegments, 
} = world.plane
const planeGeometry = new THREE.PlaneGeometry(width, height, widthSegments, heightSegments)
const planeMaterial = new THREE.MeshPhongMaterial({
  side: THREE.DoubleSide,
  flatShading: THREE.FlatShading,
  vertexColors: true
})
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
scene.add(planeMesh)

//vertice position randomizations
const {array, count} = planeMesh.geometry.attributes.position
const randomValues = []
for (let index = 0; index < array.length; index++) {

  if (index % 3 === 0) {
    const x = array[index]
    const y = array[index + 1]
    const z = array[index + 2]
  
    array[index] = x + (Math.random() - 0.5) * 8
    array[index + 1] = y + (Math.random() - 0.5) * 8
    array[index + 2] = z + (Math.random() - 0.5) * 8
  }

  randomValues.push(Math.random() - 0.5)
}

planeMesh.geometry.attributes.position.randomValues = randomValues
planeMesh.geometry.attributes.position.originalPosition = array

// color attribute addition
const colors = []
for (let index = 0; index < count; index++) {
  colors.push(0, 0.19, 0.4)
}

planeMesh.geometry.setAttribute(
  'color', 
  new THREE.BufferAttribute(new Float32Array(colors), 3)
)

const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(0, -1, 1)
scene.add(light)

const backLight = new THREE.DirectionalLight(0xffffff, 1)
backLight.position.set(0, 0, -1)
scene.add(backLight)

const mouse = {
  x: null,
  y: null,
}

let frame = 0
function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)

  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObject(planeMesh)
  frame += 0.01

  const {array, originalPosition, randomValues} = planeMesh.geometry.attributes.position

  for (let index = 0; index < array.length; index += 3) {
    array[index] = originalPosition[index] + Math.cos(frame + randomValues[index]) * 0.005
    array[index + 1] = originalPosition[index + 1] + Math.sin(frame + randomValues[index + 1]) * 0.005
  }

  planeMesh.geometry.attributes.position.needsUpdate = true

  if (intersects.length > 0) {
    const { color } = intersects[0].object.geometry.attributes
    // vertice 1
    color.setX(intersects[0].face.a, 0.1)
    color.setY(intersects[0].face.a, 0.5)
    color.setZ(intersects[0].face.a, 1)

    // vertice 2
    color.setX(intersects[0].face.b, 0.1)
    color.setY(intersects[0].face.b, 0.5)
    color.setZ(intersects[0].face.b, 1)

    // vertice 3
    color.setX(intersects[0].face.c, 0.1)
    color.setY(intersects[0].face.c, 0.5)
    color.setZ(intersects[0].face.c, 1)

    intersects[0].object.geometry.attributes.color.needsUpdate = true

    const initialColor = {
      r: 0,
      g: 0.19,
      b: 0.4,
    }

    const hoverColor = {
      r: 0.1,
      g: .5,
      b: 1,
    }

    //animation clear hover effect
    gsap.to(hoverColor, {
      r: initialColor.r,
      g: initialColor.g,
      b: initialColor.b,
      duration: 1,
      onUpdate: () => {
        // vertice 1
        color.setX(intersects[0].face.a, hoverColor.r)
        color.setY(intersects[0].face.a, hoverColor.g)
        color.setZ(intersects[0].face.a, hoverColor.b)

        // vertice 2
        color.setX(intersects[0].face.b, hoverColor.r)
        color.setY(intersects[0].face.b, hoverColor.g)
        color.setZ(intersects[0].face.b, hoverColor.b)

        // vertice 3s
        color.setX(intersects[0].face.c, hoverColor.r)
        color.setY(intersects[0].face.c, hoverColor.g)
        color.setZ(intersects[0].face.c, hoverColor.b)

        color.needsUpdate = true
      }
    })
  }
}

animate()

addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / innerWidth) * 2 - 1
  mouse.y = -(event.clientY / innerHeight) * 2 + 1
})
