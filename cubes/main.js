'use strict'

import { Matrix4 } from '../js-lib/math/Matrix4.js'
import { GlContext } from '../js-lib/webgl/GlContext.js'
import { GlProgram } from '../js-lib/webgl/GlProgram.js'
import { GlVao } from '../js-lib/webgl/GlVao.js'
import { GlTexture } from '../js-lib/webgl/GlTexture.js'
import { GlState } from '../js-lib/webgl/GlState.js'
import { Camera } from '../js-lib/math/Camera.js'
import { Vector3 } from '../js-lib/math/Vector3.js'

const glContext = new GlContext()
document.body.appendChild(glContext.canvas)

// make a canvas with text in the center

const camera = new Camera({})
camera.position.set(1, 5, 8)

camera.update()

glContext.resizeListeners.add((width, height) => {
    camera.aspect = width / height
})

const glState = new GlState(glContext.gl)

glState.setClearColor(0.7, 0.7, 1, 1)

// above this line is initialization code
// --------------------------------------
// below is rendering code.

const lightDir = new Vector3(1, 5, 8).normalize()

function render() {
    camera.update()

    glState.clear()
    // glState.depthTest = false
    // glState.depthWrite = false
    glState.cullFace = true


    // draw center cube
    const matrix4 = new Matrix4()
        .identity()
        .makeTranslation(0, 0, 0)

    glProgram.uniformUpdate['modelView'](matrix4)


    // glContext.gl.drawArrays(WebGL2RenderingContext.TRIANGLES, 0, 24)

    glContext.gl.drawElements(
        WebGL2RenderingContext.TRIANGLES,
        cubeVertexIndices.length,                // num vertices to process
        WebGL2RenderingContext.UNSIGNED_SHORT, // type of indices
        0,                 // offset on bytes to indices
    )
}

function loop() {
    render()
    requestAnimationFrame(loop)
}
loop()

// draw left cube

// matrix4
//     .identity()
//     .makeTranslation(-3, 0, -4)

// gl.uniformMatrix4fv(modelViewLoc, false, matrix4.elements)


// gl.drawElements(
//     gl.TRIANGLES,
//     36,                // num vertices to process
//     gl.UNSIGNED_SHORT, // type of indices
//     0,                 // offset on bytes to indices
// )

// // draw right cube

// matrix4
//     .identity()
//     .makeTranslation(3, 0, -4)

// gl.uniformMatrix4fv(modelViewLoc, false, matrix4.elements)

// gl.drawElements(
//     gl.TRIANGLES,
//     36,                // num vertices to process
//     gl.UNSIGNED_SHORT, // type of indices
//     0,                 // offset on bytes to indices
// )
