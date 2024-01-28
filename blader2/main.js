'use strict'

import { styles } from "../js-lib/dom/styles/styles.js"
import { OrbitControls } from "../js-lib/3dEngine/controls/OrbitControls.js"
import { loadGLTF } from "../js-lib/3dEngine/loaders/gltfLoader.js"
import { PhongProgram } from "../js-lib/3dEngine/programs/PhongProgram.js"
import { PointLight } from "../js-lib/3dEngine/sceneGraph/PointLight.js"
import { GltfManager } from "../js-lib/3dEngine/sceneGraph/gltf/GltfManager.js"
import { GlRenderer } from "../js-lib/3dEngine/webgl/glRenderer/GlRenderer.js"
import { AnimationFramePlayer } from "../js-lib/dom/AnimationFramePlayer.js"
import { Color } from "../js-lib/math/Color.js"
import { Vector3 } from "../js-lib/math/Vector3.js"
import { AmbientLight } from "../js-lib/3dEngine/sceneGraph/AmbientLight.js"
import { Particle } from "../js-lib/3dEngine/sceneGraph/particle/Particle.js"
import { ParticleKeyframe } from "../js-lib/3dEngine/sceneGraph/particle/ParticleKeyframe.js"
import { GlTextureData } from "../js-lib/3dEngine/webgl/glDescriptors/GlTextureData.js"
import { createSparkleCanvas } from "../js-lib/3dEngine/textures/sparkle.js"
import { getImage } from "../js-lib/utils/utils.js"
import { SkyBoxGlObject } from "../js-lib/3dEngine/sceneGraph/objects/SkyBoxGlObject.js"

const renderer = new GlRenderer()
document.body.prepend(renderer.htmlElement)
renderer.camera.far = 1000

const orbitControls = new OrbitControls(renderer.camera, renderer.htmlElement)

/////////////// POINT LIGHT
function addPointLight() {
    const pointLight = new PointLight({
        intensity: 0.5,
        color: new Color().setHSL(Math.random(), 1, 0.7),
        localPosition: new Vector3().randomDirection().multiplyScalar(3).addElements(0, 3, 0)
    })

    renderer.scene.objects.add(pointLight)
    return pointLight
}

addPointLight()
addPointLight()
const pointLight = addPointLight()
setTimeout(() => { renderer.scene.objects.delete(pointLight) }, 1000)

///////////////////// AMBIENT LIGHT

const ambientLight = new AmbientLight()
renderer.scene.objects.add(ambientLight)

//////////////// GLTF SKINNED MODEL

const gltfManager = new GltfManager()

const gltfNodes = await loadGLTF(new URL('./blader.glb', import.meta.url))

const phongSkinnedProgram = new PhongProgram({ renderer, isShininessEnable: false, isSkinned: true })
const node3D = gltfManager.getNode3D(gltfNodes['blader'], phongSkinnedProgram)

renderer.scene.addNode3D(node3D)
node3D.mixer.play('idle_pingpong')

//////////////////// PARTICLE

const fireKeyframes = [
    new ParticleKeyframe({ time: 0, color: new Color(1, 1, 1, 1), size: 0 }),
    new ParticleKeyframe({ time: 0.1, color: new Color(0, 1, 0, 1), size: 1 }),
    new ParticleKeyframe({ time: 1.9, color: new Color(1, 0, 0, 1), size: 3 }),
    new ParticleKeyframe({ time: 2, color: new Color(0, 0, 1, 1), size: 3 }),
    new ParticleKeyframe({ time: 3, color: new Color(0, 0, 0, 0), size: 4 })
]
const fireTexture = new GlTextureData({ data: createSparkleCanvas() })
const firePosition = new Vector3(0.3, 0.3, 0)
const leftHandBoneMatrix = node3D.mixer.rootBone.findByName('arm2.L.005').worldMatrix
function addFireParticle() {
    node3D.objects.add(new Particle({
        keyframes: fireKeyframes,
        texture: fireTexture,
        position: firePosition.setFromMatrixPosition(leftHandBoneMatrix),
        velocity: new Vector3().randomDirection().multiplyScalar(0.1).addElements(0, 0, 0)
    }))
}
setInterval(() => { addFireParticle() }, 100)
// window.onclick = () => addFireParticle()

///////////////// 

const skyBox = new SkyBoxGlObject(await Promise.all([
    getImage(new URL('./MilkyWay/dark-s_px.jpg', import.meta.url).href),
    getImage(new URL('./MilkyWay/dark-s_nx.jpg', import.meta.url).href),
    getImage(new URL('./MilkyWay/dark-s_py.jpg', import.meta.url).href),
    getImage(new URL('./MilkyWay/dark-s_ny.jpg', import.meta.url).href),
    getImage(new URL('./MilkyWay/dark-s_pz.jpg', import.meta.url).href),
    getImage(new URL('./MilkyWay/dark-s_nz.jpg', import.meta.url).href)
]))

renderer.scene.objects.add(skyBox)
/////////////////////

const animationFramePlayer = new AnimationFramePlayer(() => {
    orbitControls.update()
    renderer.render(animationFramePlayer.deltatimeSecond)
})
// animationFramePlayer.fpsLimit = 5
animationFramePlayer.play()
