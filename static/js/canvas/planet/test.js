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
    fieldOfView = 60;
    nearPlane = 1;
    farPlane = 10000;
    camera = new THREE.PerspectiveCamera(
        fieldOfView,
        aspectRatio,
        nearPlane,
        farPlane
    );
    scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);
    camera.position.x = 0;
    camera.position.z = 300;
    camera.position.y = 50;

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

var ambientLight, hemisphereLight, shadowLight;

function createLights() {

    hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, .9)
    shadowLight = new THREE.DirectionalLight(0xffffff, .9);
    shadowLight.position.set(150, 350, 350);
    shadowLight.castShadow = true;
    shadowLight.shadow.camera.left = -400;
    shadowLight.shadow.camera.right = 400;
    shadowLight.shadow.camera.top = 400;
    shadowLight.shadow.camera.bottom = -400;
    shadowLight.shadow.camera.near = 1;
    shadowLight.shadow.camera.far = 1000;
    shadowLight.shadow.mapSize.width = 2048;
    shadowLight.shadow.mapSize.height = 2048;

    scene.add(hemisphereLight);
    scene.add(shadowLight);
}


var AirPlane = function () {
    this.mesh = new THREE.Object3D();
    this.mesh.name = "airPlane";

    // Create the cabin
    var geomCockpit = new THREE.BoxGeometry(60, 50, 50, 1, 1, 1);
    var matCockpit = new THREE.MeshPhongMaterial({ color: Colors.red, shading: THREE.FlatShading });
    var cockpit = new THREE.Mesh(geomCockpit, matCockpit);
    cockpit.castShadow = true;
    cockpit.receiveShadow = true;
    this.mesh.add(cockpit);

    // Create Engine
    var geomEngine = new THREE.BoxGeometry(20, 50, 50, 1, 1, 1);
    var matEngine = new THREE.MeshPhongMaterial({ color: Colors.white, shading: THREE.FlatShading });
    var engine = new THREE.Mesh(geomEngine, matEngine);
    engine.position.x = 40;
    engine.castShadow = true;
    engine.receiveShadow = true;
    this.mesh.add(engine);

    // Create Tailplane

    var geomTailPlane = new THREE.BoxGeometry(15, 20, 5, 1, 1, 1);
    var matTailPlane = new THREE.MeshPhongMaterial({ color: Colors.red, shading: THREE.FlatShading });
    var tailPlane = new THREE.Mesh(geomTailPlane, matTailPlane);
    tailPlane.position.set(-35, 25, 0);
    tailPlane.castShadow = true;
    tailPlane.receiveShadow = true;
    this.mesh.add(tailPlane);

    // Create Wing

    var geomSideWing = new THREE.BoxGeometry(40, 8, 150, 1, 1, 1);
    var matSideWing = new THREE.MeshPhongMaterial({ color: Colors.red, shading: THREE.FlatShading });
    var sideWing = new THREE.Mesh(geomSideWing, matSideWing);
    sideWing.position.set(0, 0, 0);
    sideWing.castShadow = true;
    sideWing.receiveShadow = true;
    this.mesh.add(sideWing);

    // Propeller

    var geomPropeller = new THREE.BoxGeometry(20, 10, 10, 1, 1, 1);
    var matPropeller = new THREE.MeshPhongMaterial({ color: Colors.brown, shading: THREE.FlatShading });
    this.propeller = new THREE.Mesh(geomPropeller, matPropeller);
    this.propeller.castShadow = true;
    this.propeller.receiveShadow = true;

    // Blades

    var geomBlade = new THREE.BoxGeometry(1, 100, 20, 1, 1, 1);
    var matBlade = new THREE.MeshPhongMaterial({ color: Colors.brownDark, shading: THREE.FlatShading });

    var blade = new THREE.Mesh(geomBlade, matBlade);
    blade.position.set(8, 0, 0);
    blade.castShadow = true;
    blade.receiveShadow = true;
    this.propeller.add(blade);
    this.propeller.position.set(50, 0, 0);
    this.mesh.add(this.propeller);
};

