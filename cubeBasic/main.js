'use strict'

import { OrbitControls } from "../js-lib/3dEngine/controls/OrbitControls.js"
import { CubeGeometry } from "../js-lib/3dEngine/geometries/CubeGeometry.js"
import { basicProgram } from "../js-lib/3dEngine/programs/basicProgram.js"
import { Node3D } from "../js-lib/3dEngine/sceneGraph/Node3D.js"
import { GlGradientTexture } from "../js-lib/3dEngine/textures/GradientTexture.js"
import { GlObjectData } from "../js-lib/3dEngine/webgl/glDescriptors/GlObjectData.js"
import { GlVaoData } from "../js-lib/3dEngine/webgl/glDescriptors/GlVaoData.js"
import { GlRenderer } from "../js-lib/3dEngine/webgl/glRenderer/GlRenderer.js"
import { AnimationFramePlayer } from "../js-lib/dom/AnimationFramePlayer.js"
import { Color } from "../js-lib/math/Color.js"

const renderer = new GlRenderer()
document.body.prepend(renderer.htmlElement)
renderer.camera.far = 1000

const orbitControls = new OrbitControls(renderer.camera, renderer.htmlElement)

const cubeGeometry = new CubeGeometry()
const cubeNode = new Node3D()
const cubeGlObject = new GlObjectData({
    glProgramData: basicProgram,
    glVaoData: new GlVaoData(
        cubeGeometry.attributesData,
        cubeGeometry.indicesUintArray
    ),
    uniforms: {
        modelMatrix: cubeNode.worldMatrix
    },
    glTexturesData: {
        baseColorTexture: new GlGradientTexture([new Color(1, 0, 0), new Color(0, 0, 1)])
    }
})

cubeNode.objects.add(cubeGlObject)

renderer.scene.addNode3D(cubeNode)

const animationFramePlayer = new AnimationFramePlayer(() => {
    orbitControls.update()
    renderer.render(animationFramePlayer.deltatimeSecond)
})

animationFramePlayer.play()
