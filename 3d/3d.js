// ==========================================
// 🌴 JUNGLE 3D ENGINE v0.3
// ==========================================

import * as THREE from "three";
window.THREE = THREE;


class Jungle3D {

    constructor(previewElement) {

        this.previewElement = previewElement;

        this.scene = null;
        this.camera = null;
        this.renderer = null;

        this.player = null;
        this.asteroids = [];
        this.lasers = [];
this.score = 0;

this.laserSpeed = 0.8;
this.laserCooldown = 200;
this.lastShotTime = 0;
this.shootingConnected = false;
this.audioContext = null;
this.audioConnected = false;

        // ==========================================
        // 🎮 PLAYER SETTINGS
        // ==========================================

        this.keys = {};

        this.playerSpeed = 0.25;


        // ==========================================
        // 🖱️ MOUSE LOOK SETTINGS
        // ==========================================

        this.mouseSensitivity = 0.0025;

        this.yaw = 0;
        this.pitch = 0;

        this.mouseLocked = false;

        this.keyboardConnected = false;
        this.mouseConnected = false;


        console.log(
            "🌴 Jungle 3D Engine v0.3 loaded!"
        );

    }


    // ==========================================
    // 🚀 START
    // ==========================================

    start() {

        if (!this.previewElement) {

            console.error(
                "❌ 3D preview element not found!"
            );

            return;

        }


        // ==========================================
        // 🌍 SCENE
        // ==========================================

        this.scene =
            new THREE.Scene();

        this.scene.background =
            new THREE.Color(0x87ceeb);


        // ==========================================
        // 📷 CAMERA
        // ==========================================

        this.camera =
            new THREE.PerspectiveCamera(
                75,
                this.previewElement.clientWidth / 400,
                0.1,
                1000
            );

        this.camera.position.set(
            0,
            4,
            8
        );


        // ==========================================
        // 💡 LIGHTING
        // ==========================================

        const sunlight =
            new THREE.DirectionalLight(
                0xffffff,
                2
            );

        sunlight.position.set(
            10,
            15,
            10
        );
        // ☀️ Enable sunlight shadows
sunlight.castShadow = true;

sunlight.shadow.mapSize.set(2048, 2048);

sunlight.shadow.camera.left = -25;
sunlight.shadow.camera.right = 25;
sunlight.shadow.camera.top = 25;
sunlight.shadow.camera.bottom = -25;

sunlight.shadow.bias = -0.0001;

        this.scene.add(
            sunlight
        );


        const ambientLight =
            new THREE.AmbientLight(
                0xffffff,
                0.6
            );

        this.scene.add(
            ambientLight
        );


        // ==========================================
        // 🌱 GROUND
        // ==========================================

        const groundGeometry =
            new THREE.PlaneGeometry(
                100,
                100
            );

        const groundMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x228b22
            });

        const ground =
            new THREE.Mesh(
                groundGeometry,
                groundMaterial
            );
            ground.receiveShadow = true;

        ground.rotation.x =
            -Math.PI / 2;

        this.ground = ground;

        this.scene.add(
            ground
        );


        // ==========================================
        // 🧍 DEFAULT PLAYER
        // ==========================================

        const playerGeometry =
            new THREE.BoxGeometry(
                1,
                2,
                1
            );

        const playerMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x00ff88
            });

        this.player =
            new THREE.Mesh(
                playerGeometry,
                playerMaterial
            );
            this.player.castShadow = true;
this.player.receiveShadow = true;

        this.player.position.set(
            0,
            1,
            0
        );

        this.scene.add(
            this.player
        );


        // ==========================================
        // 🖥️ RENDERER
        // ==========================================

        this.renderer =
            new THREE.WebGLRenderer({
                antialias: true
            });
            // 🌑 Enable realistic shadows
