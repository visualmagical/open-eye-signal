let container;
let camera, scene, renderer, group;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let zincr = 0, xincr = 0;
const atomSize = 1, atomwidth = 30;
const guysPerRow = Math.sqrt(amount);
console.log(guysPerRow);
const space = 10;

init();
animate();

function init() {
  // create environment
  container = document.querySelector('.container');
  document.body.appendChild(container);
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2500);
  camera.position.z = 1000;
  camera.position.y = 500;
  scene.add(camera);

  const axesHelper = new THREE.AxesHelper( 100 );
  scene.add( axesHelper );

  // add renderer
  renderer = new THREE.WebGLRenderer({alpha: true});
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(new THREE.Color(0xffffff));
  renderer.setSize(window.innerWidth, window.innerHeight);
  // renderer.shadowMapEnabled = true;
  container.appendChild(renderer.domElement);

  // let in the light
  const ambientLight = new THREE.AmbientLight(0xaaaaaa);
  scene.add(ambientLight);

  const spotLight = new THREE.SpotLight(0xaaaaaa);
  spotLight.position.set(2000, 2000, 2000);
  spotLight.castShadow = true;
  scene.add(spotLight);

  const spotLight2 = new THREE.SpotLight(0xcccccc);
  spotLight2.position.set(1000, 1000, 1000);
  scene.add(spotLight2);

  // let lead characters get together in a group
  group = new THREE.Group();
  scene.add(group);
  group.position.x =group.position.z = - guysPerRow * (atomwidth + space) / 2;
  // create our guys
  for (let i = 0; i < amount; i++) {
    addAtom(i);
  }

  // let user participate in the show
  document.addEventListener('mousemove', onDocumentMouseMove, false);
  document.addEventListener('touchstart', onDocumentTouchStart, false);
  document.addEventListener('touchmove', onDocumentTouchMove, false);
  window.addEventListener('resize', onWindowResize, false);
}

// create each atom
function addAtom(i) {
  const atomGeometry = new THREE.BoxGeometry(atomwidth, atomSize, atomwidth);
  const atomMaterial = new THREE.MeshPhongMaterial({color: `hsl(${i}, 50%, 50%)`});
  const atom = new THREE.Mesh(atomGeometry, atomMaterial);
  atom.castShadow = true;
  atom.name = "atom-" + scene.children.length;
  // position the atom randomly in the scene
  if (i % guysPerRow === 0) zincr += atomwidth + space;
  if (xincr >= guysPerRow * (atomwidth + space)) xincr = 0;

  atom.position.x = xincr;
  atom.position.y = 0;
  atom.position.z = zincr;

  xincr += atomwidth + space;
  // add the atom to the scene
  group.add(atom);
}

// magic starts here
function animate() {
  analyser.getByteFrequencyData(fData);
  const children = group.children;

  for (let i = 0; i < amount; i++) {
    // our people
    const child = children[i];

    // scale them according to frequency and prevent zero scaling
    if (fData[i] < 1) {
      child.scale.y = 1;
      child.position.y = 1;
    } else {
      child.scale.y= fData[i];
      child.position.y = fData[i] / 2;
      // console.log(child.geometry.parameters.height)
    }
    child.material.color = new THREE.Color(`hsl(${fData[i] / 2 + 120}, 50%, 40%)`);






    // play with colours
    // if (!audioElement.paused) {
    //   if (audioElement.currentTime < 150) {
    //     child.material.color = new THREE.Color(`hsl(${fData[i] * 1.5}, 50%, 50%)`);
    //   }
    //   if (audioElement.currentTime >= 150 && audioElement.currentTime < 210.09) {
    //     let clearCol = renderer.getClearColor();
    //     renderer.setClearColor(new THREE.Color(clearCol.r + 0.00002, clearCol.g + 0.00002, clearCol.b + 0.00002));
    //   }
    //   if (audioElement.currentTime >= 158.1 && audioElement.currentTime < 210.09) {
    //     child.material.color = new THREE.Color('hsl(0, 50%, 50%)');
    //     // child.material.color = new THREE.Color(`hsl(0, 0%, 70%)`);
    //     renderer.setClearColor(new THREE.Color(0xffffff));
    //   }
    //   if (audioElement.currentTime >= 210.09) {
    //     renderer.setClearColor(new THREE.Color(0x000000));
    //     child.material.color = new THREE.Color(`hsl(${fData[i] * 1.5}, 50%, 50%)`);
    //   }
    //   if (audioElement.currentTime >= 211) {
    //     child.material.color = new THREE.Color(`hsl(${fData[i] * 1.5}, 50%, 50%)`);
    //   }
    // }
  }
  requestAnimationFrame(animate);
  render();
}

// draw our piece
function render() {
  camera.position.x += (mouseX - camera.position.x) * 0.2;
  // camera.position.y += (-mouseY - camera.position.y) * 0.05;
  camera.lookAt(scene.position);
  // group.rotation.y += 0.005;

  renderer.render(scene, camera);
}

// actions for interactions
function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
function onDocumentMouseMove(event) {
  mouseX = event.clientX - windowHalfX;
  mouseY = event.clientY - windowHalfY;
}
function onDocumentTouchStart(event) {
  if (event.touches.length === 1) {
    mouseX = event.touches[0].pageX - windowHalfX;
    mouseY = event.touches[0].pageY - windowHalfY;
  }
}
function onDocumentTouchMove(event) {
  if (event.touches.length === 1) {
    // event.preventDefault();
    mouseX = event.touches[0].pageX - windowHalfX;
    mouseY = event.touches[0].pageY - windowHalfY;
  }
}
