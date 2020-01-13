var chickParams = {
    "position": {
        "id": 0,
        "x": 0,
        "y": 100,
        "z": 0
    },
    "rotation": {
        "id": 1,
        "x": 0,
        "y": 0,
        "z": 0
    },
    "scale": {
        "id": 2,
        "x": 0,
        "y": 0,
        "z": 0
    }
}
// $('#panel').

$("#panel input").on("blur", function () {
    console.log($(this).parents(".item").attr("num"), $(this).attr("name"), $(this).val())
    var $form = $(this).parents("#panel")
})

//COLORS
var Colors = {
    red: 0xf25346,
    white: 0xffffff,
    brown: 0x59332e,
    pink: 0xF5986E,
    brownDark: 0x23190f,
    blue: 0x68c3c0,
    yellow: 0xFFFF8E,
    black: 0x000000
};

// THREEJS RELATED VARIABLES
var scene,
    camera, fieldOfView, aspectRatio, nearPlane, farPlane,
    renderer, container;

//SCREEN & MOUSE VARIABLES
var HEIGHT, WIDTH,
    mousePos = { x: 0, y: 0 };

//INIT THREE JS, SCREEN AND MOUSE EVENTS
function createScene() {
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;

    scene = new THREE.Scene();
    aspectRatio = WIDTH / HEIGHT;
    var fieldOfView = 50;
    var nearPlane = 1;
    var farPlane = 20000;
    camera = new THREE.PerspectiveCamera(
        fieldOfView,
        aspectRatio,
        nearPlane,
        farPlane
    );
    scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);
    camera.position.x = 0;
    camera.position.z = 500;
    camera.position.y = 100;

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(WIDTH, HEIGHT);
    renderer.shadowMap.enabled = true;
    container = document.getElementById('world');
    container.appendChild(renderer.domElement);

    window.addEventListener('resize', handleWindowResize, false);
}

// HANDLE SCREEN EVENTS
function handleWindowResize() {
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
}
// LIGHTS
var globalLight, shadowLight;

function createLights() {
    globalLight = new THREE.HemisphereLight(0xffffff, 0x555555, 1);

    shadowLight = new THREE.DirectionalLight(0xffffff, .4);
    shadowLight.position.set(100, 250, 75);
    shadowLight.castShadow = true;
    shadowLight.shadow.camera.left = -600;
    shadowLight.shadow.camera.right = 600;
    shadowLight.shadow.camera.top = 600;
    shadowLight.shadow.camera.bottom = -600;
    shadowLight.shadow.camera.near = 1;
    shadowLight.shadow.camera.far = 600;
    shadowLight.shadow.mapSize.width = shadowLight.shadow.mapSize.height = 2048;

    scene.add(globalLight);
    scene.add(shadowLight);
}