Sky = function () {
    this.mesh = new THREE.Object3D();
    this.nClouds = 20;
    this.clouds = [];
    var stepAngle = Math.PI * 2 / this.nClouds;
    for (var i = 0; i < this.nClouds; i++) {
        var c = new Cloud();
        this.clouds.push(c);
        var a = stepAngle * i;
        var h = 750 + Math.random() * 200;
        c.mesh.position.y = Math.sin(a) * h;
        c.mesh.position.x = Math.cos(a) * h;
        c.mesh.position.z = -400 - Math.random() * 400;
        c.mesh.rotation.z = a + Math.PI / 2;
        var s = 1 + Math.random() * 2;
        c.mesh.scale.set(s, s, s);
        this.mesh.add(c.mesh);
    }
}

Sea = function () {
    // var geom = new THREE.CylinderGeometry(600, 600, 800, 40, 10);
    var geom = new THREE.BoxGeometry(600, 300, 300);
    // geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
    var mat = new THREE.MeshPhongMaterial({
        color: Colors.blue,
        transparent: true,
        opacity: .6,
        shading: THREE.FlatShading,
    });
    this.mesh = new THREE.Mesh(geom, mat);
    this.mesh.receiveShadow = true;
}

Cloud = function () {
    this.mesh = new THREE.Object3D();
    this.mesh.name = "cloud";
    var geom = new THREE.CubeGeometry(20, 20, 20);
    var mat = new THREE.MeshPhongMaterial({
        color: Colors.white,
    });

    var nBlocs = 3 + Math.floor(Math.random() * 3);
    for (var i = 0; i < nBlocs; i++) {
        var m = new THREE.Mesh(geom.clone(), mat);
        m.position.x = i * 15;
        m.position.y = Math.random() * 10;
        m.position.z = Math.random() * 10;
        m.rotation.z = Math.random() * Math.PI * 2;
        m.rotation.y = Math.random() * Math.PI * 2;
        var s = .1 + Math.random() * .9;
        m.scale.set(s, s, s);
        m.castShadow = true;
        m.receiveShadow = true;
        this.mesh.add(m);
    }
}

Chicken = function () {
    this.mesh = new THREE.Object3D();
    this.mesh.name = "chicken";

    // 身体 CylinderBufferGeometry
    var bodyGeom = new THREE.CylinderBufferGeometry(20, 40, 90, 4);
    var bodyMate = new THREE.MeshPhongMaterial({
        color: 0xffde79,
        shininess: 0
    });
    var body = new THREE.Mesh(bodyGeom, bodyMate);
    body.castShadow = true;
    body.receiveShadow = true;
    this.mesh.add(body)

    // 左眼睛 和 左瞳孔    BoxGeometry
    var leftEyeGeom = new THREE.BoxGeometry(3, 20, 20);
    var leftEyeMate = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        shininess: 0
    });
    this.leftEye = new THREE.Mesh(leftEyeGeom, leftEyeMate);
    this.leftEye.position.set(-20, 30, 15);
    this.leftEye.rotateY(1);
    this.leftEye.castShadow = true;
    this.leftEye.receiveShadow = true;

    var leftPupilGeom = new THREE.BoxGeometry(4, 5, 5);
    var leftPupilMate = new THREE.MeshPhongMaterial({
        color: 0x000000,
        shininess: 0
    });
    var leftPupil = new THREE.Mesh(leftPupilGeom, leftPupilMate);
    this.leftEye.add(leftPupil)
    this.mesh.add(this.leftEye)

    // 右眼睛 和 右瞳孔    BoxGeometry
    var rightEyeGeom = new THREE.BoxGeometry(4, 20, 20);
    var rightEyeMate = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        shininess: 0
    });
    this.rightEye = new THREE.Mesh(rightEyeGeom, rightEyeMate);
    this.rightEye.position.set(-20, 30, -15);
    this.leftEye.rotateY(-1);
    this.rightEye.castShadow = true;
    this.rightEye.receiveShadow = true;

    var rightPupilGeom = new THREE.BoxGeometry(4, 5, 5);
    var rightPupilMate = new THREE.MeshPhongMaterial({
        color: 0x000000,
        shininess: 0
    });
    var rightPupil = new THREE.Mesh(rightPupilGeom, rightPupilMate);
    this.rightEye.add(rightPupil)
    this.mesh.add(this.rightEye)

    // 喙
    var mouthGeom = new THREE.ConeBufferGeometry(5, 10, 4);
    var mouthMate = new THREE.MeshPhongMaterial({ color: Colors.red, shading: THREE.FlatShading });
    var mouth = new THREE.Mesh(mouthGeom, mouthMate);
    mouth.position.set(-25, 15, 0);
    mouth.rotation.z = 8;
    mouth.castShadow = true;
    mouth.receiveShadow = true;
    this.mesh.add(mouth)

    // 翎毛

    // 左鸡翅膀   BoxGeometry
    var leftWingGeom = new THREE.BoxGeometry(2, 30, 20);
    var leftWingMate = new THREE.MeshPhongMaterial({ color: Colors.yellow });
    var leftWing = new THREE.Mesh(leftWingGeom, leftWingMate);
    leftWing.position.set(-25, -30, 25);
    leftWing.rotation.set(-10, -10, 0);
    leftWing.receiveShadow = true;
    this.mesh.add(leftWing)

    // 右鸡翅膀   BoxGeometry
    var rightWingGeom = new THREE.BoxGeometry(2, 30, 20);
    var rightWingMate = new THREE.MeshPhongMaterial({ color: Colors.yellow });
    var rightWing = new THREE.Mesh(rightWingGeom, rightWingMate);
    rightWing.position.set(-25, -30, -25);
    leftWing.rotation.set(0, 10, 10);
    rightWing.receiveShadow = true;
    this.mesh.add(rightWing)
}

