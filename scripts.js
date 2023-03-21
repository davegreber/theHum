const container = document.getElementById('container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

camera.position.z = 5;

const videoURLs = [
    'https://youtu.be/FI0hTjtM8mo',
    'https://youtu.be/3VM_kh6y-Dc',
    'https://youtu.be/ElVgL9dbUwQ',
    'https://youtu.be/yez2nnQ7Buc',
    'https://youtu.be/URWSWHZoS60',
];

const videoTextures = videoURLs.map((url) => {
    const video = document.createElement('video');
    video.src = url;
    video.loop = true;
    video.muted = true;
    video.load();

    return new THREE.VideoTexture(video);
});

const thumbnailMeshes = videoTextures.map((texture, index) => {
    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(Math.sin((index / videoURLs.length) * Math.PI * 2) * 3, 0, Math.cos((index / videoURLs.length) * Math.PI * 2) * 3);
    mesh.lookAt(scene.position);

    scene.add(mesh);
    return mesh;
});

function onMouseClick(event) {
    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(thumbnailMeshes);

    if (intersects.length > 0) {
        const selectedThumbnail = intersects[0].object;

        if (selectedThumbnail.scale.x === 1) {
            selectedThumbnail.scale.set(4, 4, 4);
            selectedThumbnail.material.map.play();
        } else {
            selectedThumbnail.scale.set(1, 1, 1);
            selectedThumbnail.material.map.pause();
        }
    }
}

window.addEventListener('click', onMouseClick);

function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    thumbnailMeshes.forEach((mesh, index) => {
        mesh.rotation.y = elapsedTime * 0.2 + index * Math.PI / videoURLs.length;
    });

    renderer.render(scene, camera);
}

animate();

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize);