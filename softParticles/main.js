'use strict'

import { styles } from "../js-lib/dom/styles/styles.js"
import { OrbitControls } from "../js-lib/3dEngine/controls/OrbitControls.js"
import { Node3D } from "../js-lib/3dEngine/sceneGraph/Node3D.js"
import { Object3D } from "../js-lib/3dEngine/sceneGraph/Object3D.js"
import { Uniform } from "../js-lib/3dEngine/sceneGraph/Uniform.js"
import { PointLight } from "../js-lib/3dEngine/sceneGraph/light/PointLight.js"
import { loopRaf } from "../js-lib/globals/loopRaf.js"
import { Color } from "../js-lib/math/Color.js"
import { OnlyColorPhongMaterial } from "./OnlyColorPhongMaterial.js"
import { KnotGeometry } from "../js-lib/3dEngine/geometries/KnotGeometry.js"
import { LightParticleObject } from "../js-lib/3dEngine/extras/LightParticleObject.js"
import { RendererSoftParticle } from "../js-lib/3dEngine/renderer/RendererSoftParticle.js"
import { Vector3 } from "../js-lib/math/Vector3.js"
import { FireParticleSystem } from "./FireParticleSystem.js"
import { Quaternion } from "../js-lib/math/Quaternion.js"
import { Matrix4 } from "../js-lib/math/Matrix4.js"

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
    renderer.render(loopRaf.deltatimeSecond)
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

const fireParticleSystem = new FireParticleSystem()
fireParticleSystem.position.y = -3
renderer.particles.particleSystems.add(fireParticleSystem)

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
