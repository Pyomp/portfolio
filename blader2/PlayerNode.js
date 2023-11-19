import { SkinnedNode } from "../js-lib/3dEngine/sceneGraph/gltf/skinned/SkinnedNode.js"
import { _up } from "../js-lib/math/Vector3.js"

export class PlayerNode extends SkinnedNode {

    #theta = NaN
    update(theta) {
        if (this.#theta !== theta) {
            this.#theta = theta
            this.quaternion.setFromAxisAngle(_up, theta)
            this.localMatrixNeedsUpdate = true
        }
    }
}
