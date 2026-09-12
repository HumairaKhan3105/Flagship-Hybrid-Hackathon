import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Region } from '../../types';
import { Sparkles, Compass, MapPin, ChevronRight, Lock } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface IndiaMap3DProps {
  regions: Region[];
  selectedRegionId: string;
  onSelectRegion: (region: Region) => void;
  onEnterStory: (region: Region) => void;
}

export default function IndiaMap3D({
  regions,
  selectedRegionId,
  onSelectRegion,
  onEnterStory,
}: IndiaMap3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const activeRegion = regions.find(r => r.id === selectedRegionId) || regions[0];

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Three.js Scene for 3D Map Grid, Ley-lines, Particles & Golden Aura
    const scene = new THREE.Scene();
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 550;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, -0.2, 5.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Warm golden ambient and spot lighting
    const ambientLight = new THREE.AmbientLight(0x281a10, 2.0);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xf7c948, 2.0);
    dirLight.position.set(2, 4, 3);
    scene.add(dirLight);

    // Subtle 3D Topographic Wireframe / Contour Grid under India
    const gridHelper = new THREE.GridHelper(6, 24, 0x8c6014, 0x221a10);
    gridHelper.position.y = -1.6;
    gridHelper.rotation.x = 0.2;
    scene.add(gridHelper);

    // 3D Golden Threads connecting historical textile hubs (Varanasi -> Kanchi -> Paithan -> Patan -> Amritsar)
    const threadMaterial = new THREE.LineBasicMaterial({
      color: 0xf5c042,
      transparent: true,
      opacity: 0.5,
      linewidth: 1.5,
    });

    const threadPairs: [number, number, number, number][] = [
      [-0.1, 0.4, 0.4, -0.8],  // Varanasi to Kanchipuram
      [-0.1, 0.4, -0.6, -0.2], // Varanasi to Paithan
      [-0.6, -0.2, -1.0, 0.0], // Paithan to Patan Gujarat
      [-1.0, 0.0, -0.6, 0.9],  // Patan to Amritsar Punjab
      [-0.6, 0.9, -0.5, 1.4],  // Amritsar to Kashmir
      [-0.1, 0.4, 1.3, 0.5],   // Varanasi to Assam
      [-0.1, 0.4, 0.9, 0.0],   // Varanasi to West Bengal
      [0.9, 0.0, 0.6, -0.3],   // West Bengal to Odisha
      [0.4, -0.8, 0.0, -1.1],  // Kanchipuram to Kerala
    ];

    const threadGroup = new THREE.Group();
    threadPairs.forEach(([x1, y1, x2, y2]) => {
      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(x1, y1, 0),
        new THREE.Vector3((x1 + x2) / 2, (y1 + y2) / 2, 0.3),
        new THREE.Vector3(x2, y2, 0)
      );
      const points = curve.getPoints(30);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, threadMaterial);
      threadGroup.add(line);
    });
    scene.add(threadGroup);

    // Floating Golden Motifs / Sacred Dust
    const dustCount = 80;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i += 3) {
      dustPos[i] = (Math.random() - 0.5) * 6;
      dustPos[i + 1] = (Math.random() - 0.5) * 4;
      dustPos[i + 2] = (Math.random() - 0.5) * 2;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xf5c042,
      size: 0.035,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const dustPoints = new THREE.Points(dustGeo, dustMat);
    scene.add(dustPoints);

    // Interactive slight tilt with mouse
    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    container.addEventListener('mousemove', onMouseMove);

    // Handle Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Gentle camera parallax
      camera.position.x += (mouseX * 0.4 - camera.position.x) * 0.05;
      camera.position.y += (-mouseY * 0.3 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      // Thread pulsation
      threadMaterial.opacity = 0.35 + Math.sin(t * 2) * 0.25;

      // Dust floating
      const p = dustGeo.attributes.position;
      for (let i = 1; i < dustCount * 3; i += 3) {
        let y = p.getY(Math.floor(i / 3));
        y += 0.002;
        if (y > 2.2) y = -2.0;
        p.setY(Math.floor(i / 3), y);
      }
      p.needsUpdate = true;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      threadMaterial.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-4 sm:p-6 overflow-hidden select-none">
      {/* Three.js Background Canvas */}
      <div ref={mountRef} className="absolute inset-0 pointer-events-none z-0 opacity-80" />

      {/* Ornate Ancient Compass Rose in Top Corner */}
      <div className="absolute top-6 right-6 z-10 hidden md:flex items-center gap-3 bg-black/50 backdrop-blur-md px-3.5 py-2 rounded-xl border border-amber-500/30 shadow-xl pointer-events-none">
        <Compass className="w-6 h-6 text-amber-400 animate-spin" style={{ animationDuration: '30s' }} />
        <div>
          <p className="text-[11px] font-cinzel font-bold text-amber-300 tracking-wider">BHARAT REGIONAL GRID</p>
          <p className="text-[10px] text-stone-400 font-marcellus">12 Textile Heritage Realms</p>
        </div>
      </div>

      {/* Interactive India Regional SVG Map Layer with authentic pins */}
      <div className="relative z-10 w-full max-w-4xl flex-1 flex items-center justify-center my-2">
        {/* SVG Container calibrated to India's silhouette */}
        <div className="relative w-full max-w-[620px] aspect-[4/4.5] flex items-center justify-center">
          {/* Stylized Glowing India Topography Vector Silhouette */}
          <svg
            viewBox="0 0 600 700"
            className="w-full h-full drop-shadow-[0_0_25px_rgba(212,154,35,0.25)]"
            style={{ filter: 'drop-shadow(0 0 15px rgba(245, 192, 66, 0.2))' }}
          >
            <defs>
              <linearGradient id="indiaMapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1a1e28" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#121822" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#0b1019" stopOpacity="0.95" />
              </linearGradient>
              <pattern id="jutePattern" width="16" height="16" patternUnits="userSpaceOnUse">
                <path d="M 0,8 l 8,-8 M 8,16 l 8,-8" stroke="#f5c042" strokeWidth="0.5" strokeOpacity="0.1" />
              </pattern>
            </defs>

            {/* Stylized Contour Silhouette of Indian Subcontinent */}
            <path
              d="M 230 45 
                 C 255 40, 275 60, 270 95
                 C 285 110, 310 135, 305 165
                 C 340 185, 385 190, 420 205
                 C 475 220, 520 200, 550 225
                 C 560 255, 540 280, 525 305
                 C 490 315, 470 290, 440 280
                 C 430 300, 425 330, 410 360
                 C 430 410, 410 460, 370 510
                 C 330 560, 290 620, 275 665
                 C 260 625, 230 570, 215 515
                 C 195 460, 180 410, 190 370
                 C 150 375, 115 350, 105 320
                 C 120 300, 150 285, 140 250
                 C 150 210, 185 180, 195 130
                 C 205 90, 215 65, 230 45 Z"
              fill="url(#indiaMapGrad)"
              stroke="#d49a23"
              strokeWidth="2.5"
              strokeDasharray="4 2"
              className="transition-all duration-700"
            />
            {/* Texture overlay */}
            <path
              d="M 230 45 
                 C 255 40, 275 60, 270 95
                 C 285 110, 310 135, 305 165
                 C 340 185, 385 190, 420 205
                 C 475 220, 520 200, 550 225
                 C 560 255, 540 280, 525 305
                 C 490 315, 470 290, 440 280
                 C 430 300, 425 330, 410 360
                 C 430 410, 410 460, 370 510
                 C 330 560, 290 620, 275 665
                 C 260 625, 230 570, 215 515
                 C 195 460, 180 410, 190 370
                 C 150 375, 115 350, 105 320
                 C 120 300, 150 285, 140 250
                 C 150 210, 185 180, 195 130
                 C 205 90, 215 65, 230 45 Z"
              fill="url(#jutePattern)"
            />

            {/* Sacred Rivers (Ganga, Yamuna, Godavari, Kaveri, Indus) */}
            <path
              d="M 250 140 Q 330 220 425 285"
              stroke="#4a89dc"
              strokeWidth="1.5"
              strokeOpacity="0.45"
              fill="none"
              strokeDasharray="2 2"
            />
            <path
              d="M 200 400 Q 280 430 370 470"
              stroke="#4a89dc"
              strokeWidth="1.5"
              strokeOpacity="0.4"
              fill="none"
              strokeDasharray="2 2"
            />
          </svg>

          {/* Regional Interactive Pins matching reference design */}
          {regions.map((region) => {
            const isSelected = region.id === selectedRegionId;
            return (
              <button
                key={region.id}
                onClick={() => {
                  soundManager.playChime();
                  onSelectRegion(region);
                }}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 group transition-all duration-300 z-20 ${
                  isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                }`}
                style={{
                  left: `${region.mapX}%`,
                  top: `${region.mapY}%`,
                }}
              >
                {/* Pin Aura & Glow */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-amber-400 text-stone-950 ring-4 ring-amber-300 shadow-[0_0_25px_#f5c042]'
                      : 'bg-stone-900/90 text-amber-300 border border-amber-500/60 hover:border-amber-300 shadow-md backdrop-blur-md'
                  }`}
                >
                  {/* Textile Garment Icon */}
                  {isSelected ? (
                    <MapPin className="w-5 h-5 fill-current animate-bounce" />
                  ) : (
                    <span className="text-sm font-bold font-cinzel">
                      {region.name.charAt(0)}
                    </span>
                  )}
                </div>

                {/* Floating State & Textile Tag */}
                <div
                  className={`absolute left-1/2 -translate-x-1/2 mt-1 px-2.5 py-1 rounded-md text-[11px] whitespace-nowrap transition-all shadow-xl pointer-events-none flex flex-col items-center ${
                    isSelected
                      ? 'bg-amber-950/90 text-amber-200 border border-amber-400 opacity-100'
                      : 'bg-black/75 text-stone-300 border border-stone-700/60 opacity-80 group-hover:opacity-100 group-hover:border-amber-500/40'
                  }`}
                >
                  <span className="font-cinzel font-semibold tracking-wide">
                    {region.name}
                  </span>
                  <span className="text-[9px] text-amber-300/90 font-marcellus">
                    {region.textileTraditions[0]}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Region Showcase Bottom Banner (Matching Top-Center Reference Screen) */}
      <div className="relative z-20 w-full max-w-4xl royal-glass-card p-4 sm:p-5 rounded-xl border border-amber-500/50 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
        {/* Left Decorative Region Info */}
        <div className="flex items-center gap-4 text-left">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-700 to-amber-950 border border-amber-400/60 flex items-center justify-center text-amber-200 shadow-inner flex-shrink-0">
            <Sparkles className="w-7 h-7 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl sm:text-2xl font-cinzel font-bold text-amber-300 tracking-wide">
                {activeRegion.name}
              </h3>
              {activeRegion.nativeScript && (
                <span className="text-xs px-2 py-0.5 rounded bg-amber-950/70 border border-amber-500/30 text-amber-300 font-rozha">
                  {activeRegion.nativeScript}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-stone-300 font-marcellus flex items-center gap-2 mt-0.5">
              <span>{activeRegion.climate}</span>
              <span className="w-1 h-1 rounded-full bg-amber-400" />
              <span className="text-amber-400 font-semibold">{activeRegion.storyCount} Clothing Stories</span>
            </p>
          </div>
        </div>

        {/* Action Button: Enter Region & Story */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => {
              soundManager.playCorrectFanfare();
              onEnterStory(activeRegion);
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-lg font-cinzel font-bold text-sm tracking-wider uppercase text-stone-950 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:from-amber-200 hover:to-amber-400 border border-amber-200 shadow-[0_0_20px_rgba(245,192,66,0.45)] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>Begin Story</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
