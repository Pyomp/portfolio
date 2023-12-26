import { loadGLTF } from "../js-lib/3dEngine/loaders/gltfLoader.js"
import { Node3D } from "../js-lib/3dEngine/sceneGraph/Node3D.js"
import { Object3D } from "../js-lib/3dEngine/sceneGraph/Object3D.js"
import { Texture } from "../js-lib/3dEngine/sceneGraph/Texture.js"
import { Vector2 } from "../js-lib/math/Vector2.js"
import { getImage } from "../js-lib/utils/utils.js"

/** @type {SplattingMaterial} */ let cachedMaterial
/** @type {Geometry} */ let geometry
/** @type {{[name: string]: Texture}} */ let textures

async function init(/** @type {SplattingMaterial} */ material) {
    cachedMaterial = material
    const gltfNodes = await loadGLTF(new URL('./zone0/zone0.glb', import.meta.url))

    const gltfNode = gltfNodes['terrainStart']

    const gltfPrimitive = gltfNode.mesh.primitives[0]

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
    geometry = material.createGeometryFromGltf(gltfPrimitive)
    textures = material.createTextures(splattingImage, image1, normalImage1, image2, normalImage2, image3, normalImage3, image4, normalImage4)
}

function free() {
    cachedMaterial = undefined
    geometry = undefined
    geometry.needsDelete = true
    textures = undefined
    for (const key in textures) {
        textures[key].needsDelete = true
    }
}

export class Zone0Node3D extends Node3D {
    static init = init
    static free = free

    constructor() {
        super()
        this.objects.add(new Object3D({
            material: cachedMaterial,
            geometry,
            uniforms: cachedMaterial.createUniforms(
                this.worldMatrix,
                this.normalMatrix,
                new Vector2(100, 100),
                new Vector2(100, 100),
                new Vector2(100, 100),
                new Vector2(100, 100),
            ),
            textures
        }))
    }
}    
