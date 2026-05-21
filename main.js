const products = [
    { name: "Rose", image: "media/rose1.jpeg", description: "Classic roses suitable for large-scale floral use" },
    { name: "Gerbera", image: "media/gerbera.jpeg", description: "Colorful gerberas suitable for large-scale floral use" },
    { name: "Chrysanthemum", image: "media/chrysanthemum.webp", description: "Spider-type chrysanthemums suitable for large-scale floral use" },
    { name: "Orchid", image: "media/orchids.jpeg", description: "Dendrobium orchids suitable for large-scale floral use" },
    { name: "Gypsophila", image: "media/gypsophila.webp", description: "Baby's breath suitable for large-scale floral use" }
];
const productsGrid = document.getElementById('productsGrid');
if (productsGrid) {
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card reveal-up';
        card.innerHTML = `
                    <img src="${product.image}" alt="${product.name}" class="product-img">
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <span style="color: var(--gold); font-size: 0.85rem; font-weight: 600;">INQUIRE NOW</span>
                    </div>
                `;
        card.addEventListener('click', () => {
            window.open(`https://wa.me/919316602536?text=Hi, I am interested in bulk orders for ${product.name}`, '_blank');
        });
        productsGrid.appendChild(card);
    });
}
const mobileToggle = document.querySelector('.mobile-toggle');
const desktopNav = document.getElementById('desktopNav');

if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        desktopNav.classList.toggle('active');
        document.body.style.overflow = desktopNav.classList.contains('active') ? 'hidden' : '';
    });
}
document.querySelectorAll('#desktopNav a').forEach(link => {
    link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        desktopNav.classList.remove('active');
        document.body.style.overflow = '';
    });
});
const header = document.getElementById('mainHeader');
let lastScrollY = window.scrollY;
const scrollThreshold = 10;
window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    if (currentScrollY < 100) {
        header.classList.remove('header-hidden');
    } else if (Math.abs(currentScrollY - lastScrollY) > scrollThreshold) {
        if (currentScrollY > lastScrollY) {
            header.classList.add('header-hidden');
        } else {
            header.classList.remove('header-hidden');
        }
    }

    lastScrollY = currentScrollY;
}, { passive: true });

const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

setTimeout(() => {
    document.querySelectorAll('.reveal-text, .reveal-card, .reveal-up').forEach(el => {
        observer.observe(el);
    });
}, 100);

import * as THREE from "https://esm.sh/three@0.160.1";
import { GLTFLoader } from "https://esm.sh/three@0.160.1/examples/jsm/loaders/GLTFLoader.js";

const container = document.getElementById("app");
const statusEl = document.getElementById("status");

