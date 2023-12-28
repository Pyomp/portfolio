import { ParticleGeometry } from "../js-lib/3dEngine/sceneGraph/particle/ParticleGeometry.js"
import { ParticleKeyframe } from "../js-lib/3dEngine/sceneGraph/particle/ParticleKeyframe.js"
import { ParticleSystem } from "../js-lib/3dEngine/sceneGraph/particle/ParticleSystem.js"
import { Color } from "../js-lib/math/Color.js"
import { Quaternion } from "../js-lib/math/Quaternion.js"
import { Vector3, _up } from "../js-lib/math/Vector3.js"

const randomVector3_1 = new Vector3(1, 1, 1).normalize()
const randomVector3_2 = new Vector3(1, -1, -1).normalize()
const quaternion_1 = new Quaternion()
const quaternion_2 = new Quaternion()

export class Bul extends ParticleSystem {
    constructor(
        /** @type {Texture} */ sparkleTexture
    ) {
        const COUNT = 500

        super({
            particleKeyframes: [
                new ParticleKeyframe({
                    time: 0,
                    color: new Color(0.5, .5, 1, 0.3),
                    size: 5
                }),
                new ParticleKeyframe({
                    time: 3,
                    color: new Color(0, 0, 0.7, 0),
                    size: 0
                }),
            ],
            geometry: new ParticleGeometry(COUNT),
            map: sparkleTexture
        })
        const quart = COUNT / 4

        const R = 0.5
        const positions = [
            new Vector3(R, R, R),
            new Vector3(-R, -R, R),
            new Vector3(-R, R, -R),
            new Vector3(R, -R, -R),
        ]

        for (let i = 0; i < COUNT; i++) {
            const offset3 = i * 3
            positions[i % 4].toArray(this.geometry.position, offset3)
        }

        for (let i = 0; i < COUNT; i++) {
            const offset3 = i * 3
            this.geometry.velocity[offset3] = (Math.random() - 0.5) * 0.1
            this.geometry.velocity[offset3 + 1] = -Math.random() * 2
            this.geometry.velocity[offset3 + 2] = (Math.random() - 0.5) * 0.1
        }
    }

    #angle = 0
    update(/** @type {number} */ deltaTime) {
        this.#angle += deltaTime 
        quaternion_1.setFromAxisAngle(randomVector3_1, this.#angle)
        quaternion_2.setFromAxisAngle(randomVector3_2, this.#angle)
        this.quaternion.multiplyQuaternions(quaternion_1, quaternion_2)
        this.worldMatrixNeedsUpdate = true
    }
}
