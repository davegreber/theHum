const container = document.getElementById('container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

camera.position.z = 5;

const videoIds = [
    'FI0hTjtM8mo',
    '3VM_kh6y-Dc',
    'ElVgL9dbUwQ',
    'yez2nnQ7Buc',
    'URWSWHZoS60',
];

clet players = [];

function onYouTubeIframeAPIReady() {
  videoIds.forEach((videoId, index) => {
    const player = new YT.Player(videoId, {
      width: '640',
      height: '360',
      videoId: videoId,
      events: {
        'onReady': () => {
          createThumbnail(player, index);
        }
      }
    });

    players.push(player);
  });
}

function createThumbnail(player, index) {
  const thumbnailUrl = `https://img.youtube.com/vi/${videoIds[index]}/hqdefault.jpg`;

  const loader = new THREE.TextureLoader();
  loader.setCrossOrigin('');
  loader.load(thumbnailUrl, (texture) => {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(Math.sin((index / videoIds.length) * Math.PI * 2) * 3, 0, Math.cos((index / videoIds.length) * Math.PI * 2) * 3);
    mesh.lookAt(scene.position);

    scene.add(mesh);

    animate();
  });
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}