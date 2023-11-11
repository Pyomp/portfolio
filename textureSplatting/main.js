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

const gltfNodes = await loadGLTF(new URL('./zone0/zone0.glb', import.meta.url))

const gltfNode = gltfNodes['terrainStart']

const [
    splattingImage,
    image1,
    normalImage1,
    image2,
    normalImage2,
    image3,
    normalImage3,
    image4,
    normalImage4
] = await Promise.all([
    getImage(new URL('./zone0/textureSplatting.png', import.meta.url).href),

    getImage(new URL('./zone0/textures/Grass001_1K-JPG/Grass001_1K_Color.jpg', import.meta.url).href),
    getImage(new URL('./zone0/textures/Grass001_1K-JPG/Grass001_1K_NormalGL.jpg', import.meta.url).href),

    getImage(new URL('./zone0/textures/Ground037_1K-JPG/Ground037_1K_Color.jpg', import.meta.url).href),
    getImage(new URL('./zone0/textures/Ground037_1K-JPG/Ground037_1K_NormalGL.jpg', import.meta.url).href),

    getImage(new URL('./zone0/textures/Ground031_1K-JPG/Ground031_1K_Color.jpg', import.meta.url).href),
    getImage(new URL('./zone0/textures/Ground031_1K-JPG/Ground031_1K_NormalGL.jpg', import.meta.url).href),

    getImage(new URL('./zone0/textures/Ground054_1K-JPG/Ground054_1K_Color.jpg', import.meta.url).href),
    getImage(new URL('./zone0/textures/Ground054_1K-JPG/Ground054_1K_NormalGL.jpg', import.meta.url).href),
])

const splattingTextures = new SplattingTextures({
    splattingImage,
    image1,
    normalImage1,
    map1Scale: new Vector2(100, 100),
    image2,
    normalImage2,
    map2Scale: new Vector2(100, 100),
    image3,
    normalImage3,
    map3Scale: new Vector2(100, 100),
    image4,
    normalImage4,
    map4Scale: new Vector2(100, 100),
})

const node = new SplattingNode(gltfNode, splattingTextures)
renderer.scene.addNode3D(node)

// Animation

loopRaf.listeners.add(() => {
    orbitControls.update()
    renderer.render(loopRaf.deltatimeSecond)
})