var Chicken = function () {
    this.rSegments = 4;
    this.hSegments = 5;
    this.cylRay = 120;
    this.bodyBirdInitPositions = [];
    this.vAngle = this.hAngle = 0;
    this.normalSkin = { r: 255 / 255, g: 222 / 255, b: 121 / 255 };
    this.shySkin = { r: 255 / 255, g: 157 / 255, b: 101 / 255 };
    this.color = { r: this.normalSkin.r, g: this.normalSkin.g, b: this.normalSkin.b };
    this.side = "left";

    this.shyAngle = { h: 0, v: 0 };
    this.behaviourInterval;
    this.intervalRunning = false;

    this.group = new THREE.Group();
    this.group.name = "bird";

    this.yellowMat = new THREE.MeshPhongMaterial({
        color: 0xffde79,
        shininess: 0
    })
    this.whiteMat = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        shininess: 0
    })
    this.blackMat = new THREE.MeshPhongMaterial({
        color: 0x000000,
        shininess: 0
    })
    this.orangeMat = new THREE.MeshPhongMaterial({
        color: 0xff5535,
        shininess: 0
    })

    // WINGS
    this.wingLeftGroup = new THREE.Group();
    this.wingRightGroup = new THREE.Group();

    var wingGeom = new THREE.BoxGeometry(60, 60, 5);
    var wingLeft = new THREE.Mesh(wingGeom, this.yellowMat);
    this.wingLeftGroup.add(wingLeft);
    this.wingLeftGroup.position.x = 70;
    this.wingLeftGroup.position.y = 0;
    this.wingLeftGroup.position.z = Math.PI / 2;
    wingLeft.rotation.x = -Math.PI / 4;

    var wingRight = new THREE.Mesh(wingGeom, this.yellowMat);
    this.wingRightGroup.add(wingRight);
    this.wingRightGroup.position.x = -70;
    this.wingRightGroup.position.y = 0;
    this.wingRightGroup.position.z = -Math.PI / 2;
    wingRight.rotation.x = -Math.PI / 4;

    //BODY
    var bodyGeom = new THREE.CylinderGeometry(40, 70, 200, this.rSegments, this.hSegments);
    this.bodyBird = new THREE.Mesh(bodyGeom, this.yellowMat);
    this.bodyBird.position.y = 70;

    this.bodyVerticesLength = (this.rSegments + 1) * this.hSegments;
    for (var i = 0; i < this.bodyVerticesLength; i++) {
        var tv = this.bodyBird.geometry.vertices[i];
        this.bodyBirdInitPositions.push({ x: tv.x, y: tv.y, z: tv.z })
    }
    this.group.add(this.bodyBird);
    this.group.add(this.wingLeftGroup);
    this.group.add(this.wingRightGroup);

    this.face = new THREE.Group();
    var eyeGeom = new THREE.BoxGeometry(60, 60, 10);
    var irisGeom = new THREE.BoxGeometry(10, 10, 10);

    this.leftEye = new THREE.Mesh(eyeGeom, this.whiteMat);
    this.leftEye.position.x = -30;
    this.leftEye.position.y = 120;
    this.leftEye.position.z = 35;
    this.leftEye.rotation.y = -Math.PI / 4;

    this.leftIris = new THREE.Mesh(irisGeom, this.blackMat);
    this.leftIris.position.x = -30;
    this.leftIris.position.y = 120;
    this.leftIris.position.z = 40;
    this.leftIris.rotation.y = -Math.PI / 4;

    this.rightEye = new THREE.Mesh(eyeGeom, this.whiteMat);
    this.rightEye.position.x = 30;
    this.rightEye.position.y = 120;
    this.rightEye.position.z = 35;
    this.rightEye.rotation.y = Math.PI / 4;

    this.rightIris = new THREE.Mesh(irisGeom, this.blackMat);
    this.rightIris.position.x = 30;
    this.rightIris.position.y = 120;
    this.rightIris.position.z = 40;
    this.rightIris.rotation.y = Math.PI / 4;

    // BEAK

    var beakGeom = new THREE.CylinderGeometry(0, 20, 20, 4, 1);
    this.beak = new THREE.Mesh(beakGeom, this.orangeMat);
    this.beak.position.z = 65;
    this.beak.position.y = 70;
    this.beak.rotation.x = Math.PI / 2;

    this.face.add(this.rightEye);
    this.face.add(this.rightIris);
    this.face.add(this.leftEye);
    this.face.add(this.leftIris);
    this.face.add(this.beak);

    //FEATHERS

    var featherGeom = new THREE.BoxGeometry(10, 20, 5);
    this.feather1 = new THREE.Mesh(featherGeom, this.yellowMat);
    this.feather1.position.z = 55;
    this.feather1.position.y = 185;
    this.feather1.rotation.x = Math.PI / 4;
    this.feather1.scale.set(1.5, 1.5, 1);

    this.feather2 = new THREE.Mesh(featherGeom, this.yellowMat);
    this.feather2.position.z = 50;
    this.feather2.position.y = 180;
    this.feather2.position.x = 20;
    this.feather2.rotation.x = Math.PI / 4;
    this.feather2.rotation.z = -Math.PI / 8;

    this.feather3 = new THREE.Mesh(featherGeom, this.yellowMat);
    this.feather3.position.z = 50;
    this.feather3.position.y = 180;
    this.feather3.position.x = -20;
    this.feather3.rotation.x = Math.PI / 4;
    this.feather3.rotation.z = Math.PI / 8;

    this.face.add(this.feather1);
    this.face.add(this.feather2);
    this.face.add(this.feather3);
    this.group.add(this.face);


}
Floor = function () {
    var floorMat = new THREE.ShadowMaterial();
    floorMat.opacity = 0.1;
    this.group = new THREE.Mesh(new THREE.PlaneBufferGeometry(400, 400), floorMat);
    this.group.name = "floor";
    this.group.rotation.x = -Math.PI / 2;
    this.group.receiveShadow = true;
};

var chick;
function createChicken() {
    chick = new Chicken();
    chick.group.position.set(0, 30, 0);
    scene.add(chick.group);
}

function createFloor() {
    floor = new Floor();
    scene.add(floor.group);
}

function loop() {
    updateChicken();
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
}

function updateChicken() {
    var targetY = normalize(mousePos.y, -.75, .75, 25, 175);
    var targetX = normalize(mousePos.x, -.75, .75, -100, 100);
}

function normalize(v, vmin, vmax, tmin, tmax) {
    var nv = Math.max(Math.min(v, vmax), vmin);
    var dv = vmax - vmin;
    var pc = (nv - vmin) / dv;
    var dt = tmax - tmin;
    var tv = tmin + (pc * dt);
    return tv;
}

function init(event) {
    document.addEventListener('mousemove', handleMouseMove, false);
    createScene();
    createLights();
    createChicken();
    createFloor();
    loop();
}

// HANDLE MOUSE EVENTS
function handleMouseMove(event) {
    var tx = -1 + (event.clientX / WIDTH) * 2;
    var ty = 1 - (event.clientY / HEIGHT) * 2;
    mousePos = { x: tx, y: ty };
}

window.addEventListener('load', init, false);
