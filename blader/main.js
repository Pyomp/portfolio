'use strict'

import { styles } from "../js-lib/dom/styles/styles.js"
import { OrbitControls } from "../js-lib/3dEngine/controls/OrbitControls.js"
import { LightParticleObject } from "../js-lib/3dEngine/extras/LightParticleObject.js"
import { loadGLTF } from "../js-lib/3dEngine/loaders/gltfLoader.js"
import { Renderer } from "../js-lib/3dEngine/renderer/Renderer.js"
import { SkinnedNode } from "../js-lib/3dEngine/sceneGraph/gltf/skinned/SkinnedNode.js"
import { PointLight } from "../js-lib/3dEngine/sceneGraph/light/PointLight.js"
import { loopRaf } from "../js-lib/globals/loopRaf.js"
import { Animation } from "../js-lib/3dEngine/sceneGraph/gltf/skinned/animation/Animation.js"
import { SkinnedPhongMaterial } from "../js-lib/3dEngine/sceneGraph/gltf/skinned/SkinnedPhongMaterial.js"
import { BasicStaticMaterial } from "../js-lib/3dEngine/sceneGraph/materials/BasicStaticGltfMaterial.js"

const renderer = new Renderer()
document.body.prepend(renderer.htmlElement)

// Point Light
const lightParticleObject = new LightParticleObject()
lightParticleObject.count = 2
renderer.scene.objects.add(lightParticleObject)

const pointLight1 = new PointLight()
pointLight1.color.setRGB(1, 0.7, 0.7)
pointLight1.position.set(3, 0, 0)
renderer.pointLights.add(pointLight1)
const pointLight2 = new PointLight()
pointLight2.color.setRGB(0, 0, 1)
pointLight2.position.set(-3, 0, 0)
renderer.pointLights.add(pointLight2)

const orbitControls = new OrbitControls(renderer.camera, renderer.htmlElement)

// Mesh Init

const gltfNodes = await loadGLTF(new URL('./blader.glb', import.meta.url))

const blader = gltfNodes['blader']

const textureImage = new Image(512, 512)
textureImage.src = new URL('./blader.svg', import.meta.url).href
await new Promise((resolve) => { textureImage.onload = resolve })

for (const primitive of blader.mesh.primitives) {
    if (primitive.material.pbrMetallicRoughness.baseColorTexture) {
        primitive.material.pbrMetallicRoughness.baseColorTexture.source.image = textureImage
    }
}

const material = new SkinnedPhongMaterial()
// const material = new BasicStaticMaterial()
const animation = new Animation(blader.skin)
const skinnedNode = new SkinnedNode(animation)
for (const primitive of blader.mesh.primitives) {
    skinnedNode.objects.add(material.createObjectFromGltf(skinnedNode, primitive))
}

skinnedNode.mixer.play('idle_pingpong')
renderer.scene.addNode3D(skinnedNode)

loopRaf.listeners.add(() => {
    orbitControls.update()
    renderer.render(loopRaf.deltatimeSecond)
})