if (container && statusEl) {
    const isFileProtocol = window.location.protocol === "file:";

    const scene = new THREE.Scene();
    statusEl.textContent = isFileProtocol
        ? "Opened with file://. Start a local server and open http://localhost:5500/rose_3d/rose-viewer.html"
        : "Initializing viewer...";

    window.addEventListener("error", (event) => {
        statusEl.textContent = `Viewer error: ${event.message || "Unknown error"}`;
    });
    window.addEventListener("unhandledrejection", (event) => {
        const msg = event.reason?.message || String(event.reason || "Unknown error");
        statusEl.textContent = `Viewer error: ${msg}`;
    });

    const rect = container.getBoundingClientRect();
    const w = rect.width || 80;
    const h = rect.height || 80;

    const camera = new THREE.PerspectiveCamera(
        45,
        w / h,
        0.1,
        100
    );
    camera.position.set(0, 0.7, 2.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const hemi = new THREE.HemisphereLight(0xfff4e8, 0x5f3a38, 1.15);
    scene.add(hemi);

    const dir = new THREE.DirectionalLight(0xffffff, 1.2);
    dir.position.set(2.5, 3, 2);
    scene.add(dir);

    const fill = new THREE.DirectionalLight(0xffe4e4, 0.65);
    fill.position.set(-2, 1.5, -1.5);
    scene.add(fill);

    let model;
    let spinPivot;
    const spinSpeed = Math.PI / 3;
    const loader = new GLTFLoader();
    loader.setPath("./media/rose_3d/");
    const textureLoader = new THREE.TextureLoader();

    function forEachMaterial(mesh, fn) {
        if (Array.isArray(mesh.material)) {
            mesh.material = mesh.material.map((m) => fn(m));
        } else {
            mesh.material = fn(mesh.material);
        }
    }

    function modelHasAnyColorMap(root) {
        let hasMap = false;
        root.traverse((obj) => {
            if (!obj.isMesh || hasMap) return;
            const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
            for (const mat of mats) {
                if (mat && mat.map) {
                    hasMap = true;
                    break;
                }
            }
        });
        return hasMap;
    }

    function normalizeExistingMaps(root) {
        root.traverse((obj) => {
            if (!obj.isMesh) return;
            forEachMaterial(obj, (mat) => {
                if (!mat) return mat;
                if (mat.map) mat.map.colorSpace = THREE.SRGBColorSpace;
                mat.side = THREE.DoubleSide;
                mat.needsUpdate = true;
                return mat;
            });
        });
    }

    function applyDiffuseFallback(root, diffuseTexture) {
        root.traverse((obj) => {
            if (!obj.isMesh) return;
            forEachMaterial(obj, (mat) => {
                if (!mat) return mat;
                if (!mat.map) mat.map = diffuseTexture;
                if (mat.color && mat.color.set) mat.color.set(0xffffff);
                if ("metalness" in mat) mat.metalness = 0.0;
                if ("roughness" in mat) mat.roughness = 0.85;
                mat.side = THREE.DoubleSide;
                mat.needsUpdate = true;
                return mat;
            });
        });
    }

    if (!isFileProtocol) {
        const loadingHintTimeout = window.setTimeout(() => {
            statusEl.textContent =
                "Still loading... check server is running and internet access is available for CDN scripts.";
        }, 8000);

        loader.load(
            "scene.gltf",
            (gltf) => {
                window.clearTimeout(loadingHintTimeout);
                model = gltf.scene;
                spinPivot = new THREE.Group();
                scene.add(spinPivot);
                spinPivot.add(model);

                const box = new THREE.Box3().setFromObject(model);
                const size = box.getSize(new THREE.Vector3());
                const center = box.getCenter(new THREE.Vector3());
                model.position.x -= center.x;
                model.position.z -= center.z;
                model.position.y -= box.min.y;
                const maxDim = Math.max(size.x, size.y, size.z) || 1;
                const fov = (camera.fov * Math.PI) / 180;
                const fitDist = maxDim / (2 * Math.tan(fov / 2));
                camera.position.set(0, size.y * 0.75, fitDist * 1.45);
                camera.near = maxDim / 100;
                camera.far = maxDim * 100;
                camera.updateProjectionMatrix();

                if (modelHasAnyColorMap(model)) {
                    normalizeExistingMaps(model);
                    statusEl.textContent = "Rose model loaded. Drag to rotate, scroll to zoom.";
                } else {
                    statusEl.textContent = "Model loaded, applying rose texture...";
                    textureLoader.load(
                        "./media/rose_3d/textures/material_diffuse.png",
                        (tex) => {
                            tex.colorSpace = THREE.SRGBColorSpace;
                            tex.flipY = false;
                            applyDiffuseFallback(model, tex);
                            statusEl.textContent = "Rose model loaded. Drag to rotate, scroll to zoom.";
                        },
                        undefined,
                        (texErr) => {
                            console.error(texErr);
                            statusEl.textContent =
                                "Model loaded, but texture failed. Check media/rose_3d/textures/material_diffuse.png";
                        }
                    );
                }
            },
            (xhr) => {
                if (!xhr.total) return;
                const pct = Math.round((xhr.loaded / xhr.total) * 100);
                statusEl.textContent = `Loading rose model... ${pct}%`;
            },
            (err) => {
                window.clearTimeout(loadingHintTimeout);
                console.error(err);
                const msg = err?.message || String(err || "Unknown error");
                statusEl.textContent = `Failed to load model: ${msg}`;
            }
        );
    }

    window.addEventListener("resize", () => {
        const rect = container.getBoundingClientRect();
        const w = rect.width || 80;
        const h = rect.height || 80;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    });

    const clock = new THREE.Clock();
    function animate() {
        requestAnimationFrame(animate);
        const dt = clock.getDelta();
        if (spinPivot) {
            spinPivot.rotation.y += spinSpeed * dt;
        }
        renderer.render(scene, camera);
    }
    animate();
} // end of if (container && statusEl)