this.renderer.shadowMap.enabled = true;
this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        this.renderer.setPixelRatio(
            Math.min(
                window.devicePixelRatio,
                2
            )
        );

        this.renderer.setSize(
            this.previewElement.clientWidth,
            400
        );

        this.renderer.domElement.style.width =
            "100%";

        this.renderer.domElement.style.height =
            "400px";

        this.renderer.domElement.style.display =
            "block";

        this.renderer.domElement.style.cursor =
            "crosshair";


        this.previewElement.innerHTML = "";

        this.previewElement.appendChild(
            this.renderer.domElement
        );


        // ==========================================
        // 🖥️ FULLSCREEN BUTTON
        // ==========================================

        const fullscreenButton =
            document.createElement("button");

        fullscreenButton.textContent =
            "⛶ Fullscreen";

        fullscreenButton.style.position =
            "absolute";

        fullscreenButton.style.top =
            "10px";

        fullscreenButton.style.right =
            "10px";

        fullscreenButton.style.zIndex =
            "1000";

        fullscreenButton.style.padding =
            "8px 12px";

        fullscreenButton.style.border =
            "none";

        fullscreenButton.style.borderRadius =
            "6px";

        fullscreenButton.style.background =
            "rgba(0, 0, 0, 0.7)";

        fullscreenButton.style.color =
            "white";

        fullscreenButton.style.cursor =
            "pointer";


        fullscreenButton.addEventListener(
            "click",
            () => {

                if (!document.fullscreenElement) {

                    this.previewElement.requestFullscreen();

                } else {

                    document.exitFullscreen();

                }

            }
        );


        this.previewElement.style.position =
            "relative";

        this.previewElement.appendChild(
            fullscreenButton
        );


        // ==========================================
        // ⌨️ KEYBOARD
        // ==========================================

        this.connectKeyboard();


        // ==========================================
        // 🖱️ MOUSE
        // ==========================================

        this.connectMouse();
        this.connectShooting();


        // ==========================================
        // 📐 RESIZE
        // ==========================================

        window.addEventListener(
            "resize",
            () => this.resize()
        );


        // ==========================================
        // 🔄 START LOOP
        // ==========================================

        this.animate();

    }


    // ==========================================
    // 🚀 BUILD SPACE SHOOTER
    // ==========================================

    buildSpaceShooter(game) {

        console.log(
            "🚀 Jungle3D building Space Shooter..."
        );


        if (!this.scene) {

            console.error(
                "❌ Jungle3D has not been started."
            );

            return;

        }


        // ==========================================
        // 🧹 REMOVE GROUND
        // ==========================================

        if (this.ground) {

            this.scene.remove(
                this.ground
            );

            this.ground.geometry.dispose();
            this.ground.material.dispose();

            this.ground = null;

        }


        // ==========================================
        // 🧹 REMOVE OLD PLAYER
        // ==========================================

        if (this.player) {

            this.scene.remove(
                this.player
            );

            this.player.geometry.dispose();
            this.player.material.dispose();

            this.player = null;

        }


        // ==========================================
        // 🧹 REMOVE OLD ASTEROIDS
        // ==========================================

        if (this.asteroids) {

            for (
                const asteroid
                of this.asteroids
            ) {

                this.scene.remove(
                    asteroid
                );

                asteroid.geometry.dispose();
                asteroid.material.dispose();

            }

        }


        this.asteroids = [];


        // ==========================================
        // 🚀 SPACESHIP
        // ==========================================

        // ==========================================
// 🚀 SPACESHIP
// ==========================================

// ==========================================
// 🚀 SPACESHIP
// ==========================================

if (typeof window.Jungle3DRocket === "undefined") {

    console.error(
        "❌ Jungle3DRocket is not loaded."
    );

} else {

    this.rocket =
        new window.Jungle3DRocket(this);

    this.player =
        this.rocket.create();

}
        // ==========================================
        // ☄️ ASTEROIDS
        // ==========================================

        if (
            game &&
            Array.isArray(game.asteroids)
        ) {

            for (
                const asteroidData
                of game.asteroids
            ) {

                const geometry =
                    new THREE.IcosahedronGeometry(
                        1,
                        1
                    );


                const material =
                    new THREE.MeshStandardMaterial({
                        color: 0x777777
                    });


                const asteroid =
                    new THREE.Mesh(
                        geometry,
                        material
                    );


                asteroid.position.set(
                    asteroidData.x || 0,
                    asteroidData.y || 0,
                    asteroidData.z || 0
                );


                asteroid.rotation.x =
                    Math.random() *
                    Math.PI;


                asteroid.rotation.y =
                    Math.random() *
                    Math.PI;


                asteroid.rotation.z =
                    Math.random() *
                    Math.PI;


                this.scene.add(
                    asteroid
                );


                this.asteroids.push(
                    asteroid
                );

            }

        }


        console.log(
            "☄️ Jungle3D created",
            this.asteroids.length,
            "asteroids."
        );


        // ==========================================
        // 🎥 SPACE CAMERA
        // ==========================================

        this.camera.position.set(
            0,
            5,
            10
        );


        this.yaw = 0;
        this.pitch = 0;


        console.log(
            "🎮 3D Space Shooter ready!"
        );
        console.log(
    "🎥 CAMERA DEBUG:",
    "camera =", this.camera.position,
    "rocket =", this.player.position
);

console.log(
    "👀 ROCKET VISIBLE:",
    this.player.visible
);

    }


    // ==========================================
    // ⌨️ KEYBOARD INPUT
    // ==========================================

    connectKeyboard() {

        if (this.keyboardConnected) {
            return;
        }

        this.keyboardConnected = true;


      window.addEventListener(
    "keydown",
    (event) => {
        const target = event.target;

if (
    target instanceof HTMLElement &&
    (
        target.matches("textarea, input, [contenteditable='true']") ||
        target.closest("textarea, input, [contenteditable='true']")
    )
) {
    return;
}

        console.log(
            "⌨️ KEYDOWN:",
            event.key,
            event.code,
            "repeat:",
            event.repeat
        );

        this.keys[
            event.key.toLowerCase()
        ] = true;

    }
);


        window.addEventListener(
            "keyup",
            (event) => {

                this.keys[
                    event.key.toLowerCase()
                ] = false;

            }
        );
        window.addEventListener(
    "keyup",
    (event) => {

        console.log(
            "⌨️ KEYUP:",
            event.key,
            event.code
        );

        this.keys[
            event.key.toLowerCase()
        ] = false;

    }
);

    }
    


    // ==========================================
    // 🖱️ MOUSE CONTROLS
    // ==========================================

    connectMouse() {

        if (this.mouseConnected) {
            return;
        }

        this.mouseConnected = true;


        // ==========================================
        // 🖱️ POINTER LOCK
        // ==========================================

        
this.renderer.domElement.addEventListener("click", () => {
    if (document.pointerLockElement !== this.renderer.domElement) {
        this.renderer.domElement.requestPointerLock();
    }
});

// Escape pointer lock to restore the cursor.
document.addEventListener("keydown", (event) => {
    if (
        event.key === "Escape" &&
        document.pointerLockElement === this.renderer.domElement
    ) {
        document.exitPointerLock();
    }
});


        // ==========================================
        // 🔒 POINTER LOCK CHANGE
        // ==========================================

        document.addEventListener(
            "pointerlockchange",
            () => {
                // Do not capture keyboard input while the user is typing in the editor.
const activeElement = document.activeElement;

if (
  activeElement &&
  (
    activeElement.tagName === "TEXTAREA" ||
    activeElement.tagName === "INPUT" ||
    activeElement.isContentEditable
  )
) {
  return;
}

                this.mouseLocked =
                    document.pointerLockElement ===
                    this.renderer.domElement;


                if (this.mouseLocked) {

                    this.renderer.domElement.style.cursor =
                        "none";

                    console.log(
                        "🖱️ Mouse look enabled!"
                    );

                } else {

                    this.renderer.domElement.style.cursor =
                        "crosshair";

                    console.log(
                        "🖱️ Mouse look disabled."
                    );

                }

            }
        );


        // ==========================================
        // 🖱️ MOUSE MOVEMENT
        // ==========================================

        document.addEventListener(
            "mousemove",
            (event) => {

                if (!this.mouseLocked) {
                    return;
                }


                this.yaw -=
                    event.movementX *
                    this.mouseSensitivity;

                this.pitch -=
                    event.movementY *
                    this.mouseSensitivity;


                const limit =
                    Math.PI / 2 - 0.05;


                this.pitch =
                    Math.max(
                        -limit,
                        Math.min(
                            limit,
                            this.pitch
                        )
                    );

            }
        );

    }
    // ==========================================
