import { loadGLTF } from "../js-lib/3dEngine/loaders/gltfLoader.js"
import { SplattingNode } from "../js-lib/3dEngine/sceneGraph/gltf/splatting/SplattingNode.js"
import { SplattingTextures } from "../js-lib/3dEngine/sceneGraph/gltf/splatting/SplattingTextures.js"
import { Vector2 } from "../js-lib/math/Vector2.js"
import { getImage } from "../js-lib/utils/utils.js"

let gltfNode, splattingTextures

async function init() {
    const gltfNodes = await loadGLTF(new URL('./zone0/zone0.glb', import.meta.url))

    gltfNode = gltfNodes['terrainStart']

    const [
        splattingImage,
        image1,
        normalImage1,
        image2,
        normalImage2,
        image3,
        normalImage3,
        image4,
        normalImage4
    ] = await Promise.all([
        getImage(new URL('./zone0/textureSplatting.png', import.meta.url).href),

        getImage(new URL('./zone0/textures/Grass001_1K-JPG/Grass001_1K_Color.jpg', import.meta.url).href),
        getImage(new URL('./zone0/textures/Grass001_1K-JPG/Grass001_1K_NormalGL.jpg', import.meta.url).href),

        getImage(new URL('./zone0/textures/Ground037_1K-JPG/Ground037_1K_Color.jpg', import.meta.url).href),
        getImage(new URL('./zone0/textures/Ground037_1K-JPG/Ground037_1K_NormalGL.jpg', import.meta.url).href),

        getImage(new URL('./zone0/textures/Ground031_1K-JPG/Ground031_1K_Color.jpg', import.meta.url).href),
        getImage(new URL('./zone0/textures/Ground031_1K-JPG/Ground031_1K_NormalGL.jpg', import.meta.url).href),

        getImage(new URL('./zone0/textures/Ground054_1K-JPG/Ground054_1K_Color.jpg', import.meta.url).href),
        getImage(new URL('./zone0/textures/Ground054_1K-JPG/Ground054_1K_NormalGL.jpg', import.meta.url).href),
    ])

    splattingTextures = new SplattingTextures({
        splattingImage,
        image1,
        normalImage1,
        map1Scale: new Vector2(100, 100),
        image2,
        normalImage2,
        map2Scale: new Vector2(100, 100),
        image3,
        normalImage3,
        map3Scale: new Vector2(100, 100),
        image4,
        normalImage4,
        map4Scale: new Vector2(100, 100),
    })
}

function free() {
    gltfNode = undefined
    splattingTextures = undefined
}

export class Zone0Node3D extends SplattingNode {
    static get gltfNode() { return gltfNode }
    static init = init
    static free = free

    constructor() {
        super(gltfNode, splattingTextures)
    }
}
