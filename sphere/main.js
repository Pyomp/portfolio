'use strict'

import { styles } from "../js-lib/dom/styles/styles.js"
import { OrbitControls } from "../js-lib/3dEngine/controls/OrbitControls.js"
import { PhongMaterial } from "../js-lib/3dEngine/materials/PhongMaterial.js"
import { Node3D } from "../js-lib/3dEngine/sceneGraph/Node3D.js"
import { Object3D } from "../js-lib/3dEngine/sceneGraph/Object3D.js"
import { Renderer } from "../js-lib/3dEngine/renderer/Renderer.js"
import { Uniform } from "../js-lib/3dEngine/sceneGraph/Uniform.js"
import { PointLight } from "../js-lib/3dEngine/sceneGraph/light/PointLight.js"
import { Spherical } from "../js-lib/math/Spherical.js"
import { loopRaf } from "../js-lib/globals/loopRaf.js"
import { SphereGeometry } from "../js-lib/3dEngine/geometries/SphereGeometry.js"
import { Color } from "../js-lib/math/Color.js"
import { Texture } from "../js-lib/3dEngine/sceneGraph/Texture.js"
import { HTMLRange } from "./HTMLRange.js"
import { Geometry } from "../js-lib/3dEngine/sceneGraph/Geometry.js"
import { Material } from "../js-lib/3dEngine/sceneGraph/Material.js"
import { createSparkleCanvas } from "../js-lib/3dEngine/textures/sparkle.js"

const renderer = new Renderer()
document.body.prepend(renderer.domElement)

const orbitControls = new OrbitControls(renderer.camera, renderer.domElement)

// Mesh Init

const geometry = new SphereGeometry()
const material = new PhongMaterial()
const map = new Texture({
    minFilter: 'NEAREST',
    magFilter: 'NEAREST',
    internalformat: 'LUMINANCE',
    format: 'LUMINANCE',
    type: 'UNSIGNED_BYTE',
    width: 4,
    height: 4,
    data: new Uint8Array([
        192, 128, 192, 128,
        128, 192, 128, 192,
        192, 128, 192, 128,
        128, 192, 128, 192,
    ])
})

class CheckerSphereMesh extends Node3D {
    #checkerSphereObject = new Object3D({
        material,
        geometry,
        uniforms: {
            modelView: new Uniform(this.worldMatrix),
            specular: new Uniform(new Color(0xaaaaaa)),
            shininess: new Uniform(30)
        },
        textures: {
            map
        }
    })

    /** @param {number} value */
    set shininess(value) {
        this.#checkerSphereObject.uniforms.shininess.data = value
        this.#checkerSphereObject.uniforms.shininess.needsUpdate = true
    }

    constructor() {
        super()
        this.objects.add(this.#checkerSphereObject)
    }
}

const checkerSphereMesh = new CheckerSphereMesh()

renderer.scene.addNode3D(checkerSphereMesh)

// Animation

loopRaf.listeners.add(() => {
    orbitControls.update()

    for (const light of pointLightsMoving) {
        light.update(loopRaf.deltatimeSecond)
    }

    renderer.render()
})

// Point Light

const pointLightsMoving = []

class PointLightMoving extends PointLight {
    #spherical = new Spherical(2, Math.PI * 2 * Math.random(), Math.PI * 2 * Math.random())

    intensity = 0.5
    color = new Color(Math.random(), Math.random(), Math.random())

    update(dt) {
        this.#spherical.phi += dt / 5
        this.#spherical.theta += dt / 10

        this.position.setFromSpherical(this.#spherical)
        this.needsUpdate = true
    }
}

function addPointLight() {
    const pointLight = new PointLightMoving()
    pointLightsMoving.push(pointLight)
    renderer.pointLights.add(pointLight)

    lightParticle.geometry.count = renderer.pointLights.size
    renderer.scene.objects.add(lightParticle)
}

function removePointLight() {
    const pointLight = pointLightsMoving.pop()
    renderer.pointLights.delete(pointLight)

    lightParticle.geometry.count = renderer.pointLights.size
    if (renderer.pointLights.size === 0) {
        renderer.scene.objects.delete(lightParticle)
    }
}

const lightParticle = new Object3D({
    drawMode: 'POINTS',
    blending: true,
    depthWrite: false,
    geometry: new Geometry(0),
    material: new Material({
        vertexShader: (pointLightCount) =>
            `#version 300 es
            precision highp float;
        
            uniform cameraUbo {
                mat4 projectionViewMatrix;
                vec3 cameraPosition;
            };

            struct PointLight {
                vec3 position;
                float intensity;
                vec3 color;                    
            };               
        
            layout(std140) uniform pointLightsUBO {
                PointLight pointLights[${pointLightCount}];
            };
            
            out vec4 v_color;

            void main() {
                PointLight pointLight = pointLights[gl_VertexID];
                
                gl_Position = projectionViewMatrix * vec4(pointLight.position, 1.0);
                gl_PointSize = 300. / gl_Position.z;
                v_color = vec4(pointLight.color, pointLight.intensity);
            }`,
        fragmentShader: () =>
            `#version 300 es
            precision highp float;

            uniform sampler2D map;

            in vec4 v_color;
            
            out vec4 outColor;

            void main() {
                outColor = texture(map, gl_PointCoord.xy) * v_color;
            }`,
        textures: {
            map: new Texture({ data: createSparkleCanvas() })
        }
    })
})

// HTML

const panel = document.createElement('div')
document.body.appendChild(panel)
panel.style.position = 'fixed'
panel.style.top = '0'
panel.style.right = '0'

const lightLabel = new HTMLRange({
    title: 'Light Count',
    min: 0,
    max: 20,
    step: 1,
    value: 0
})
lightLabel.oninput = (value) => {
    while (renderer.pointLights.size < value) addPointLight()
    while (renderer.pointLights.size > value) removePointLight()
}

const shininessLabel = new HTMLRange({
    title: 'Shininess',
    min: 1,
    max: 100,
    value: 30
})
shininessLabel.oninput = (value) => {
    checkerSphereMesh.shininess = value
}

const finalizationRegistry = new FinalizationRegistry(() => {
    console.log('gl context free')
})

const loseContextButton = document.createElement('button')
loseContextButton.textContent = 'WebGL lose context'
loseContextButton.style.backgroundColor = '#444499'
loseContextButton.onclick = () => {
    finalizationRegistry.register(renderer.glContext.gl)
    renderer.loseContext()
}

panel.append(shininessLabel.element, lightLabel.element, loseContextButton)
