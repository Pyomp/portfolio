'use strict'

import "../../js-lib/dom/styles/styles.js"
import { OrbitControls } from "../../js-lib/3dEngine/controls/OrbitControls.js"
import { createSparkleCanvas } from "../../js-lib/3dEngine/textures/sparkle.js"
import { GlTexture } from "../../js-lib/3dEngine/webgl/glDescriptors/GlTexture.js"
import { GlRenderer } from "../../js-lib/3dEngine/webgl/glRenderer/GlRenderer.js"
import { BulBall } from "../../js-lib/assets/bul/BulBall.js"
import { BasicProgram } from "../../js-lib/3dEngine/programs/BasicProgram.js"
import { loopRaf } from "../../js-lib/utils/loopRaf.js"

const renderer = new GlRenderer()
document.body.prepend(renderer.htmlElement)

const orbitControls = new OrbitControls(renderer.camera, renderer.htmlElement)

const sparkleTexture = new GlTexture({ data: createSparkleCanvas() })
const basicProgram = new BasicProgram()
await BulBall.init(sparkleTexture, basicProgram)
const bulNode = new BulBall()

renderer.scene.addNode3D(bulNode)

loopRaf.updates.add(() => {
    orbitControls.update()
    renderer.render()
    bulNode.update()
})
