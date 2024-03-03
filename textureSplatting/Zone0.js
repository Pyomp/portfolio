import { loadGLTF } from "../js-lib/3dEngine/loaders/gltfLoader.js"
import { GLSL_SPLATTING } from "../js-lib/3dEngine/programs/chunks/glslSplatting.js"
import { GltfNodeManager } from "../js-lib/3dEngine/sceneGraph/gltf/GltfNodeManager.js"
import { GlObject } from "../js-lib/3dEngine/webgl/glDescriptors/GlObject.js"
import { GlTexture } from "../js-lib/3dEngine/webgl/glDescriptors/GlTexture.js"
import { Vector2 } from "../js-lib/math/Vector2.js"

export class Zone0 {

    #splattingMaterial

    constructor(splattingMaterial) {
        this.#splattingMaterial = splattingMaterial
    }

    async init() {
        const gltfNodes = await loadGLTF(new URL('./assets/zone0.glb', import.meta.url))

        this.node3D = GltfNodeManager.getNode3D({
            gltfNode: gltfNodes['terrainStart'],
            glProgramData: this.#splattingMaterial,
            extraUniforms: {
                [GLSL_SPLATTING.splattingTexture]: new GlTexture({ data: new URL('./assets/textureSplatting.png', import.meta.url) }),
                [GLSL_SPLATTING.textureColor1]: new GlTexture({ data: new URL('./assets/textures/Grass001_1K-JPG/Grass001_1K_Color.jpg', import.meta.url), wrapS: 'REPEAT', wrapT: 'REPEAT' }),
                [GLSL_SPLATTING.textureNormal1]: new GlTexture({ data: new URL('./assets/textures/Grass001_1K-JPG/Grass001_1K_NormalGL.jpg', import.meta.url), wrapS: 'REPEAT', wrapT: 'REPEAT' }),
                [GLSL_SPLATTING.textureScale1]: new Vector2(50, 50),
                [GLSL_SPLATTING.textureColor2]: new GlTexture({ data: new URL('./assets/textures/Ground037_1K-JPG/Ground037_1K_Color.jpg', import.meta.url), wrapS: 'REPEAT', wrapT: 'REPEAT' }),
                [GLSL_SPLATTING.textureNormal2]: new GlTexture({ data: new URL('./assets/textures/Ground037_1K-JPG/Ground037_1K_NormalGL.jpg', import.meta.url), wrapS: 'REPEAT', wrapT: 'REPEAT' }),
                [GLSL_SPLATTING.textureScale2]: new Vector2(50, 50),
                [GLSL_SPLATTING.textureColor3]: new GlTexture({ data: new URL('./assets/textures/Ground031_1K-JPG/Ground031_1K_Color.jpg', import.meta.url), wrapS: 'REPEAT', wrapT: 'REPEAT' }),
                [GLSL_SPLATTING.textureNormal3]: new GlTexture({ data: new URL('./assets/textures/Ground031_1K-JPG/Ground031_1K_NormalGL.jpg', import.meta.url), wrapS: 'REPEAT', wrapT: 'REPEAT' }),
                [GLSL_SPLATTING.textureScale3]: new Vector2(50, 50),
                [GLSL_SPLATTING.textureColor4]: new GlTexture({ data: new URL('./assets/textures/Ground054_1K-JPG/Ground054_1K_Color.jpg', import.meta.url), wrapS: 'REPEAT', wrapT: 'REPEAT' }),
                [GLSL_SPLATTING.textureNormal4]: new GlTexture({ data: new URL('./assets/textures/Ground054_1K-JPG/Ground054_1K_NormalGL.jpg', import.meta.url), wrapS: 'REPEAT', wrapT: 'REPEAT' }),
                [GLSL_SPLATTING.textureScale4]: new Vector2(50, 50),
            }
        })
    }

    dispose() {
        for (const object of this.node3D.objects) {
            if (object instanceof GlObject) {
                object.glVao.needsDelete = true
                for (const uniform of Object.values(object.uniforms)) {
                    if (uniform instanceof GlTexture) {
                        uniform.needsDelete = true
                    }
                }
            }

        }
        this.node3D.dispose()
    }
}
