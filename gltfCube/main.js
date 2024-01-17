'use strict'

import { OrbitControls } from "../js-lib/3dEngine/controls/OrbitControls.js"
import { loadGLTF } from "../js-lib/3dEngine/loaders/gltfLoader.js"
import { basicProgram } from "../js-lib/3dEngine/programs/basicProgram.js"
import { GltfManager } from "../js-lib/3dEngine/sceneGraph/gltf/GltfManager.js"
import { GlRenderer } from "../js-lib/3dEngine/webgl/glRenderer/GlRenderer.js"
import { AnimationFramePlayer } from "../js-lib/dom/AnimationFramePlayer.js"

const renderer = new GlRenderer()
document.body.prepend(renderer.htmlElement)
renderer.camera.far = 1000

const orbitControls = new OrbitControls(renderer.camera, renderer.htmlElement)

const gltfManager = new GltfManager()

const gltfNodes = await loadGLTF(new URL('./cube.glb', import.meta.url))

const node3D = gltfManager.getNode3D(gltfNodes['Cube'], basicProgram)

renderer.scene.addNode3D(node3D)

const animationFramePlayer = new AnimationFramePlayer(() => {
    orbitControls.update()
    renderer.render(animationFramePlayer.deltatimeSecond)
})

animationFramePlayer.play()