// 🔫 SHOOTING
// ==========================================


connectShooting() {
    if (this.shootingConnected) {
        return;
    }

    this.shootingConnected = true;

    window.addEventListener("keydown", (event) => {
        if (event.code !== "Space") {
            return;
        }

        // Never intercept Space while typing in the editor.
        const target = event.target;

        if (
            target instanceof HTMLElement &&
            target.closest(
                "textarea, input, [contenteditable='true']"
            )
        ) {
            return;
        }

        // Only shoot while the 3D preview has pointer lock.
        if (
            document.pointerLockElement !==
            this.renderer?.domElement
        ) {
            return;
        }

        event.preventDefault();
        this.shoot();
    });

    this.renderer.domElement.addEventListener("click", () => {
        if (this.mouseLocked) {
            this.shoot();
        }
    });

    console.log("🔫 Shooting system connected!");
}

// ==========================================
// 🔊 AUDIO SYSTEM
// ==========================================

initAudio() {

    if (this.audioContext) {
        return;
    }

    this.audioContext =
        new (window.AudioContext ||
             window.webkitAudioContext)();

    console.log("🔊 Jungle3D audio system ready!");

}


// ==========================================
// 🔫 LASER SOUND
// ==========================================

playLaserSound() {

    this.initAudio();

    const ctx = this.audioContext;

    const oscillator =
        ctx.createOscillator();

    const gain =
        ctx.createGain();

    oscillator.type = "sawtooth";

    oscillator.frequency.setValueAtTime(
        900,
        ctx.currentTime
    );

    oscillator.frequency.exponentialRampToValueAtTime(
        180,
        ctx.currentTime + 0.12
    );

    gain.gain.setValueAtTime(
        0.15,
        ctx.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + 0.12
    );

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(
        ctx.currentTime + 0.12
    );

}


