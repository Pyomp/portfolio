'use strict'

import { OrbitControls } from "../js-lib/3dEngine/controls/OrbitControls.js"
import { CubeGlVao } from "../js-lib/3dEngine/geometries/CubeGlVao.js"
import { loadGLTF } from "../js-lib/3dEngine/loaders/gltfLoader.js"
import { PhongProgram } from "../js-lib/3dEngine/programs/PhongProgram.js"
import { GLSL_COMMON } from "../js-lib/3dEngine/programs/chunks/glslCommon.js"
import { AmbientLight } from "../js-lib/3dEngine/sceneGraph/AmbientLight.js"
import { Node3D } from "../js-lib/3dEngine/sceneGraph/Node3D.js"
import { GltfNodeManager } from "../js-lib/3dEngine/sceneGraph/gltf/GltfNodeManager.js"
import { GlObject } from "../js-lib/3dEngine/webgl/glDescriptors/GlObject.js"
import { GlTexture } from "../js-lib/3dEngine/webgl/glDescriptors/GlTexture.js"
import { GlRenderer } from "../js-lib/3dEngine/webgl/glRenderer/GlRenderer.js"
import { AnimationFramePlayer } from "../js-lib/dom/AnimationFramePlayer.js"
import "../js-lib/dom/styles/styles.js"
import { Color } from "../js-lib/math/Color.js"

const renderer = new GlRenderer()
document.body.prepend(renderer.htmlElement)
renderer.camera.far = 1000

renderer.scene.objects.add(new AmbientLight(new Color()))

const orbitControls = new OrbitControls(renderer.camera, renderer.htmlElement)

const phongProgram = new PhongProgram({ renderer, isShininessEnable: false, isSkinned: false })
const gltfNodes = await loadGLTF(new URL('./cube.glb', import.meta.url))
renderer.scene.addNode3D(GltfNodeManager.getNode3D({
    gltfNode: gltfNodes['Cube'],
    glProgramData: phongProgram,
}))

const animationFramePlayer = new AnimationFramePlayer(() => {
    orbitControls.update()
    renderer.render(animationFramePlayer.deltatimeSecond)
})

animationFramePlayer.play()
