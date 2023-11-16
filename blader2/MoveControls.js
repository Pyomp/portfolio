export class MoveControls {
    
    let c = 0, s = 0
function update() {
    const angleToAdd = context3D.controls.spherical.theta + PI05
    theta = length > 0 ? Math.atan2(y, x) : PI05
    theta += angleToAdd
    c = Math.cos(angleToAdd)
    s = Math.sin(angleToAdd)
}

}
