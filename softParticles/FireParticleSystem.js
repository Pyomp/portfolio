import { Node3D } from "../js-lib/3dEngine/sceneGraph/Node3D.js"
import { Particle } from "../js-lib/3dEngine/sceneGraph/particle/Particle.js"
import { ParticleKeyframe } from "../js-lib/3dEngine/sceneGraph/particle/ParticleKeyframe.js"
import { createSparkleCanvas } from "../js-lib/3dEngine/textures/sparkle.js"
import { GlTexture } from "../js-lib/3dEngine/webgl/glDescriptors/GlTexture.js"
import { loopRaf } from "../js-lib/utils/loopRaf.js" 
import { Color } from "../js-lib/math/Color.js"
import { Vector3 } from "../js-lib/math/Vector3.js"

const _vector3 = new Vector3()

export class FireParticleSystem {
    #fireKeyframes = [
        new ParticleKeyframe({ time: 0, color: new Color(1, 1, 1, 1), size: 0 }),
        new ParticleKeyframe({ time: 0.1, color: new Color(1, 0, 0, 1), size: 3 }),
        new ParticleKeyframe({ time: 3, color: new Color(0, 0, 1, 1), size: 20 }),
        new ParticleKeyframe({ time: 5, color: new Color(0, 0, 0, 0), size: 30 })
    ]

    #fireTexture = new GlTexture({ data: createSparkleCanvas() })

    /**
     * 
     * @param {Node3D} node3D 
     * @param {Vector3} position 
     */
    #addParticle(node3D, position) {
        node3D.objects.add(new Particle({
            keyframes: this.#fireKeyframes,
            texture: this.#fireTexture,
            position,
            velocity: _vector3.randomDirection().multiplyScalar(0.5).addElements(0, 1, 0)
        }))
    }

    /**
     * 
     * @param {Node3D} node3D 
     * @param {Vector3} position 
     */
    getUpdate(node3D, position) {
        let time = 0

        return () => {
            time += loopRaf.deltatimeSecond
            while (time > 0) {
                this.#addParticle(node3D, position)
                time -= 0.09
            }
        }
    }
}
