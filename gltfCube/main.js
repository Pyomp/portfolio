'use strict'

import { styles } from "../js-lib/dom/styles/styles.js"
import { OrbitControls } from "../js-lib/3dEngine/controls/OrbitControls.js"
import { LightParticleObject } from "../js-lib/3dEngine/extras/LightParticleObject.js"
import { loadGLTF } from "../js-lib/3dEngine/loaders/gltfLoader.js"
import { Renderer } from "../js-lib/3dEngine/renderer/Renderer.js"
import { PointLight } from "../js-lib/3dEngine/sceneGraph/light/PointLight.js"
import { loopRaf } from "../js-lib/globals/loopRaf.js"
import { BasicStaticMaterial } from "../js-lib/3dEngine/sceneGraph/materials/BasicStaticGltfMaterial.js"
import { Node3D } from "../js-lib/3dEngine/sceneGraph/Node3D.js"

const renderer = new Renderer()
document.body.prepend(renderer.htmlElement)

// Point Light
const lightParticleObject = new LightParticleObject()
lightParticleObject.count = 2
renderer.scene.objects.add(lightParticleObject)

const pointLight1 = new PointLight()
pointLight1.color.setRGB(1, 0, 0)
pointLight1.position.set(3, 0, 0)
renderer.pointLights.add(pointLight1)
const pointLight2 = new PointLight()
pointLight2.color.setRGB(0, 0, 1)
pointLight2.position.set(-3, 0, 0)
renderer.pointLights.add(pointLight2)

const orbitControls = new OrbitControls(renderer.camera, renderer.htmlElement)

// Mesh Init
const basicStaticMaterial = new BasicStaticMaterial()

const gltfNodes = await loadGLTF(new URL('./cube.glb', import.meta.url))

const cubeNode = new Node3D()
const cube = basicStaticMaterial.createObjectFromGltf(cubeNode, gltfNodes['Cube'].mesh.primitives[0])
cubeNode.objects.add(cube)

renderer.scene.addNode3D(cubeNode)

loopRaf.listeners.add(() => {
    orbitControls.update()
    renderer.render(0.1)
})
