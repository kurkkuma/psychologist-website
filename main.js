import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xe19ba8);

const div = document.querySelector(".canvas-container");

let size = div.offsetWidth;

const sizes = {
  width: size,
  height: size,
};
window.addEventListener("resize", () => {
  size = div.offsetWidth;
  sizes.width = size;
  sizes.height = size;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const canvas = document.createElement("canvas");

let base = new THREE.Object3D();
scene.add(base);

let model = null;

const loader = new GLTFLoader();
loader.load("static/model/scene.gltf", function (gltf) {
  gltf.scene.scale.set(20, 20, 20);
  gltf.scene.rotation.x = 0.7;

  model = gltf.scene;
  base.add(model);

  const loader = document.querySelector(".loader");
  if (loader) {
    loader.remove();
  }
  div.appendChild(canvas);
});

const camera = new THREE.PerspectiveCamera(60, 1, 1, 1000);
camera.position.set(0, 0, 5);

const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

var light = new THREE.DirectionalLight(0xffffff, 0.5);
light.position.setScalar(10);
scene.add(light);
scene.add(new THREE.AmbientLight(0xffffff, 0.5));

var plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -2);
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var pointOfIntersection = new THREE.Vector3();
window.addEventListener("mousemove", onMouseMove, false);

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  raycaster.ray.intersectPlane(plane, pointOfIntersection);
  base.lookAt(pointOfIntersection);
}

renderer.setAnimationLoop(() => {
  if (resize(renderer)) {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
  renderer.render(scene, camera);
});

function resize(renderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

function getDeviceType() {
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobile =
    /mobile|iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(
      userAgent
    );

  if (isMobile) {
    return "mobile";
  } else {
    return "desktop";
  }
}

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  if (model) {
    if (getDeviceType() === "mobile") {
      base.rotation.set(0, 0, 0);

      model.rotation.y = elapsedTime / 2;
      model.rotation.z = elapsedTime / 2;
    } else {
      model.rotation.x = 0.7;
      model.rotation.y = 0;
      model.rotation.z = 0;
    }
  }

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();

function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

const mainDiv = document.querySelector(".main-part");
const decorateDivs = document.querySelectorAll(".decorate-div");

function animateIfVisible() {
  if (
    isElementInViewport(mainDiv.querySelector("h1")) ||
    isElementInViewport(mainDiv) ||
    isElementInViewport(decorateDivs[0]) ||
    isElementInViewport(decorateDivs[1])
  ) {
    mainDiv.style.animation = "appear 1s ease-in-out both";
  }
}

document.addEventListener("DOMContentLoaded", animateIfVisible);
window.addEventListener("scroll", animateIfVisible);
