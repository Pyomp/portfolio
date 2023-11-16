'use strict'

import { styles } from "../js-lib/dom/styles/styles.js"
import { OrbitControls } from "../js-lib/3dEngine/controls/OrbitControls.js"
import { LightParticleObject } from "../js-lib/3dEngine/extras/LightParticleObject.js"
import { loadGLTF } from "../js-lib/3dEngine/loaders/gltfLoader.js"
import { Renderer } from "../js-lib/3dEngine/renderer/Renderer.js"
import { SkinnedNode } from "../js-lib/3dEngine/sceneGraph/gltf/skinned/SkinnedNode.js"
import { PointLight } from "../js-lib/3dEngine/sceneGraph/light/PointLight.js"
import { loopRaf } from "../js-lib/globals/loopRaf.js"
import { KeyboardMouseControls } from "../js-lib/controls/KeyboardMouseControls.js"
import { _up } from "../js-lib/math/Vector3.js"
import { getMoveFromKey } from "../js-lib/utils/controls.js"
import { HtmlPad } from "../js-lib/controls/HtmlPad/HtmlPad.js"
import { Input } from "./Input.js"

const renderer = new Renderer()
document.body.prepend(renderer.domElement)

// Point Light
const lightParticleObject = new LightParticleObject()
lightParticleObject.count = 2
renderer.scene.objects.add(lightParticleObject)

const pointLight1 = new PointLight()
pointLight1.color.setRGB(1, 0.5, 0.5)
pointLight1.position.set(3, 0, 0)
renderer.pointLights.add(pointLight1)
const pointLight2 = new PointLight()
pointLight2.color.setRGB(0.5, 0.5, 1)
pointLight2.position.set(-3, 0, 0)
renderer.pointLights.add(pointLight2)

// Mesh Init

const gltfNodes = await loadGLTF(new URL('./blader.glb', import.meta.url))

const blader = gltfNodes['blader']

const skinnedNode = new SkinnedNode(blader)
// skinnedNode.animation.play('idle_pingpong')
renderer.scene.addNode3D(skinnedNode)

const input = new Input(renderer.domElement, renderer.camera)
input.setTargetCamera(skinnedNode.position)
input.thirdControls.offset_y
// Animation
loopRaf.listeners.add(() => {
    orbitControls.update()

    skinnedNode.quaternion.setFromAxisAngle(_up,)

    renderer.render(loopRaf.deltatimeSecond)
})

// Keyboard init



const UP = 0
const DOWN = 1
const LEFT = 2
const RIGHT = 3
