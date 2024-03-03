'use strict'

import "../js-lib/dom/styles/styles.js"
import { OrbitControls } from "../js-lib/3dEngine/controls/OrbitControls.js"
import { Node3D } from "../js-lib/3dEngine/sceneGraph/Node3D.js"
import { Color } from "../js-lib/math/Color.js"
import { KnotGlVoa as KnotGlVao } from "../js-lib/3dEngine/geometries/KnotGlVao.js"
import { FireParticleSystem } from "./FireParticleSystem.js"
import { GlObject } from "../js-lib/3dEngine/webgl/glDescriptors/GlObject.js"
import { PhongProgram } from "../js-lib/3dEngine/programs/PhongProgram.js"
import { GlRenderer } from "../js-lib/3dEngine/webgl/glRenderer/GlRenderer.js"
import { LightParticleObject } from "../js-lib/3dEngine/sceneGraph/objects/LightParticleObject.js"
import { PointLight } from "../js-lib/3dEngine/sceneGraph/PointLight.js"
import { LoopRaf } from "../js-lib/utils/LoopRaf.js"
import { Vector3 } from "../js-lib/math/Vector3.js"
import { AmbientLight } from "../js-lib/3dEngine/sceneGraph/AmbientLight.js"
import { GLSL_COMMON } from "../js-lib/3dEngine/programs/chunks/glslCommon.js"

const loopRaf = new LoopRaf()

const renderer = new GlRenderer()
document.body.prepend(renderer.htmlElement)

const orbitControls = new OrbitControls(renderer.camera, renderer.htmlElement)

// Mesh Init
const knotVao = new KnotGlVao()
const phongProgram = new PhongProgram({ renderer, isShininessEnable: false, isSkinned: false })
class KnotMesh extends Node3D {
    constructor() {
        super()
        this.objects.add(new GlObject({
            glProgram: phongProgram,
            glVao: knotVao,
            uniforms: {
                [GLSL_COMMON.worldMatrix]: this.worldMatrix,
                [GLSL_COMMON.baseColor]: new Color(1, 1, 1)
            }
        }))
    }
}

const checkerSphereMesh = new KnotMesh()
renderer.scene.addNode3D(checkerSphereMesh)

const ambientLight = new AmbientLight()
renderer.scene.objects.add(ambientLight)

// Point Light
const lightParticleObject = new LightParticleObject(renderer)
renderer.scene.objects.add(lightParticleObject)

const pointLight1 = new PointLight({
    intensity: 1,
    color: new Color().setRGB(1, 0, 0),
    localPosition: new Vector3(3, 0, 0),
})
renderer.scene.objects.add(pointLight1)

const pointLight2 = new PointLight({
    intensity: 1,
    color: new Color().setRGB(0, 0, 1),
    localPosition: new Vector3(-3, 0, 0),
})
renderer.scene.objects.add(pointLight2)

// Particle
let fireParticleSystem = new FireParticleSystem()
const fireUpdate = fireParticleSystem.getUpdate(renderer.scene, new Vector3(0, -2, 0))
let isFireRunning = true

// Animation
loopRaf.setUpdate(() => {
    orbitControls.update()
    renderer.render(loopRaf.deltatimeSecond)
    if (isFireRunning) {
        fireUpdate(loopRaf.deltatimeSecond)
    }
})

// panel
const panel = document.createElement('div')
panel.style.position = 'fixed'
panel.style.top = '0'
panel.style.right = '0'

const startFireButton = document.createElement('button')
startFireButton.textContent = 'Start Fire'
startFireButton.style.backgroundColor = '#444499'
startFireButton.onclick = () => { isFireRunning = true }
panel.appendChild(startFireButton)

const stopFireButton = document.createElement('button')
stopFireButton.textContent = 'Stop Fire'
stopFireButton.style.backgroundColor = '#444499'
stopFireButton.onclick = () => { isFireRunning = false }
panel.appendChild(stopFireButton)

const loseContextButton = document.createElement('button')
loseContextButton.textContent = 'Lose Context'
loseContextButton.style.backgroundColor = '#444499'
loseContextButton.onclick = () => {
    renderer.loseContext()
}
panel.appendChild(loseContextButton)

document.body.appendChild(panel)

setTimeout(() => {
    const pointLight = new PointLight({
        intensity: 1,
        color: new Color().setRGB(0, 1, 0),
        localPosition: new Vector3(0, 3, 0),
    })
    renderer.scene.objects.add(pointLight)
}, 2000)
