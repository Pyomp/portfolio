import { loadGLTF } from "../js-lib/3dEngine/loaders/gltfLoader.js"
import { Node3D } from "../js-lib/3dEngine/sceneGraph/Node3D.js"
import { Object3D } from "../js-lib/3dEngine/sceneGraph/Object3D.js"
import { BasicStaticMaterial } from "../js-lib/3dEngine/sceneGraph/materials/BasicStaticGltfMaterial.js"
import { PhongMaterial } from "../js-lib/3dEngine/sceneGraph/materials/PhongMaterial.js"
import { _up } from "../js-lib/math/Vector3.js"

let gltfPrimitive, gltfPrimitiveTop

async function init() {
    const nodes = await loadGLTF(new URL('./bul.glb', import.meta.url))
    gltfPrimitive = nodes['Sphere'].mesh.primitives[0]
    gltfPrimitiveTop = nodes['SphereTop'].mesh.primitives[0]
}
function free() {
    gltfPrimitive = undefined
    gltfPrimitiveTop = undefined
}

export class BulBall extends Node3D {
    static init = init
    static free = free

    constructor() {
        super()
        const phong = new BasicStaticMaterial()

        this.nodeBot = new Node3D()
        const object = phong.createObjectFromGltf(this.nodeBot, gltfPrimitive)
        object.cullFace = false
        this.nodeBot.objects.add(object)
        this.addNode3D(this.nodeBot)

        this.nodeTop = new Node3D()
        const objectTop = phong.createObjectFromGltf(this.nodeTop, gltfPrimitiveTop)
        objectTop.cullFace = false
        this.nodeTop.objects.add(objectTop)
        this.addNode3D(this.nodeTop)
    }

    time = 0
    update(deltatime) {
        this.time += deltatime
        this.nodeBot.quaternion.setFromAxisAngle(_up, this.time)
        this.nodeBot.localMatrixNeedsUpdate = true
        this.nodeTop.quaternion.setFromAxisAngle(_up, -this.time)
        this.nodeTop.localMatrixNeedsUpdate = true
    }
}
