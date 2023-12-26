'use strict'

import { styles } from "../js-lib/dom/styles/styles.js"
import { OrbitControls } from "../js-lib/3dEngine/controls/OrbitControls.js"
import { LightParticleObject } from "../js-lib/3dEngine/extras/LightParticleObject.js"
import { Renderer } from "../js-lib/3dEngine/renderer/Renderer.js"
import { PointLight } from "../js-lib/3dEngine/sceneGraph/light/PointLight.js"
import { loopRaf } from "../js-lib/globals/loopRaf.js"
import { SplattingMaterial } from "../js-lib/3dEngine/sceneGraph/materials/SplattingMaterial.js"
import { Texture } from "../js-lib/3dEngine/sceneGraph/Texture.js"
import { getImage } from "../js-lib/utils/utils.js"

const renderer = new Renderer()
document.body.prepend(renderer.htmlElement)
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

const orbitControls = new OrbitControls(renderer.camera, renderer.htmlElement)

// Mesh Init
const background = await Promise.all([
    getImage(new URL('./MilkyWay/dark-s_px.jpg', import.meta.url).href),
    getImage(new URL('./MilkyWay/dark-s_nx.jpg', import.meta.url).href),
    getImage(new URL('./MilkyWay/dark-s_py.jpg', import.meta.url).href),
    getImage(new URL('./MilkyWay/dark-s_ny.jpg', import.meta.url).href),
    getImage(new URL('./MilkyWay/dark-s_pz.jpg', import.meta.url).href),
    getImage(new URL('./MilkyWay/dark-s_nz.jpg', import.meta.url).href),
])

renderer.skyBoxRenderer.images = background

// Animation

loopRaf.listeners.add(() => {
    orbitControls.update()
    renderer.render(loopRaf.deltatimeSecond)
})
