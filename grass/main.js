'use strict'

import { styles } from "../js-lib/dom/styles/styles.js"
import { OrbitControls } from "../js-lib/3dEngine/controls/OrbitControls.js"
import { LightParticleObject } from "../js-lib/3dEngine/extras/LightParticleObject.js"
import { loadGLTF } from "../js-lib/3dEngine/loaders/gltfLoader.js"
import { Renderer } from "../js-lib/3dEngine/renderer/Renderer.js"
import { PointLight } from "../js-lib/3dEngine/sceneGraph/light/PointLight.js"
import { loopRaf } from "../js-lib/globals/loopRaf.js"
import { StaticGltfNode } from "../js-lib/3dEngine/sceneGraph/gltf/static/StaticGltfNode.js"

const renderer = new Renderer()
document.body.prepend(renderer.domElement)

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

const orbitControls = new OrbitControls(renderer.camera, renderer.domElement)

// Mesh Init

const gltfNodes = await loadGLTF(new URL('./cube.glb', import.meta.url))

const cube = gltfNodes['Cube']

// const textureImage = new Image()
// textureImage.src = new URL('./cubeTexture.png', import.meta.url).href
// await new Promise((resolve) => { textureImage.onload = resolve })

// for (const primitive of cube.mesh.primitives) {
//     if (primitive.material.pbrMetallicRoughness.baseColorTexture) {
//         primitive.material.pbrMetallicRoughness.baseColorTexture.image = textureImage
//     }
// }

const skinnedNode = new StaticGltfNode(cube)

renderer.scene.addNode3D(skinnedNode)

// Animation

loopRaf.listeners.add(() => {
    orbitControls.update()
    renderer.render()
})

// Point Light

// HTML
