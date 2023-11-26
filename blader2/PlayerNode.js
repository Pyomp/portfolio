import { SkinnedNode } from "../js-lib/3dEngine/sceneGraph/gltf/skinned/SkinnedNode.js"
import { Sphere } from "../js-lib/math/Sphere.js"
import { Vector3, _up } from "../js-lib/math/Vector3.js"
import { PhysicsState } from "../js-lib/math/physics/PhysicsState.js"

export class PlayerNode extends SkinnedNode {
    #theta = NaN

    velocity = new Vector3()

    boundingSphere = new Sphere(undefined, 0.25)

    physicsState = new PhysicsState()

    update(theta) {
        if (this.#theta !== theta) {
            this.#theta = theta
            this.quaternion.setFromAxisAngle(_up, theta)
        }

        this.boundingSphere.center.copy(this.position)
        this.boundingSphere.center.y += 0.25

        this.localMatrixNeedsUpdate = true
    }

    walk() {
        this.mixer.play('animationName')
    }
}
