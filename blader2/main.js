'use strict'

import { styles } from "../js-lib/dom/styles/styles.js"
import { LightParticleObject } from "../js-lib/3dEngine/extras/LightParticleObject.js"
import { loadGLTF } from "../js-lib/3dEngine/loaders/gltfLoader.js"
import { Renderer } from "../js-lib/3dEngine/renderer/Renderer.js"
import { SkinnedNode } from "../js-lib/3dEngine/sceneGraph/gltf/skinned/SkinnedNode.js"
import { PointLight } from "../js-lib/3dEngine/sceneGraph/light/PointLight.js"
import { loopRaf } from "../js-lib/globals/loopRaf.js"
import { Vector3, _up } from "../js-lib/math/Vector3.js"
import { Input } from "./Input.js"
import { PlayerNode } from "./PlayerNode.js"
import { Animation } from "../js-lib/3dEngine/sceneGraph/gltf/skinned/animation/Animation.js"
import { SkillDirectionButton } from "../js-lib/dom/components/SkillDirectionButton.js"
import { FireBall } from "./skills/FireBall.js"
import { Spherical } from "../js-lib/math/Spherical.js"

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
const bladerAnimation = new Animation(gltfNodes['blader'].skin)
const playerNode = new PlayerNode(gltfNodes['blader'], bladerAnimation)

renderer.scene.addNode3D(playerNode)

const input = new Input(renderer.domElement, renderer.camera)
input.setTargetCamera(playerNode.position)


const skillPanel = document.createElement('div')
skillPanel.style.position = 'absolute'
skillPanel.style.bottom = '50px'
skillPanel.style.right = '50px'
document.body.appendChild(skillPanel)
const skillDirectionButton = new SkillDirectionButton({
    parent: skillPanel,
    directionColor: '#ff000055'
})

skillDirectionButton.setImage(new URL('./skills/comboAttack.png', import.meta.url))

const fireBallDirection = new Vector3()
const fireBalls = new Set()
setInterval(() => {
    if (skillDirectionButton.ongoing) {

        const theta = -input.thirdControls.spherical.theta + skillDirectionButton.theta

        fireBallDirection.set(Math.cos(theta), 0, Math.sin(theta),)

        const fireBall = new FireBall(playerNode.position, fireBallDirection)
        fireBalls.add(fireBall)
        renderer.particles.particleSystems.add(fireBall)
    }
}, 1000)

loopRaf.listeners.add(() => {
    input.update()

    skillDirectionButton.update()

    for (const fireBall of fireBalls) {
        fireBall.update(loopRaf.deltatimeSecond)
    }

    playerNode.update(input.theta)

    renderer.render(loopRaf.deltatimeSecond)
})
