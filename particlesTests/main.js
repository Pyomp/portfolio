'use strict'

import { OrbitControls } from "../js-lib/3dEngine/controls/OrbitControls.js"
import { Renderer } from "../js-lib/3dEngine/renderer/Renderer.js"
import { Texture } from "../js-lib/3dEngine/sceneGraph/Texture.js"
import { createSparkleCanvas } from "../js-lib/3dEngine/textures/sparkle.js"
import { loopRaf } from "../js-lib/globals/loopRaf.js"
import { BulBall } from "./BulBall.js"
import { Bul } from "./BulParticles.js"

const renderer = new Renderer()
document.body.prepend(renderer.htmlElement)

const orbitControls = new OrbitControls(renderer.camera, renderer.htmlElement)

const sparkleTexture = new Texture({ data: createSparkleCanvas() })
const bul = new Bul(sparkleTexture)
renderer.particles.particleSystems.add(bul)

await BulBall.init()
const bulNode = new BulBall()
renderer.scene.addNode3D(bulNode)

// Animation
loopRaf.listeners.add(() => {
    orbitControls.update()
    renderer.render(loopRaf.deltatimeSecond)
    bul.update(loopRaf.deltatimeSecond)
    bulNode.update(loopRaf.deltatimeSecond)
})

