'use strict'

import { OrbitControls } from "../js-lib/3dEngine/controls/OrbitControls.js"
import { PhongProgram } from "../js-lib/3dEngine/programs/PhongProgram.js"
import { GlSplattingProgram } from "../js-lib/3dEngine/programs/SplattingProgram.js"
import { AmbientLight } from "../js-lib/3dEngine/sceneGraph/AmbientLight.js"
import { PointLight } from "../js-lib/3dEngine/sceneGraph/PointLight.js"
import { LightParticleObject } from "../js-lib/3dEngine/sceneGraph/objects/LightParticleObject.js"
import { GlRenderer } from "../js-lib/3dEngine/webgl/glRenderer/GlRenderer.js"
import "../js-lib/dom/styles/styles.js"
import { Color } from "../js-lib/math/Color.js"
import { Vector3 } from "../js-lib/math/Vector3.js"
import { LoopRaf } from "../js-lib/utils/LoopRaf.js"
import { Zone0 } from "./Zone0.js"

const loopRaf = new LoopRaf()

const renderer = new GlRenderer()
document.body.prepend(renderer.htmlElement)
renderer.camera.far = 1000

const orbitControls = new OrbitControls(renderer.camera, renderer.htmlElement)

const splattingProgram = new GlSplattingProgram(renderer)

const zone = new Zone0(splattingProgram)
await zone.init()

renderer.scene.addNode3D(zone.node3D)

const ambientLight = new AmbientLight(new Color(0.5, 0.5, 0.5))
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

// Animation

loopRaf.setUpdate(() => {
    orbitControls.update()
    renderer.render(loopRaf.deltatimeSecond)
})