// 3D Models
var sea;
var airplane;
var chick;

// function createPlane() {
//   airplane = new AirPlane();
//   airplane.mesh.scale.set(.25, .25, .25);
//   airplane.mesh.position.y = 100;
//   scene.add(airplane.mesh);
// }

function createChicken() {
    chick = new Chicken();
    // chick.mesh.scale.set(.25, .25, .25);
    // chick.mesh.position.set(0, 100, 0)
    // chick.mesh.rotation.set(0, 8, 0)
    // chick.mesh.rotateX(39)
    chick.mesh.rotateY(1.6)
    // chick.mesh.rotateZ(-90)

    scene.add(chick.mesh);
}

function createSea() {
    sea = new Sea();
    sea.mesh.position.y = -230;
    scene.add(sea.mesh);
}

function createSky() {
    sky = new Sky();
    sky.mesh.position.y = -600;
    scene.add(sky.mesh);
}

function loop() {
    updateChicken();
    // updatePlane();
    // sea.mesh.rotation.z += .005;
    sky.mesh.rotation.z += .01;
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
}

function updateChicken() {
    var targetY = normalize(mousePos.y, -.75, .75, 25, 175);
    var targetX = normalize(mousePos.x, -.75, .75, -100, 100);
    // console.log('updateChicken->', targetX, targetY)
    // if (targetX > 0) {
    //     chick.mesh.rotation.y = targetX / 100;
    // } else {
    //     chick.mesh.rotation.y = targetX / 100;
    // }

}

// function updatePlane() {
//   var targetY = normalize(mousePos.y, -.75, .75, 25, 175);
//   var targetX = normalize(mousePos.x, -.75, .75, -100, 100);
//   airplane.mesh.position.y = targetY;
//   airplane.mesh.position.x = targetX;
//   airplane.propeller.rotation.x += 0.3;
// }

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
    // createPlane();
    createChicken();
    createSea();
    createSky();
    loop();
}

// HANDLE MOUSE EVENTS
function handleMouseMove(event) {
    var tx = -1 + (event.clientX / WIDTH) * 2;
    var ty = 1 - (event.clientY / HEIGHT) * 2;
    mousePos = { x: tx, y: ty };
}

window.addEventListener('load', init, false);
