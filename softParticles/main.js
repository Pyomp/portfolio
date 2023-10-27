'use strict'

import { OrbitControls } from "../js-lib/3dEngine/controls/OrbitControls.js"
import { Node3D } from "../js-lib/3dEngine/sceneGraph/Node3D.js"
import { Object3D } from "../js-lib/3dEngine/sceneGraph/Object3D.js"
import { Renderer } from "../js-lib/3dEngine/renderer/Renderer.js"
import { Uniform } from "../js-lib/3dEngine/sceneGraph/Uniform.js"
import { PointLight } from "../js-lib/3dEngine/sceneGraph/light/PointLight.js"
import { loopRaf } from "../js-lib/globals/loopRaf.js"
import { Color } from "../js-lib/math/Color.js"
import { OnlyColorPhongMaterial } from "./OnlyColorPhongMaterial.js"
import { KnotGeometry } from "../js-lib/3dEngine/geometries/KnotGeometry.js"
import { LightParticleObject } from "../js-lib/3dEngine/extras/LightParticleObject.js"
import { RendererSoftParticle } from "../js-lib/3dEngine/renderer/RendererSoftParticle.js"
import { styles } from "../js-lib/dom/styles/styles.js"
import { Vector3 } from "../js-lib/math/Vector3.js"
import { ParticleAnimation } from "../js-lib/3dEngine/renderer/modules/ParticlesRendererModules/ParticleAnimation.js"

const renderer = new RendererSoftParticle()
document.body.prepend(renderer.domElement)

const orbitControls = new OrbitControls(renderer.camera, renderer.domElement)

// Mesh Init

const geometry = new KnotGeometry()
const material = new OnlyColorPhongMaterial()
class KnotMesh extends Node3D {
    constructor() {
        super()
        this.objects.add(new Object3D({
            material,
            geometry,
            uniforms: {
                modelView: new Uniform(this.worldMatrix),
                specular: new Uniform(new Color(0xaaaaaa)),
                shininess: new Uniform(30),
                color: new Uniform(new Color(1, 1, 1))
            }
        }))
    }
}

const checkerSphereMesh = new KnotMesh()

renderer.scene.addNode3D(checkerSphereMesh)

// Animation
loopRaf.listeners.add(() => {
    orbitControls.update()
    renderer.updateParticles(loopRaf.deltatimeSecond)
    renderer.render()
})

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

const panel = document.createElement('div')
panel.style.position = 'fixed'
panel.style.top = '0'
panel.style.right = '0'

const resetParticleButton = document.createElement('button')
resetParticleButton.textContent = 'Reset Particle'
resetParticleButton.style.backgroundColor = '#444499'

const fireParticleAnimation = new ParticleAnimation()

fireParticleAnimation.addFrame({
    time: 0,
    color: new Color(0xff0000),
    alpha: 0,
    size: 0
})
fireParticleAnimation.addFrame({
    time: 1,
    color: new Color(0xff0000),
    alpha: 1,
    size: 10
})
fireParticleAnimation.addFrame({
    time: 2,
    color: new Color(0x222222),
    alpha: 0,
    size: 5
})

renderer.particles.setPattern(0, fireParticleAnimation)

const particleData = {
    position: new Vector3(),
    velocity: new Vector3(),
    type: 0
}
resetParticleButton.onclick = () => {
    for (let i = 0; i < 1000; i++) {
        particleData.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
        particleData.velocity.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
        renderer.particles.setParticle(i, particleData)
    }
}
panel.appendChild(resetParticleButton)

const loseContextButton = document.createElement('button')
loseContextButton.textContent = 'Lose Context'
loseContextButton.style.backgroundColor = '#444499'
loseContextButton.onclick = () => {
    renderer.loseContext()
}
panel.appendChild(loseContextButton)

document.body.appendChild(panel)

setTimeout(() => {
    const pointLight2 = new PointLight()
    pointLight2.color.setRGB(0, 1, 0)
    pointLight2.position.set(0, 3, 0)
    renderer.pointLights.add(pointLight2)

    lightParticleObject.count = 3
}, 2000)
