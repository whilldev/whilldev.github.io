import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { CubeTexture } from 'three';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
// impor unreal bloom pass
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import { FrontSide, BackSide, DoubleSide } from 'three';

//autosizeconstant
const container = document.getElementById('main-canvas');
const containerSecond = document.getElementById('second-section-canvas')
//medidas
let width = container.clientWidth;
let height = container.clientHeight;

const modelUrl = new URL('../js/models/phone.glb', import.meta.url);
const hdrUrl = new URL('../js/hdr/moonless_golf_4k.hdr', import.meta.url);
const imageUrl = new URL('../js/images/screen.jpeg', import.meta.url);
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(45, window.innerWidth/
window.innerHeight, 1, 1000);
const renderer = new THREE.WebGLRenderer({antialias:true});
const params = {
    threshold: 0,
    strength: 0.2,
    radius: 0.2,
    exposure: 0.2
};

//const texture = useCubeTexture(["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"], {path: "js/hdr/"});

renderer.autoClear = true;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize( width, height);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMappingExposure = 1.8;
renderer.outputColorSpace = THREE.SRGBColorSpace;

container.appendChild(renderer.domElement);

camera.position.set(10,10,10);
camera.lookAt(0,0,0);

//loader rgb
const rgbLoader = new RGBELoader();
rgbLoader.load(hdrUrl, function(texture){
    texture.mapping = THREE.EquirectangularReflectionMapping;
    //scene.background = texture;
    scene.environment = texture;
});

//loader texture image
const TextureLoader = new THREE.TextureLoader().load('./html-freebie-triple-p-master/assets/js/images/screen.jpeg');
const renderScene = new RenderPass(scene, camera);

const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth,
    window.innerHeight), 1.5, 0.4, 0.85);
bloomPass.threshold = params.threshold;
bloomPass.strength = params.strength;
bloomPass.radius = params.radius;

const bloomcomposer = new EffectComposer(renderer);
bloomcomposer.addPass(renderScene);
bloomcomposer.addPass(bloomPass);

const outputPass = new OutputPass();
bloomcomposer.addPass(outputPass);

//orbitsControl
const orbit = new OrbitControls(camera, renderer.domElement)
orbit.update();

//light
var light = new THREE.AmbientLight(0xffffff,3,100,0.2,0.5);
scene.add(light);
//load model
let model;
//put cube_0 image texture

const assetLoader = new GLTFLoader();
assetLoader.load(modelUrl.href, function(gltf){
    
    model = gltf.scene;
    scene.add(model);
    console.log(model);
    model.traverse((child) => {
        if (child.isMesh && child.name === "Cube_1") {
            // Change material of back of the phone
            const newMaterial = new THREE.MeshStandardMaterial({ color: 0x000000,
                roughness: 0, metalness: 0.9});
            child.material = newMaterial;
        }
        if (child.isMesh && child.name === "Cube_2"){
            const mScreen = new THREE.MeshStandardMaterial({
                map: TextureLoader,
            });
            child.material = mScreen;
        } 
    });
}, undefined, function(error){
    console.error(error);
});

function animate(){
    requestAnimationFrame(animate);
    //renderer.render(scene, camera);
    if(model){
        model.rotation.y += 0.01;
    } 
    bloomcomposer.render(scene, camera)
}

animate();
// Handle Window Resize
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    const width = container.clientWidth;
    const height = container.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
}
//bloomcomposer.setSize(window.innerWidth, window.innerHeight);