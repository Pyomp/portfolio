'use strict'

import { OrbitControls } from "../js-lib/3dEngine/controls/OrbitControls.js"
import { Node3D } from "../js-lib/3dEngine/sceneGraph/Node3D.js"
import { Object3D } from "../js-lib/3dEngine/sceneGraph/Object3D.js"
import { Renderer } from "../js-lib/3dEngine/renderer/Renderer.js"
import { Uniform } from "../js-lib/3dEngine/sceneGraph/Uniform.js"
import { PointLight } from "../js-lib/3dEngine/sceneGraph/light/PointLight.js"
import { loopRaf } from "../js-lib/globals/loopRaf.js"
import { Color } from "../js-lib/math/Color.js"
import { OnlyColorPhongMaterial } from "./OnlyColorPhongMaterial.js"
import { KnotGeometry } from "../js-lib/3dEngine/geometries/KnotGeometry.js"
import { LightParticleObject } from "../js-lib/3dEngine/extras/LightParticleObject.js"
import { GlProgram } from "../js-lib/3dEngine/webgl/GlProgram.js"

const renderer = new Renderer()
document.body.prepend(renderer.domElement)

const orbitControls = new OrbitControls(renderer.camera, renderer.domElement)

// Mesh Init

const geometry = new KnotGeometry()
const material = new OnlyColorPhongMaterial()
class KnotMesh extends Node3D {
    constructor() {
        super()
        this.objects.add(new Object3D({
            material,
            geometry,
            uniforms: {
                modelView: new Uniform(this.worldMatrix),
                specular: new Uniform(new Color(0xaaaaaa)),
                shininess: new Uniform(30),
                color: new Uniform(new Color(1, 1, 1))
            }
        }))
    }
}

const checkerSphereMesh = new KnotMesh()

renderer.scene.addNode3D(checkerSphereMesh)

// Animation
loopRaf.listeners.add(() => {
    orbitControls.update()
    renderer.render()
})

// Point Light
const lightParticleObject = new LightParticleObject()
lightParticleObject.count = 2
renderer.scene.objects.add(lightParticleObject)

const pointLight1 = new PointLight()
pointLight1.color.setRGB(1, 0, 0)
pointLight1.position.set(3, 0, 0)
renderer.pointLights.add(pointLight1)
const pointLight2 = new PointLight()
pointLight2.color.setRGB(0, 0, 1)
pointLight2.position.set(-3, 0, 0)
renderer.pointLights.add(pointLight2)

//

// const canvas = document.createElement('canvas')
// const gl = canvas.getContext('webgl2')
// const program = new GlProgram(gl,
//     `#version 300 es
//     uniform int numPoints;

//     out vec2 position;

//     #define PI radians(180.0)

//     void main() {
//         float u = float(gl_VertexID) / float(numPoints);
//         float a = u * PI * 2.0;
//         position = vec2(cos(a), sin(a)) * 0.8;
//     }
//     `,
//     `#version 300 es
//     void main() {
//     discard;
//     }`
// )
// gl.useProgram(program.program)

// gl.transformFeedbackVaryings(program.program, ['position'], gl.SEPARATE_ATTRIBS)

// const numPoints = 1

// const positionBuffer = gl.createBuffer()
// gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
// gl.bufferData(gl.ARRAY_BUFFER, numPoints * 2 * 4, gl.DYNAMIC_DRAW)

// // setup a transform feedback object to write to
// // the position and color buffers
// const tf = gl.createTransformFeedback()
// gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, tf)
// gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, positionBuffer)
// gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null)




// // no need to call the fragment shader
// gl.enable(gl.RASTERIZER_DISCARD)

// // unbind the buffers so we don't get errors.
// gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, null)
// gl.bindBuffer(gl.ARRAY_BUFFER, null)

// gl.useProgram(program.program);


// // generate numPoints of positions and colors
// // into the buffers
// gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, tf)
// gl.beginTransformFeedback(gl.POINTS)
// program.uniformUpdate['numPoints'](numPoints)
// gl.drawArrays(gl.POINTS, 0, numPoints)
// gl.endTransformFeedback()
// gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null)

// // turn on using fragment shaders again
// gl.disable(gl.RASTERIZER_DISCARD)

// // gl.flush()

// const a =new Float32Array(2)
// gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
// gl.getBufferSubData(gl.ARRAY_BUFFER, 0, a)
// console.log(a)



const canvas = document.createElement('canvas')
const gl = canvas.getContext('webgl2')

const program = new GlProgram(
    gl,
    `#version 300 es
    in vec2 in_position;

    uniform int numPoints;
    out vec2 position;

    #define PI radians(180.0)

    void main() {
        float u = float(gl_VertexID) / float(numPoints);
        float a = u * PI * 2.0;
        position = in_position + vec2(cos(a), sin(a)) * 0.8;
    }
    `, `#version 300 es
    void main() {
      discard;
    }
    `,
    { outVaryings: ['position'] }
)

const genProg = program.program

const numPoints = 24

const positionBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
gl.bufferData(gl.ARRAY_BUFFER, numPoints * 2 * 4, gl.DYNAMIC_DRAW)

// setup a transform feedback object to write to
// the position and color buffers
const tf = gl.createTransformFeedback()
gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, tf)
gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, positionBuffer)
gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null)

// above this line is initialization code
// --------------------------------------
// below is rendering code.

// --------------------------------------
// First compute points into buffers

// no need to call the fragment shader
gl.enable(gl.RASTERIZER_DISCARD)

// unbind the buffers so we don't get errors.
gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, null)
gl.bindBuffer(gl.ARRAY_BUFFER, null)

gl.useProgram(genProg)

// generate numPoints of positions and colors
// into the buffers
gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, tf)
gl.beginTransformFeedback(gl.POINTS)

program.uniformUpdate['numPoints'](numPoints)

gl.drawArrays(gl.POINTS, 0, numPoints)
gl.endTransformFeedback()
gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null)

// turn on using fragment shaders again
gl.disable(gl.RASTERIZER_DISCARD)


const out = new Float32Array(numPoints * 2)
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
gl.getBufferSubData(gl.ARRAY_BUFFER, 0, out)
console.log(out)
