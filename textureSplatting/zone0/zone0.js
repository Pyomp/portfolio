

this.gltfNodes = await loadGLTF(new URL('./zone0.glb', import.meta.url))

const node = gltfNodes['terrainStart']

{
    gl.getUniformLocation(glProgram, "position")


    this.splattingTexture = new Texture({})
    this.splattingTexture.data.src = new URL('./textureSplatting.png', import.meta.url).href
    this.map1 = new Texture({
        minFilter: 'LINEAR_MIPMAP_NEAREST',
        magFilter: 'LINEAR',
        wrapS: 'REPEAT', wrapT: 'REPEAT',
        scale: new Vector2(60, 60)
    })


    this.map1.data.src = new URL('./textures/Grass001_1K-JPG/Grass001_1K_Color.jpg', import.meta.url).href

    this.map2 = new Texture({
        minFilter: 'LINEAR_MIPMAP_NEAREST',
        wrapS: 'REPEAT', wrapT: 'REPEAT', scale: new Vector2(40, 40)
    })
    this.map2.data.src = new URL('./textures/Ground037_1K-JPG/Ground037_1K_Color.jpg', import.meta.url).href

    this.map3 = new Texture({
        minFilter: 'LINEAR_MIPMAP_NEAREST',
        wrapS: 'REPEAT', wrapT: 'REPEAT', scale: new Vector2(5, 5)
    })
    this.map3.data.src = new URL('./textures/Ground031_1K-JPG/Ground031_1K_Color.jpg', import.meta.url).href

    this.gltfPrimitive = node.mesh.primitives[0]
}
{
    rockGltfPrimitive = gltfNodes['rock1'].mesh.primitives[0]
    const texture = new Texture({})
    texture.data.src = new URL('./textures/Rock037_1K-JPG/Rock037_1K_Color.jpg', import.meta.url).href
    rockGltfPrimitive.material.textures['u_map'] = texture
}



export class Zone0 {
    static init = init
    static destroy = destroy

    #meshTerrain = new SplattingMesh(
        gltfPrimitive,
        splattingTexture,
        map1, map2, map3,
    )
    #rock1 = new GltfMesh(rockGltfPrimitive, 'rock1')

    node3D = new Node3D({
        objects: [this.#meshTerrain, this.#rock1]
    })

    #lightsDispose

    constructor(renderer) {
        if (!gltfPrimitive) throw new Error('TerrainNode is not initialized "await TerrainNode.init()"')
        initLights(renderer)
        // this.#lightsDispose = initPointLights()
    }

    dispose() {
        this.#lightsDispose()
        this.node3D.dispose()
    }
}
