import { Texture } from "../../js-lib/3dEngine/sceneGraph/Texture.js"
import { ParticleGeometry } from "../../js-lib/3dEngine/sceneGraph/particle/ParticleGeometry.js"
import { ParticleKeyframe } from "../../js-lib/3dEngine/sceneGraph/particle/ParticleKeyframe.js"
import { ParticleSystem } from "../../js-lib/3dEngine/sceneGraph/particle/ParticleSystem.js"
import { createSparkleCanvas } from "../../js-lib/3dEngine/textures/sparkle.js"
import { Color } from "../../js-lib/math/Color.js"
import { Vector3 } from "../../js-lib/math/Vector3.js"

const _vector3 = new Vector3()

export class FireBall extends ParticleSystem {
    #direction = new Vector3()

    constructor(origin, direction) {
        const count = 50
        super({
            particleKeyframes: [
                new ParticleKeyframe({
                    time: 0,
                    color: new Color(0.5, 0.5, 1, 1),
                    size: 3
                }),
                new ParticleKeyframe({
                    time: 1,
                    color: new Color(0, 0, 0, 0),
                    size: 0
                })
            ],
            geometry: new ParticleGeometry(count),
            map: new Texture({ data: createSparkleCanvas() })
        })

        this.position.copy(origin)
        this.#direction.copy(direction).multiplyScalar(3)

        for (let i = 0; i < count; i++) {
            const offset3 = i * 3
            this.geometry.position[offset3] = 0
            this.geometry.position[offset3 + 1] = 0
            this.geometry.position[offset3 + 2] = 0

            _vector3.randomDirection().multiplyScalar(0.3)
            _vector3.toArray(this.geometry.velocity, offset3)
        }
    }

    update(dt) {
        this.position.addScaledVector(this.#direction, dt)
    }
}
