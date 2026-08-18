/* ==========================================================================
   3DS HOME PLATFORM MVP — 360° VIRTUAL TOUR & ROOM ENGINE (v5.0)
   ========================================================================== */

const Tour360 = {
  scene: null,
  camera: null,
  renderer: null,
  sphere: null,
  textureLoader: null,
  isAutoRotating: true,
  currentPanoramaUrl: null,
  animationFrameId: null,
  isMouseDown: false,
  onPointerDownPointerX: 0,
  onPointerDownPointerY: 0,
  lon: 0,
  onPointerDownLon: 0,
  lat: 0,
  onPointerDownLat: 0,
  phi: 0,
  theta: 0,

  initCanvas(containerId, panoramaUrl) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = ''; // Clear previous canvas

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // Scene & Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, width / height, 1, 1100);
    this.camera.target = new THREE.Vector3(0, 0, 0);

    // Sphere Geometry mapped inverted for 360 Panorama
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);

    this.textureLoader = new THREE.TextureLoader();
    const texture = this.textureLoader.load(panoramaUrl, () => {
      if (this.renderer) this.renderer.render(this.scene, this.camera);
    });

    const material = new THREE.MeshBasicMaterial({ map: texture });
    this.sphere = new THREE.Mesh(geometry, material);
    this.scene.add(this.sphere);

    // WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);
    container.appendChild(this.renderer.domElement);

    // Controls listeners
    this.attachEventListeners(container);

    // Start Render Loop
    this.animate();
  },

  attachEventListeners(container) {
    const domElement = this.renderer.domElement;

    domElement.addEventListener('pointerdown', (e) => {
      this.isMouseDown = true;
      this.onPointerDownPointerX = e.clientX;
      this.onPointerDownPointerY = e.clientY;
      this.onPointerDownLon = this.lon;
      this.onPointerDownLat = this.lat;
    });

    window.addEventListener('pointermove', (e) => {
      if (!this.isMouseDown) return;
      this.lon = (this.onPointerDownPointerX - e.clientX) * 0.1 + this.onPointerDownLon;
      this.lat = (e.clientY - this.onPointerDownPointerY) * 0.1 + this.onPointerDownLat;
    });

    window.addEventListener('pointerup', () => {
      this.isMouseDown = false;
    });

    domElement.addEventListener('wheel', (e) => {
      const fov = this.camera.fov + e.deltaY * 0.05;
      this.camera.fov = THREE.MathUtils.clamp(fov, 30, 90);
      this.camera.updateProjectionMatrix();
    });

    window.addEventListener('resize', () => {
      if (!container || !this.renderer || !this.camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    });
  },

  animate() {
    this.animationFrameId = requestAnimationFrame(() => this.animate());

    if (this.isAutoRotating && !this.isMouseDown) {
      this.lon += 0.08; // Smooth auto rotate speed
    }

    this.lat = Math.max(-85, Math.min(85, this.lat));
    this.phi = THREE.MathUtils.degToRad(90 - this.lat);
    this.theta = THREE.MathUtils.degToRad(this.lon);

    this.camera.target.x = 500 * Math.sin(this.phi) * Math.cos(this.theta);
    this.camera.target.y = 500 * Math.cos(this.phi);
    this.camera.target.z = 500 * Math.sin(this.phi) * Math.sin(this.theta);

    this.camera.lookAt(this.camera.target);
    this.renderer.render(this.scene, this.camera);
  },

  switchRoomTexture(newPanoramaUrl) {
    if (!this.textureLoader || !this.sphere) return;
    this.textureLoader.load(newPanoramaUrl, (newTexture) => {
      this.sphere.material.map = newTexture;
      this.sphere.material.needsUpdate = true;
    });
  },

  toggleAutoRotate() {
    this.isAutoRotating = !this.isAutoRotating;
    return this.isAutoRotating;
  },

  destroy() {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    if (this.renderer && this.renderer.domElement) {
      this.renderer.domElement.remove();
    }
  }
};
