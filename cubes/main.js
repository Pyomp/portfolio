'use strict'

import { OrbitControls } from "../js-lib/3dEngine/controls/OrbitControls.js"
import { CubeGeometry } from "../js-lib/3dEngine/geometries/CubeGeometry.js"
import { FirstMaterial } from "../js-lib/3dEngine/materials/FirstMaterial.js"
import { Node3D } from "../js-lib/3dEngine/sceneGraph/Node3D.js"
import { Object3D } from "../js-lib/3dEngine/sceneGraph/Object3D.js"
import { Renderer } from "../js-lib/3dEngine/renderer/Renderer.js"
import { Uniform } from "../js-lib/3dEngine/sceneGraph/Uniform.js"
import { PointLight } from "../js-lib/3dEngine/sceneGraph/light/PointLight.js"
import { Spherical } from "../js-lib/math/Spherical.js"
import { loopRaf } from "../js-lib/globals/loopRaf.js"
import { SphereGeometry } from "../js-lib/3dEngine/geometries/SphereGeometry.js"

const renderer = new Renderer()
document.body.appendChild(renderer.domElement)

///////// Point light test
const pointLight = new PointLight()
pointLight.intensity = 1
pointLight.position.set(1, 5, 8).normalize()
const spherical = new Spherical()

function pointLightUpdate(dt) {
    spherical.phi += dt
    spherical.theta -= dt / 2

    pointLight.position.setFromSpherical(spherical)
    pointLight.needsUpdate = true
}

setTimeout(() => {
    renderer.pointLights.add(pointLight)
}, 1000)
/////////////////

window.addEventListener('keyup', (event) => {
    if (event.code === 'KeyQ') {
        renderer.loseContext()
    }
})

const orbitControls = new OrbitControls(renderer.camera, renderer.domElement)

const cubeGeometry = new SphereGeometry()
const node3d = new Node3D(renderer.scene)
const object3d = new Object3D({
    material: new FirstMaterial(),
    geometry: cubeGeometry,
    uniforms: { modelView: new Uniform(node3d.worldMatrix) }
})
node3d.objects.add(object3d)

// above this line is initialization code
// --------------------------------------
// below is rendering code.

loopRaf.listeners.add(() => {
    orbitControls.update()
    // object3d.material.uniforms.projection.needsUpdate = true

    pointLightUpdate(loopRaf.deltatimeSecond)

    renderer.render()
})


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
