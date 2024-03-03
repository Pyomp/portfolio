import { ThirdControls } from "../js-lib/3dEngine/controls/ThirdControls.js"
import { HtmlPad } from "../js-lib/controls/HtmlPad/HtmlPad.js"
import { KeyboardMouseControls } from "../js-lib/controls/KeyboardMouseControls.js"
import { PI05 } from "../js-lib/math/MathUtils.js"
import { getMoveFromKey, rotateFromCameraTheta } from "../js-lib/controls/utils.js"

export class Input {
    shortcuts = {
        up: 'KeyW',
        down: 'KeyS',
        left: 'KeyA',
        right: 'KeyD'
    }

    directionX = 0
    directionY = 0
    theta = 0
    length = 0

    constructor(renderElement, camera) {
        this.keyboardMouseControls = new KeyboardMouseControls(renderElement)
        this.htmlPad = new HtmlPad()
        this.thirdControls = new ThirdControls(camera, renderElement)
    }

    setTargetCamera(target) {
        this.thirdControls.target = target
    }

    update() {
        this.keyboardMouseControls.update()
        this.thirdControls.update()

        if (this.htmlPad.length > 0) {
            const direction = rotateFromCameraTheta(this.htmlPad.directionX, this.htmlPad.directionY, this.thirdControls.spherical.theta + PI05)

            this.theta = direction.theta
            this.directionX = direction.x
            this.directionY = direction.y
            this.length = this.htmlPad.length
        } else {
            const move = getMoveFromKey(
                this.keyboardMouseControls.ongoing.has(this.shortcuts.up),
                this.keyboardMouseControls.ongoing.has(this.shortcuts.down),
                this.keyboardMouseControls.ongoing.has(this.shortcuts.left),
                this.keyboardMouseControls.ongoing.has(this.shortcuts.right),
            )

            if (move.length > 0) {

                this.theta = move.theta + this.thirdControls.spherical.theta
                this.directionX = Math.cos(this.theta)
                this.directionY = Math.sin(this.theta)
                this.length = move.length
            } else {
                this.length = 0
            }
        }
    }
}
