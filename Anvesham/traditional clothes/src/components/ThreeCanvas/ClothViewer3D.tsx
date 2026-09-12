import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, ZoomIn, ZoomOut, Sparkles } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface ClothViewer3DProps {
  colorHex?: string;
  accentGold?: string;
  garmentName?: string;
  rarity?: string;
  isInteractive?: boolean;
}

export default function ClothViewer3D({
  colorHex = '#8e1628',
  accentGold = '#f5c042',
  garmentName = 'The Banarasi Saree',
  rarity = 'Imperial',
  isInteractive = true,
}: ClothViewer3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [hoverDetail, setHoverDetail] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    
    // Camera
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 450;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 1.2, 3.8);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x2a1c10, 1.8);
    scene.add(ambientLight);

    // Warm golden key light
    const keyLight = new THREE.DirectionalLight(0xffecd0, 2.5);
    keyLight.position.set(3, 5, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    // Royal gold fill light
    const goldFill = new THREE.PointLight(new THREE.Color(accentGold), 2.2, 10);
    goldFill.position.set(-3, 2, 2);
    scene.add(goldFill);

    // Blue-violet twilight rim light for AAA cinematic edge separation
    const rimLight = new THREE.DirectionalLight(0x403060, 1.5);
    rimLight.position.set(0, -3, -4);
    scene.add(rimLight);

    // Root Group for interactive rotation
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // Antique Brass Carved Pedestal
    const pedestalGeo = new THREE.CylinderGeometry(1.3, 1.5, 0.25, 32);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x22180f,
      roughness: 0.35,
      metalness: 0.85,
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = -1.1;
    pedestal.receiveShadow = true;
    modelGroup.add(pedestal);

    // Pedestal gold rim
    const rimGeo = new THREE.TorusGeometry(1.32, 0.04, 16, 64);
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0xd49a23,
      roughness: 0.2,
      metalness: 0.95,
    });
    const rimMesh = new THREE.Mesh(rimGeo, rimMat);
    rimMesh.rotation.x = Math.PI / 2;
    rimMesh.position.y = -0.98;
    modelGroup.add(rimMesh);

    // Create realistic folded royal silk saree geometry
    // Base folded layers (curved rounded cushions representing rich silk folds)
    const foldCount = 4;
    const baseColor = new THREE.Color(colorHex);
    const goldZariColor = new THREE.Color(accentGold);

    // Procedural woven brocade normal / bump canvas
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#808080';
      ctx.fillRect(0, 0, 256, 256);
      // Delicate woven diagonal twill & floral grid
      ctx.strokeStyle = '#a0a0a0';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 256; i += 8) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + 256, 256);
        ctx.stroke();
      }
      // Golden zari flower spots
      ctx.fillStyle = '#ffffff';
      for (let x = 16; x < 256; x += 32) {
        for (let y = 16; y < 256; y += 32) {
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    const fabricTexture = new THREE.CanvasTexture(canvas);
    fabricTexture.wrapS = THREE.RepeatWrapping;
    fabricTexture.wrapT = THREE.RepeatWrapping;
    fabricTexture.repeat.set(6, 6);

    const silkMaterial = new THREE.MeshPhysicalMaterial({
      color: baseColor,
      roughness: 0.25,
      metalness: 0.15,
      clearcoat: 0.7,
      clearcoatRoughness: 0.15,
      bumpMap: fabricTexture,
      bumpScale: 0.02,
      sheen: 1.0,
      sheenColor: goldZariColor,
      sheenRoughness: 0.3,
    });

    const zariMaterial = new THREE.MeshStandardMaterial({
      color: goldZariColor,
      roughness: 0.25,
      metalness: 0.9,
      bumpMap: fabricTexture,
      bumpScale: 0.04,
    });

    // Folded saree layers
    for (let i = 0; i < foldCount; i++) {
      const layerWidth = 1.8 - i * 0.08;
      const layerDepth = 1.3 - i * 0.06;
      const layerHeight = 0.22;
      const foldGeo = new THREE.BoxGeometry(layerWidth, layerHeight, layerDepth, 16, 4, 16);
      
      // Deform box slightly to look like supple fabric with soft rounded draped edges
      const pos = foldGeo.attributes.position;
      for (let j = 0; j < pos.count; j++) {
        const y = pos.getY(j);
        const x = pos.getX(j);
        const z = pos.getZ(j);
        // Soft sag in center, rounded ends
        const sag = -0.04 * (1 - (x / (layerWidth / 2)) ** 2) * (1 - (z / (layerDepth / 2)) ** 2);
        pos.setY(j, y + sag);
      }
      foldGeo.computeVertexNormals();

      const layerMesh = new THREE.Mesh(foldGeo, silkMaterial);
      layerMesh.position.y = -0.85 + i * 0.24;
      layerMesh.castShadow = true;
      layerMesh.receiveShadow = true;
      modelGroup.add(layerMesh);

      // Gold Zari Border ribbon on the front edge of each fold
      const borderGeo = new THREE.BoxGeometry(layerWidth + 0.02, 0.07, 0.12);
      const borderMesh = new THREE.Mesh(borderGeo, zariMaterial);
      borderMesh.position.set(0, -0.85 + i * 0.24, layerDepth / 2 + 0.01);
      borderMesh.castShadow = true;
      modelGroup.add(borderMesh);
    }

    // Top Draped Pallu (sweeping cascade of gold zari embroidered silk)
    const palluCurve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(-0.8, 0.15, 0.3),
      new THREE.Vector3(-0.3, 0.45, 0.6),
      new THREE.Vector3(0.4, 0.35, 0.5),
      new THREE.Vector3(0.8, -0.2, 0.7)
    );
    const palluGeo = new THREE.TubeGeometry(palluCurve, 32, 0.25, 16, false);
    const palluMesh = new THREE.Mesh(palluGeo, zariMaterial);
    palluMesh.castShadow = true;
    modelGroup.add(palluMesh);

    // Sacred floating golden dust particles
    const particleCount = 60;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let p = 0; p < particleCount * 3; p += 3) {
      particlePos[p] = (Math.random() - 0.5) * 3.5;
      particlePos[p + 1] = Math.random() * 2.5 - 0.5;
      particlePos[p + 2] = (Math.random() - 0.5) * 3.5;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xf5c042,
      size: 0.04,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Mouse Drag Rotation
    let isDragging = false;
    let previousMouseX = 0;
    let previousMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      if (!isInteractive) return;
      isDragging = true;
      previousMouseX = e.clientX;
      previousMouseY = e.clientY;
      setIsRotating(false);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMouseX;
      const deltaY = e.clientY - previousMouseY;

      modelGroup.rotation.y += deltaX * 0.01;
      modelGroup.rotation.x += deltaY * 0.005;
      modelGroup.rotation.x = Math.max(-0.4, Math.min(0.6, modelGroup.rotation.x));

      previousMouseX = e.clientX;
      previousMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Resize
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Idle auto-rotation
      if (isRotating && !isDragging) {
        modelGroup.rotation.y += 0.006;
      }

      // Gentle floating levitation
      modelGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.04;

      // Particle gentle rise & twinkle
      const posAttr = particleGeo.attributes.position;
      for (let i = 1; i < particleCount * 3; i += 3) {
        let y = posAttr.getY(Math.floor(i / 3));
        y += 0.003;
        if (y > 2.0) y = -0.6;
        posAttr.setY(Math.floor(i / 3), y);
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      pedestalGeo.dispose();
      pedestalMat.dispose();
      rimGeo.dispose();
      rimMat.dispose();
      fabricTexture.dispose();
      silkMaterial.dispose();
      zariMaterial.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [colorHex, accentGold, isRotating, isInteractive]);

  return (
    <div className="relative w-full h-full min-h-[380px] flex items-center justify-center rounded-xl overflow-hidden group">
      {/* 3D WebGL Canvas Mount */}
      <div 
        ref={mountRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing select-none"
        onMouseEnter={() => setHoverDetail(true)}
        onMouseLeave={() => setHoverDetail(false)}
      />

      {/* Rarity & Garment Badge Overlay */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 pointer-events-none">
        <span className="px-2.5 py-1 rounded-full text-xs font-cinzel font-bold tracking-wider uppercase bg-amber-950/80 text-amber-300 border border-amber-500/50 backdrop-blur-md shadow-lg flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-amber-400" />
          {rarity} Tier
        </span>
        <span className="px-2.5 py-1 rounded-full text-xs font-marcellus bg-black/60 text-stone-200 border border-stone-600/50 backdrop-blur-md">
          Pure 24k Zari & Mulberry Silk
        </span>
      </div>

      {/* Interactive Controls Overlay */}
      {isInteractive && (
        <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-amber-500/30">
          <button
            onClick={() => {
              soundManager.playClick();
              setIsRotating(!isRotating);
            }}
            className={`p-1.5 rounded hover:bg-amber-500/20 text-stone-300 hover:text-amber-300 transition-colors ${isRotating ? 'text-amber-400' : ''}`}
            title={isRotating ? 'Pause Auto-Rotation' : 'Resume Auto-Rotation'}
          >
            <RotateCw className={`w-4 h-4 ${isRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
          </button>
          <div className="w-[1px] h-4 bg-amber-500/20" />
          <span className="text-[11px] font-marcellus text-stone-300 tracking-wide">
            Drag to Rotate 360°
          </span>
        </div>
      )}

      {/* Subtle bottom pedestal glow effect */}
      <div 
        className="absolute bottom-6 w-56 h-12 rounded-full blur-2xl pointer-events-none opacity-40 -z-0"
        style={{ backgroundColor: accentGold }}
      />
    </div>
  );
}
