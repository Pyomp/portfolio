'use strict'

import { styles } from "../js-lib/dom/styles/styles.js"
import { OrbitControls } from "../js-lib/3dEngine/controls/OrbitControls.js"
import { LightParticleObject } from "../js-lib/3dEngine/extras/LightParticleObject.js"
import { loadGLTF } from "../js-lib/3dEngine/loaders/gltfLoader.js"
import { Renderer } from "../js-lib/3dEngine/renderer/Renderer.js"
import { PointLight } from "../js-lib/3dEngine/sceneGraph/light/PointLight.js"
import { loopRaf } from "../js-lib/globals/loopRaf.js"
import { SplattingNode } from "../js-lib/3dEngine/sceneGraph/gltf/splatting/SplattingNode.js"
import { SplattingTextures } from "../js-lib/3dEngine/sceneGraph/gltf/splatting/SplattingTextures.js"
import { getImage } from "../js-lib/utils/utils.js"
import { Vector3 } from "../js-lib/math/Vector3.js"
import { Vector2 } from "../js-lib/math/Vector2.js"
import { Zone0Node3D } from "./Zone0Node3D.js"

const renderer = new Renderer()
document.body.prepend(renderer.domElement)
renderer.camera.far = 1000

// Point Light
const lightParticleObject = new LightParticleObject()
lightParticleObject.count = 2
renderer.scene.objects.add(lightParticleObject)

const pointLight1 = new PointLight()
pointLight1.color.setRGB(1, 0, 0)
pointLight1.position.set(3, 0, 0)
pointLight1.intensity = 5
renderer.pointLights.add(pointLight1)
const pointLight2 = new PointLight()
pointLight2.color.setRGB(0, 0, 1)
pointLight2.position.set(-3, 0, 0)
renderer.pointLights.add(pointLight2)

const orbitControls = new OrbitControls(renderer.camera, renderer.domElement)

// Mesh Init

await Zone0Node3D.init()
const zone0 = new Zone0Node3D()
renderer.scene.addNode3D(zone0)

// Animation

loopRaf.listeners.add(() => {
    orbitControls.update()
    renderer.render(loopRaf.deltatimeSecond)
})