// ==========================================
// 💥 EXPLOSION SOUND
// ==========================================

playExplosionSound() {

    this.initAudio();

    const ctx = this.audioContext;

    const oscillator =
        ctx.createOscillator();

    const gain =
        ctx.createGain();

    oscillator.type = "square";

    oscillator.frequency.setValueAtTime(
        120,
        ctx.currentTime
    );

    oscillator.frequency.exponentialRampToValueAtTime(
        40,
        ctx.currentTime + 0.3
    );

    gain.gain.setValueAtTime(
        0.25,
        ctx.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + 0.3
    );

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(
        ctx.currentTime + 0.3
    );

}


// ==========================================
// 🔫 FIRE LASER
// ==========================================

shoot() {

   const codeTextarea = document.getElementById("code");

if (
    !codeTextarea ||
    !/aiCreateGameShooter\s*\(/.test(codeTextarea.value)
) {
    return;
}

    const now = performance.now();

    if (
        now - this.lastShotTime <
        this.laserCooldown
    ) {
        return;
    }

    this.lastShotTime = now;
    this.playLaserSound();

    // ------------------------------------------
    // 🔴 LASER
    // ------------------------------------------

    const geometry =
        new THREE.CylinderGeometry(
            0.08,
            0.08,
            2,
            8
        );

    const material =
        new THREE.MeshBasicMaterial({
            color: 0xff0000
        });

    const laser =
        new THREE.Mesh(
            geometry,
            material
        );

    // ------------------------------------------
    // 🎯 SHOOT IN CAMERA DIRECTION
    // ------------------------------------------

    const direction =
        new THREE.Vector3();

    this.camera.getWorldDirection(
        direction
    );

    laser.position.copy(
        this.camera.position
    );

    laser.position.addScaledVector(
        direction,
        1
    );

    laser.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        direction
    );

    laser.userData.direction =
        direction.clone();

    laser.userData.life = 0;

    this.scene.add(laser);

    this.lasers.push(laser);

    console.log("🔫 LASER FIRED!");

}


