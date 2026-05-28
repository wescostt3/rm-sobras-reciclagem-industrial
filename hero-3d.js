import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import SplineLoader from '@splinetool/loader';

/* =========================================================================
   3D HERO SPLINE ELEMENT INTEGRATION
   ========================================================================= */
function initHeroSpline3D() {
    const container = document.getElementById('hero-spline-3d');
    if (!container) return;

    // Get container size
    let width = container.clientWidth || 500;
    let height = container.clientHeight || 500;

    // camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 70, 100000);
    camera.position.set(63.27, 231.88, 1371.71);
    camera.quaternion.setFromEuler(new THREE.Euler(-0.01, 0.04, 0));

    // scene
    const scene = new THREE.Scene();
    scene.background = null; // Transparent background

    // renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.0 : 1.5));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.setClearAlpha(0); // Make sure it's transparent

    // Append to container
    container.appendChild(renderer.domElement);

    // spline scene
    const loader = new SplineLoader();
    let splineSceneObj = null;

    loader.load(
        'https://prod.spline.design/3GAvTALsxhf632hn/scene.splinecode',
        (splineScene) => {
            splineSceneObj = splineScene;
            scene.add(splineScene);
            
            // Adjust scene/object scale dynamically
            adjustSplineSceneScale();
        },
        undefined,
        (error) => {
            console.error('Erro ao carregar o elemento 3D do Spline:', error);
            if (typeof window.addSystemLog === 'function') {
                window.addSystemLog('ERRO NO CARREGAMENTO 3D DO SPLINE.');
            }
        }
    );

    // orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableRotate = false;

    // Animation Loop Control with IntersectionObserver
    let isVisible = true;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isVisible = entry.isIntersecting;
            if (isVisible) {
                renderer.setAnimationLoop(animate);
            } else {
                renderer.setAnimationLoop(null);
            }
        });
    }, { threshold: 0.1 });

    const heroSection = document.getElementById('inicio');
    if (heroSection) {
        observer.observe(heroSection);
    }

    function animate(time) {
        if (!isVisible) return;
        controls.update();
        
        // Custom subtle rotation of the spline scene for micro-interaction
        if (splineSceneObj) {
            splineSceneObj.rotation.y = Math.sin(time * 0.0005) * 0.15;
            splineSceneObj.rotation.x = Math.cos(time * 0.0005) * 0.05;
        }

        renderer.render(scene, camera);
    }

    window.addEventListener('resize', onWindowResize);

    function onWindowResize() {
        if (!container) return;
        width = container.clientWidth;
        height = container.clientHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        
        adjustSplineSceneScale();
    }

    function adjustSplineSceneScale() {
        if (!splineSceneObj) return;
        
        // Responsive scaling based on viewport width
        const screenWidth = window.innerWidth;
        let scale = 1.0;
        
        if (screenWidth < 576) {
            scale = 0.5;
        } else if (screenWidth < 992) {
            scale = 0.7;
        } else if (screenWidth < 1200) {
            scale = 0.85;
        }
        
        splineSceneObj.scale.set(scale, scale, scale);
    }
}

// Run immediately or on DOMContentLoaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initHeroSpline3D();
} else {
    document.addEventListener('DOMContentLoaded', initHeroSpline3D);
}
