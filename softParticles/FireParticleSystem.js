import { Texture } from "../js-lib/3dEngine/sceneGraph/Texture.js"
import { ParticleGeometry } from "../js-lib/3dEngine/sceneGraph/particle/ParticleGeometry.js"
import { ParticleKeyframe } from "../js-lib/3dEngine/sceneGraph/particle/ParticleKeyframe.js"
import { ParticleSystem } from "../js-lib/3dEngine/sceneGraph/particle/ParticleSystem.js"
import { createSparkleCanvas } from "../js-lib/3dEngine/textures/sparkle.js"
import { Color } from "../js-lib/math/Color.js"

export class FireParticleSystem extends ParticleSystem {
    constructor() {
        const count = 1000
        super({
            particleKeyframes: [
                new ParticleKeyframe({
                    time: 0,
                    color: new Color(1, 1, 1, 1),
                    size: 0
                }),
                new ParticleKeyframe({
                    time: 1,
                    color: new Color(1, 0, 0, 1),
                    size: 8
                }),
                new ParticleKeyframe({
                    time: 2,
                    color: new Color(0, 0, 0, 0),
                    size: 8
                })
            ],
            geometry: new ParticleGeometry(count),
            map: new Texture({ data: createSparkleCanvas() })
        })

        for (let i = 0; i < count; i++) {
            const offset3 = i * 3
            this.geometry.position[offset3] = 0
            this.geometry.position[offset3 + 1] = 0
            this.geometry.position[offset3 + 2] = 0

            this.geometry.velocity[offset3] = (Math.random() - 0.5) * 2
            this.geometry.velocity[offset3 + 1] = 2 + Math.random() * 2
            this.geometry.velocity[offset3 + 2] = (Math.random() - 0.5) * 2
        }
    }
}