// ==========================================
// 🔫 UPDATE LASERS
// ==========================================

updateLasers() {

    for (
        let i = this.lasers.length - 1;
        i >= 0;
        i--
    ) {

        const laser =
            this.lasers[i];

        const direction =
            laser.userData.direction;

        laser.position.addScaledVector(
            direction,
            this.laserSpeed
        );

        laser.userData.life++;

        // ------------------------------------------
        // ☄️ ASTEROID COLLISION
        // ------------------------------------------

        for (
            let j = this.asteroids.length - 1;
            j >= 0;
            j--
        ) {

            const asteroid =
                this.asteroids[j];

            const distance =
                laser.position.distanceTo(
                    asteroid.position
                );

            if (distance < 1.2) {

                console.log(
                    "💥 ASTEROID DESTROYED!"
                );
                this.playExplosionSound();

                this.scene.remove(
                    asteroid
                );

                asteroid.geometry.dispose();
                asteroid.material.dispose();

                this.asteroids.splice(
                    j,
                    1
                );

                this.score++;

                console.log(
                    "🏆 SCORE:",
                    this.score
                );

                this.scene.remove(
                    laser
                );

                laser.geometry.dispose();
                laser.material.dispose();

                this.lasers.splice(
                    i,
                    1
                );

                break;

            }

        }

        // ------------------------------------------
        // 🧹 REMOVE OLD LASERS
        // ------------------------------------------

        if (
            this.lasers.includes(laser) &&
            laser.userData.life > 150
        ) {

            this.scene.remove(
                laser
            );

            laser.geometry.dispose();
            laser.material.dispose();

            this.lasers.splice(
                i,
                1
            );

        }

    }

}


    // ==========================================
    // 🎮 PLAYER MOVEMENT
    // ==========================================

    updatePlayer() {

        if (
            !this.player ||
            !this.camera
        ) {
            return;
        }


        let forward = 0;
        let right = 0;


        if (
            this.keys["w"] ||
            this.keys["arrowup"]
        ) {

            forward += 1;

        }


        if (
            this.keys["s"] ||
            this.keys["arrowdown"]
        ) {

            forward -= 1;

        }


        if (
            this.keys["d"] ||
            this.keys["arrowright"]
        ) {

            right += 1;

        }


        if (
            this.keys["a"] ||
            this.keys["arrowleft"]
        ) {

            right -= 1;

        }


        // ==========================================
        // 🧭 MOVEMENT DIRECTION
        // ==========================================

        const direction =
            new THREE.Vector3(
                Math.sin(this.yaw),
                0,
               -Math.cos(this.yaw)
            );


        const rightDirection =
            new THREE.Vector3(
                Math.cos(this.yaw),
                0,
                -Math.sin(this.yaw)
            );


        const movement =
            new THREE.Vector3();


        movement.addScaledVector(
            direction,
            forward
        );


        movement.addScaledVector(
            rightDirection,
            right
        );


       if (movement.length() > 0) {

 console.log(
    "🚀 PLAYER MOVEMENT:",
    movement.x,
    movement.y,
    movement.z,
    "keys:",
    JSON.stringify(this.keys),
    "forward:",
    forward,
    "right:",
    right
);

    movement.normalize();

    this.player.position.addScaledVector(
        movement,
        this.playerSpeed
    );

}

        // ==========================================
        // 🎥 CAMERA POSITION
        // ==========================================

        const cameraDistance = 8;
        const cameraHeight = 4;


        const cameraOffset =
            new THREE.Vector3(
                Math.sin(this.yaw) *
                    cameraDistance,

                cameraHeight,

                Math.cos(this.yaw) *
                    cameraDistance
            );


        const targetCameraPosition =
        this.player.position    
                .clone()
                .add(cameraOffset);


        this.camera.position.lerp(
            targetCameraPosition,
            0.12
        );


        // ==========================================
        // 👀 CAMERA LOOK
        // ==========================================

        const lookDirection =
            new THREE.Vector3(
                Math.sin(this.yaw),
                Math.sin(this.pitch),
                -Math.cos(this.yaw)
            );


        const cameraTarget =
            this.player.position
                .clone()
                .add(
                    lookDirection.multiplyScalar(10)
                );


        this.camera.lookAt(
            cameraTarget
        );

    }


    // ==========================================
    // 📐 RESIZE
    // ==========================================

    resize() {

        if (
            !this.renderer ||
            !this.camera ||
            !this.previewElement
        ) {
            return;
        }


        // ==========================================
        // 🖥️ FULLSCREEN
        // ==========================================

        if (
            document.fullscreenElement ===
            this.previewElement
        ) {

            const width =
                window.innerWidth;

            const height =
                window.innerHeight;


            this.camera.aspect =
                width / height;

            this.camera.updateProjectionMatrix();


            this.renderer.setSize(
                width,
                height
            );


            this.renderer.domElement.style.width =
                "100%";

            this.renderer.domElement.style.height =
                "100%";

            return;

        }


        // ==========================================
        // 🪟 NORMAL PREVIEW
        // ==========================================

        const width =
            this.previewElement.clientWidth;

        const height =
            400;


        this.camera.aspect =
            width / height;

        this.camera.updateProjectionMatrix();


        this.renderer.setSize(
            width,
            height
        );


        this.renderer.domElement.style.width =
            "100%";

        this.renderer.domElement.style.height =
            "400px";

    }
    
    // ==========================================
    // 🌟 REALISTIC MODE
    // ==========================================

    enableRealisticMode() {

        if (!this.scene || !this.renderer) {
            console.warn(
                "🌟 Start the 3D engine before enabling realistic mode."
            );
            return;
        }

        // 🌑 Enable improved shadows
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type =
            THREE.PCFSoftShadowMap;

        // 🎨 Improve color and lighting calculations
        this.renderer.outputColorSpace =
            THREE.SRGBColorSpace;

        this.renderer.toneMapping =
            THREE.ACESFilmicToneMapping;

        this.renderer.toneMappingExposure = 1.0;

        // 💡 Improve existing lights
        this.scene.traverse((object) => {

            if (object.isDirectionalLight) {

                object.intensity = 3;

                object.castShadow = true;

                object.shadow.mapSize.set(
                    2048,
                    2048
                );

                object.shadow.bias = -0.0001;

            }

            if (object.isMesh) {

                // Make meshes cast and receive shadows
                object.castShadow = true;
                object.receiveShadow = true;

                // Improve supported material settings
                const materials = Array.isArray(
                    object.material
                )
                    ? object.material
                    : [object.material];

                materials.forEach((material) => {

                    if (
                        material &&
                        material.isMeshStandardMaterial
                    ) {

                        material.roughness =
                            Math.max(
                                0.25,
                                material.roughness
                            );

                        material.needsUpdate = true;

                    }

                });

            }

        });

        console.log(
            "🌟 Realistic mode enabled: lighting, shadows and materials!"
        );

    }



    // ==========================================
    // 🔄 ANIMATION
    // ==========================================

    animate() {

        requestAnimationFrame(
            () => this.animate()
        );


        this.updatePlayer();
        this.updateLasers();


        if (
            this.renderer &&
            this.scene &&
            this.camera
        ) {

            this.renderer.render(
                this.scene,
                this.camera
            );

        }

    }

}


// ==========================================
// 🌎 MAKE ENGINE AVAILABLE
// ==========================================

window.Jungle3D =
    Jungle3D;


console.log(
    "🧊 Jungle3D is ready!"
);