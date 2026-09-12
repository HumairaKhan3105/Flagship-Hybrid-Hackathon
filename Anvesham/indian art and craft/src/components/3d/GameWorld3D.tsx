import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  CraftRegion, 
  CulturalArtifact, 
  CharacterCustomization, 
  PlayerProfile 
} from '../../types';
import { sound } from '../../utils/soundEngine';

interface GameWorld3DProps {
  region: CraftRegion;
  profile: PlayerProfile;
  characterCustomization?: CharacterCustomization;
  onMeetArtisan: () => void;
  onEnterPaintingStudio: () => void;
  onEnterPatternPuzzle: () => void;
  onEnterQuiz: () => void;
  onDiscoverArtifact: (artifact: CulturalArtifact) => void;
}

export const GameWorld3D: React.FC<GameWorld3DProps> = ({
  region,
  profile,
  characterCustomization,
  onMeetArtisan,
  onEnterPaintingStudio,
  onEnterPatternPuzzle,
  onEnterQuiz,
  onDiscoverArtifact,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // Keyboard input state
  const keysRef = useRef<{ [key: string]: boolean }>({});
  // Virtual joystick state (for mobile touch)
  const joystickRef = useRef<{ active: boolean; moveX: number; moveY: number }>({
    active: false,
    moveX: 0,
    moveY: 0,
  });

  // Floating interaction prompt on HUD
  const [interactPrompt, setInteractPrompt] = useState<{
    actionType: 'TALK' | 'EXPLORE' | 'COLLECT' | 'PLAY' | 'CREATE';
    label: string;
    action: () => void;
  } | null>(null);

  // Stable callbacks
  const onMeetArtisanRef = useRef(onMeetArtisan);
  const onEnterPaintingStudioRef = useRef(onEnterPaintingStudio);
  const onEnterPatternPuzzleRef = useRef(onEnterPatternPuzzle);
  const onEnterQuizRef = useRef(onEnterQuiz);
  const onDiscoverArtifactRef = useRef(onDiscoverArtifact);

  useEffect(() => {
    onMeetArtisanRef.current = onMeetArtisan;
    onEnterPaintingStudioRef.current = onEnterPaintingStudio;
    onEnterPatternPuzzleRef.current = onEnterPatternPuzzle;
    onEnterQuizRef.current = onEnterQuiz;
    onDiscoverArtifactRef.current = onDiscoverArtifact;
  });

  // Setup Keyboard Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Main Three.js Scene Setup & Render Loop
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let animationFrameId: number;

    // --- SCENE, CAMERA, RENDERER ---
    const scene = new THREE.Scene();

    // Indian Warm Golden-Hour Fog & Sky
    scene.background = new THREE.Color(0xf6e5ca);
    scene.fog = new THREE.FogExp2(0xf6e5ca, 0.015);

    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    container.appendChild(renderer.domElement);

    // --- LIGHTING (Indian Golden Hour / Warm Sunlight) ---
    const ambientLight = new THREE.AmbientLight(0xffecd2, 0.9);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffb347, 1.8);
    sunLight.position.set(30, 45, 25);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 120;
    sunLight.shadow.camera.left = -30;
    sunLight.shadow.camera.right = 30;
    sunLight.shadow.camera.top = 30;
    sunLight.shadow.camera.bottom = -30;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    // Subtle blue-sky bounce fill
    const hemisphereLight = new THREE.HemisphereLight(0xfff7ed, 0x78350f, 0.4);
    scene.add(hemisphereLight);

    // --- GROUND (Indian Village Courtyard & Red-Earthy Soil) ---
    const groundGeo = new THREE.PlaneGeometry(80, 80, 40, 40);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0xc89666,
      roughness: 0.95,
      metalness: 0.05,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Decorative Traditional Aripana / Rangoli in Courtyard Center
    const rangoliCanvas = document.createElement('canvas');
    rangoliCanvas.width = 512;
    rangoliCanvas.height = 512;
    const rCtx = rangoliCanvas.getContext('2d');
    if (rCtx) {
      rCtx.fillStyle = 'rgba(255, 255, 255, 0.0)';
      rCtx.fillRect(0, 0, 512, 512);

      // Sacred Rice Paste (Pithar) White Rings and Motifs
      rCtx.strokeStyle = '#fef3c7';
      rCtx.lineWidth = 6;

      // Concentric sacred lotus rings
      for (let r = 50; r <= 230; r += 45) {
        rCtx.beginPath();
        rCtx.arc(256, 256, r, 0, Math.PI * 2);
        rCtx.stroke();
      }

      // 8 Lotus Petals
      for (let i = 0; i < 8; i++) {
        const ang = (i * Math.PI) / 4;
        const px = 256 + Math.cos(ang) * 140;
        const py = 256 + Math.sin(ang) * 140;
        rCtx.beginPath();
        rCtx.arc(px, py, 40, 0, Math.PI * 2);
        rCtx.fillStyle = '#dc2626';
        rCtx.fill();
        rCtx.stroke();
      }

      // Center sacred sun
      rCtx.beginPath();
      rCtx.arc(256, 256, 36, 0, Math.PI * 2);
      rCtx.fillStyle = '#f59e0b';
      rCtx.fill();
      rCtx.stroke();
    }
    const rangoliTexture = new THREE.CanvasTexture(rangoliCanvas);
    const rangoliGeo = new THREE.CircleGeometry(4.5, 32);
    const rangoliMat = new THREE.MeshStandardMaterial({
      map: rangoliTexture,
      transparent: true,
      roughness: 0.8,
    });
    const rangoliMesh = new THREE.Mesh(rangoliGeo, rangoliMat);
    rangoliMesh.rotation.x = -Math.PI / 2;
    rangoliMesh.position.set(0, 0.02, 0);
    rangoliMesh.receiveShadow = true;
    scene.add(rangoliMesh);

    // --- AUTHENTIC VILLAGE HUTS WITH THATched ROOFS & MURALS ---
    const createVillageHut = (
      x: number,
      z: number,
      rotY: number = 0,
      size: number = 1
    ) => {
      const hutGroup = new THREE.Group();
      hutGroup.position.set(x, 0, z);
      hutGroup.rotation.y = rotY;

      // Mud & Cow-Dung Washed Wall
      const wallGeo = new THREE.BoxGeometry(5 * size, 2.8 * size, 5.5 * size);
      const wallMat = new THREE.MeshStandardMaterial({
        color: 0xba8c63,
        roughness: 0.95,
      });
      const walls = new THREE.Mesh(wallGeo, wallMat);
      walls.position.y = (2.8 * size) / 2;
      walls.castShadow = true;
      walls.receiveShadow = true;
      hutGroup.add(walls);

      // Thatched Straw / Khaprail Roof
      const roofGeo = new THREE.ConeGeometry(4.2 * size, 2.2 * size, 4);
      const roofMat = new THREE.MeshStandardMaterial({
        color: 0x854d0e,
        roughness: 0.9,
      });
      const roof = new THREE.Mesh(roofGeo, roofMat);
      roof.position.y = 2.8 * size + (2.2 * size) / 2;
      roof.rotation.y = Math.PI / 4;
      roof.castShadow = true;
      hutGroup.add(roof);

      // Wooden Entrance Door
      const doorGeo = new THREE.PlaneGeometry(1.2 * size, 2.0 * size);
      const doorMat = new THREE.MeshStandardMaterial({
        color: 0x3e2723,
        roughness: 0.8,
      });
      const door = new THREE.Mesh(doorGeo, doorMat);
      door.position.set(0, (2.0 * size) / 2, (5.5 * size) / 2 + 0.02);
      hutGroup.add(door);

      // Hand-Painted Wall Mural (Madhubani / Warli motifs)
      const muralGeo = new THREE.PlaneGeometry(1.5 * size, 1.5 * size);
      const canvasTex = document.createElement('canvas');
      canvasTex.width = 128;
      canvasTex.height = 128;
      const ctx = canvasTex.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ba8c63';
        ctx.fillRect(0, 0, 128, 128);
        ctx.strokeStyle = '#fef3c7';
        ctx.lineWidth = 5;
        ctx.strokeRect(6, 6, 116, 116);
        ctx.beginPath();
        ctx.arc(64, 64, 28, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = '#dc2626';
        ctx.fill();
      }
      const muralTexture = new THREE.CanvasTexture(canvasTex);
      const muralMat = new THREE.MeshBasicMaterial({ map: muralTexture });
      const mural = new THREE.Mesh(muralGeo, muralMat);
      mural.position.set(2 * size, 2 * size, (5.5 * size) / 2 + 0.05);
      hutGroup.add(mural);

      scene.add(hutGroup);
    };

    // Spawn Indian Village Huts around the perimeter
    createVillageHut(-13, -9, Math.PI / 6, 1.2);
    createVillageHut(14, -10, -Math.PI / 5, 1.1);
    createVillageHut(-14, 12, Math.PI / 3, 1.0);
    createVillageHut(16, 14, -Math.PI / 4, 1.1);

    // --- ARTISAN WORKSHOP PAVILION ---
    const pavilionGroup = new THREE.Group();
    pavilionGroup.position.set(0, 0, -4);

    // Pavilion Roof
    const pavRoofGeo = new THREE.CylinderGeometry(0.5, 4.8, 1.6, 6);
    const pavRoofMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.6 });
    const pavRoof = new THREE.Mesh(pavRoofGeo, pavRoofMat);
    pavRoof.position.y = 4.2;
    pavRoof.castShadow = true;
    pavilionGroup.add(pavRoof);

    // Wooden Pillars
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const px = Math.cos(angle) * 3.6;
      const pz = Math.sin(angle) * 3.6;
      const pillarGeo = new THREE.CylinderGeometry(0.18, 0.22, 4.2, 8);
      const pillarMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.8 });
      const pillar = new THREE.Mesh(pillarGeo, pillarMat);
      pillar.position.set(px, 2.1, pz);
      pillar.castShadow = true;
      pavilionGroup.add(pillar);
    }

    // --- STATION 1: EASEL PAINTING STUDIO (In Pavilion) ---
    const easelGroup = new THREE.Group();
    easelGroup.position.set(1.5, 0, -1);
    const easelWoodMat = new THREE.MeshStandardMaterial({ color: 0x78350f });
    const leg1 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.4), easelWoodMat);
    leg1.position.set(-0.4, 1.2, 0);
    leg1.rotation.z = 0.15;
    const leg2 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.4), easelWoodMat);
    leg2.position.set(0.4, 1.2, 0);
    leg2.rotation.z = -0.15;
    const leg3 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.4), easelWoodMat);
    leg3.position.set(0, 1.2, -0.4);
    leg3.rotation.x = -0.2;
    easelGroup.add(leg1, leg2, leg3);

    // Canvas on easel
    const canvasGeo = new THREE.BoxGeometry(1.4, 1.1, 0.08);
    const canvasMat = new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.5 });
    const canvasMesh = new THREE.Mesh(canvasGeo, canvasMat);
    canvasMesh.position.set(0, 1.4, 0.05);
    canvasMesh.castShadow = true;
    easelGroup.add(canvasMesh);

    // Floating pulsing icon above easel
    const studioBeacon = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.32, 0),
      new THREE.MeshBasicMaterial({ color: 0xf59e0b })
    );
    studioBeacon.position.set(0, 2.5, 0);
    easelGroup.add(studioBeacon);

    pavilionGroup.add(easelGroup);
    scene.add(pavilionGroup);

    // --- STATION 2: SACRED PATTERN PUZZLE CRAFT TABLE ---
    const puzzleStationGroup = new THREE.Group();
    puzzleStationGroup.position.set(-6.5, 0, -2.5);

    // Wooden craft table
    const tableTop = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 0.2, 1.6),
      new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.7 })
    );
    tableTop.position.y = 1.0;
    tableTop.castShadow = true;
    puzzleStationGroup.add(tableTop);

    // 4 Table legs
    [[-0.9, -0.6], [0.9, -0.6], [-0.9, 0.6], [0.9, 0.6]].forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 1.0),
        new THREE.MeshStandardMaterial({ color: 0x2c1b10 })
      );
      leg.position.set(lx, 0.5, lz);
      puzzleStationGroup.add(leg);
    });

    // Incomplete pattern slab on table
    const slabMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.08, 1.0),
      new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.3, roughness: 0.4 })
    );
    slabMesh.position.set(0, 1.15, 0);
    puzzleStationGroup.add(slabMesh);

    // Floating puzzle icon beacon
    const puzzleBeacon = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.3, 0),
      new THREE.MeshBasicMaterial({ color: 0xd97706 })
    );
    puzzleBeacon.position.set(0, 2.2, 0);
    puzzleStationGroup.add(puzzleBeacon);

    scene.add(puzzleStationGroup);

    // --- STATION 3: CULTURAL QUIZ HERITAGE SHRINE / BELL ---
    const quizStationGroup = new THREE.Group();
    quizStationGroup.position.set(7.5, 0, -2.5);

    // Stone Pedestal
    const stoneBase = new THREE.Mesh(
      new THREE.CylinderGeometry(1.0, 1.2, 1.1, 8),
      new THREE.MeshStandardMaterial({ color: 0x57534e, roughness: 0.9 })
    );
    stoneBase.position.y = 0.55;
    stoneBase.castShadow = true;
    quizStationGroup.add(stoneBase);

    // Brass Temple Bell / Heritage Book
    const brassBell = new THREE.Mesh(
      new THREE.ConeGeometry(0.4, 0.7, 16),
      new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.8, roughness: 0.2 })
    );
    brassBell.position.y = 1.45;
    quizStationGroup.add(brassBell);

    // Floating quiz icon beacon
    const quizBeacon = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.3, 0),
      new THREE.MeshBasicMaterial({ color: 0xeab308 })
    );
    quizBeacon.position.set(0, 2.2, 0);
    quizStationGroup.add(quizBeacon);

    scene.add(quizStationGroup);

    // --- TREES (Indian Banyan, Mango & Neem Trees) ---
    const createTree = (tx: number, tz: number, scale: number = 1) => {
      const tree = new THREE.Group();
      tree.position.set(tx, 0, tz);

      const trunkGeo = new THREE.CylinderGeometry(0.35 * scale, 0.6 * scale, 3 * scale, 8);
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x3e2723, roughness: 0.9 });
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = (3 * scale) / 2;
      trunk.castShadow = true;
      tree.add(trunk);

      const foliageMat = new THREE.MeshStandardMaterial({
        color: 0x15803d,
        roughness: 0.7,
      });
      const fol1 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.8 * scale), foliageMat);
      fol1.position.y = 3.4 * scale;
      fol1.castShadow = true;
      tree.add(fol1);

      const fol2 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.4 * scale), foliageMat);
      fol2.position.set(0.6 * scale, 4.2 * scale, 0.4 * scale);
      fol2.castShadow = true;
      tree.add(fol2);

      scene.add(tree);
    };

    createTree(-9, 7, 1.3);
    createTree(10, 5, 1.2);
    createTree(-5, -14, 1.4);
    createTree(8, -16, 1.3);
    createTree(-18, -2, 1.1);
    createTree(19, 2, 1.2);

    // Terracotta pots & decorative brass urns around village
    const potGeo = new THREE.SphereGeometry(0.45, 12, 12);
    potGeo.scale(1, 1.2, 1);
    const potMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.7 });
    [
      [-2, 0.45, -2],
      [-2.8, 0.45, -1.8],
      [2.5, 0.45, -3],
      [-10, 0.45, -5],
    ].forEach(([px, py, pz]) => {
      const pot = new THREE.Mesh(potGeo, potMat);
      pot.position.set(px, py, pz);
      pot.castShadow = true;
      scene.add(pot);
    });

    // --- ARTISAN NPC (Shrimati Devi / Master Artist) ---
    const npcGroup = new THREE.Group();
    npcGroup.position.set(-1.2, 0, -3.2);

    // Artisan body (seated/standing master artist in traditional saree/kurta)
    const npcBodyGeo = new THREE.CylinderGeometry(0.3, 0.45, 1.4, 12);
    const npcBodyMat = new THREE.MeshStandardMaterial({ color: 0xb45309 });
    const npcBody = new THREE.Mesh(npcBodyGeo, npcBodyMat);
    npcBody.position.y = 0.7;
    npcBody.castShadow = true;
    npcGroup.add(npcBody);

    // Artisan head
    const npcHead = new THREE.Mesh(
      new THREE.SphereGeometry(0.28, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xa16207 })
    );
    npcHead.position.y = 1.6;
    npcHead.castShadow = true;
    npcGroup.add(npcHead);

    // Artisan hair / headdress
    const npcHair = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 12, 12),
      new THREE.MeshStandardMaterial({ color: 0x1c1917 })
    );
    npcHair.position.set(0, 1.68, -0.06);
    npcGroup.add(npcHair);

    // Glowing aura ring around Artisan
    const npcAura = new THREE.Mesh(
      new THREE.RingGeometry(0.6, 0.9, 24),
      new THREE.MeshBasicMaterial({
        color: 0xf59e0b,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
      })
    );
    npcAura.rotation.x = -Math.PI / 2;
    npcAura.position.y = 0.05;
    npcGroup.add(npcAura);

    // NPC Floating namaste icon
    const npcBeacon = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.25, 0),
      new THREE.MeshBasicMaterial({ color: 0xfacc15 })
    );
    npcBeacon.position.set(0, 2.3, 0);
    npcGroup.add(npcBeacon);

    scene.add(npcGroup);

    // --- 5 CULTURAL ARTIFACTS IN 3D ---
    const artifactMeshes: { id: string; mesh: THREE.Group; artifact: CulturalArtifact }[] = [];

    region.artifacts.forEach((art) => {
      const artGroup = new THREE.Group();
      artGroup.position.set(art.position3D[0], art.position3D[1], art.position3D[2]);

      // Core artifact shape
      const coreMesh = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.35, 0),
        new THREE.MeshStandardMaterial({
          color: new THREE.Color(art.color),
          emissive: new THREE.Color(art.color),
          emissiveIntensity: 0.4,
          roughness: 0.3,
        })
      );
      coreMesh.castShadow = true;
      artGroup.add(coreMesh);

      // Outer sparkling ring
      const ringMesh = new THREE.Mesh(
        new THREE.TorusGeometry(0.5, 0.03, 8, 24),
        new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.75 })
      );
      ringMesh.rotation.x = Math.PI / 2;
      artGroup.add(ringMesh);

      // Light beam / floor halo
      const haloMesh = new THREE.Mesh(
        new THREE.CircleGeometry(0.6, 16),
        new THREE.MeshBasicMaterial({
          color: new THREE.Color(art.color),
          transparent: true,
          opacity: 0.45,
          side: THREE.DoubleSide,
        })
      );
      haloMesh.rotation.x = -Math.PI / 2;
      haloMesh.position.y = -art.position3D[1] + 0.04;
      artGroup.add(haloMesh);

      scene.add(artGroup);
      artifactMeshes.push({ id: art.id, mesh: artGroup, artifact: art });
    });

    // --- 3D STUDENT PLAYER CHARACTER ---
    const playerGroup = new THREE.Group();
    playerGroup.position.set(0, 0, 4);

    const customization = profile?.customization || characterCustomization || {
      gender: 'male',
      skinTone: '#f59e0b',
      hairStyle: 'classic_crop',
      hairColor: '#18181b',
      outfit: 'kurta_stole',
      outfitColor: '#d97706',
      accessory: 'rudraksha',
      name: 'Aarav',
    };

    const outfitHex = customization.outfitColor || '#d97706';
    const skinHex = customization.skinTone || '#d4976a';
    const hairHex = customization.hairColor || '#1c1917';

    // Player Torso (Kurta / Attire)
    const torso = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.32, 0.9, 10),
      new THREE.MeshStandardMaterial({ color: new THREE.Color(outfitHex), roughness: 0.6 })
    );
    torso.position.y = 0.95;
    torso.castShadow = true;
    playerGroup.add(torso);

    // Player Head
    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.24, 16, 16),
      new THREE.MeshStandardMaterial({ color: new THREE.Color(skinHex) })
    );
    head.position.y = 1.62;
    head.castShadow = true;
    playerGroup.add(head);

    // Player Hair
    const hair = new THREE.Mesh(
      new THREE.SphereGeometry(0.26, 12, 12),
      new THREE.MeshStandardMaterial({ color: new THREE.Color(hairHex) })
    );
    hair.position.set(0, 1.7, -0.04);
    playerGroup.add(hair);

    // Limbs
    const legGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.8, 8);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x27272a });

    const leftLeg = new THREE.Mesh(legGeo, legMat);
    leftLeg.position.set(-0.16, 0.4, 0);
    leftLeg.castShadow = true;
    playerGroup.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, legMat);
    rightLeg.position.set(0.16, 0.4, 0);
    rightLeg.castShadow = true;
    playerGroup.add(rightLeg);

    const armGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.7, 8);
    const armMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(outfitHex) });

    const leftArm = new THREE.Mesh(armGeo, armMat);
    leftArm.position.set(-0.38, 1.05, 0);
    playerGroup.add(leftArm);

    const rightArm = new THREE.Mesh(armGeo, armMat);
    rightArm.position.set(0.38, 1.05, 0);
    playerGroup.add(rightArm);

    scene.add(playerGroup);

    // Camera initial position
    camera.position.set(0, 7, 12);
    camera.lookAt(playerGroup.position);

    // --- GAMEPLAY LOOP & CONTROLS ---
    let playerSpeed = 0.11;
    let walkCycle = 0;
    let isMoving = false;
    let cameraAngleY = 0;

    // Jump state
    let playerVelocityY = 0;
    let isGrounded = true;
    const gravity = -0.015;
    const jumpPower = 0.26;

    // Mouse drag camera orbit controls
    let isDragging = false;
    let prevMouseX = 0;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      cameraAngleY -= deltaX * 0.006;
      prevMouseX = e.clientX;
    };
    const handleMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Start background exploratory ambient sitar/bansuri music
    sound.startAmbientMusic('explore');

    // --- RENDER LOOP ---
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Input calculation
      let moveZ = 0;
      let moveX = 0;
      const keys = keysRef.current;

      // Sprint with Shift
      const isRunning = !!(keys['shift'] || keys['shiftleft'] || keys['shiftright']);
      playerSpeed = isRunning ? 0.20 : 0.11;

      // Jump with Space
      if ((keys[' '] || keys['space']) && isGrounded) {
        playerVelocityY = jumpPower;
        isGrounded = false;
        sound.playPuzzleSnap();
      }

      // Physics / Gravity
      if (!isGrounded) {
        playerVelocityY += gravity;
        playerGroup.position.y += playerVelocityY;
        if (playerGroup.position.y <= 0) {
          playerGroup.position.y = 0;
          playerVelocityY = 0;
          isGrounded = true;
        }
      }

      if (keys['w'] || keys['arrowup']) moveZ -= 1;
      if (keys['s'] || keys['arrowdown']) moveZ += 1;
      if (keys['a'] || keys['arrowleft']) moveX -= 1;
      if (keys['d'] || keys['arrowright']) moveX += 1;

      // Virtual joystick
      if (joystickRef.current.active) {
        moveX += joystickRef.current.moveX;
        moveZ += joystickRef.current.moveY;
      }

      isMoving = Math.abs(moveX) > 0.1 || Math.abs(moveZ) > 0.1;

      if (isMoving) {
        const len = Math.sqrt(moveX * moveX + moveZ * moveZ);
        const normX = (moveX / len) * playerSpeed;
        const normZ = (moveZ / len) * playerSpeed;

        const finalX = normX * Math.cos(cameraAngleY) + normZ * Math.sin(cameraAngleY);
        const finalZ = -normX * Math.sin(cameraAngleY) + normZ * Math.cos(cameraAngleY);

        playerGroup.position.x += finalX;
        playerGroup.position.z += finalZ;

        const targetRot = Math.atan2(finalX, finalZ);
        playerGroup.rotation.y = THREE.MathUtils.lerp(playerGroup.rotation.y, targetRot, 0.2);

        // Walk/Run cycle animation
        walkCycle += delta * (isRunning ? 18 : 12);
        leftLeg.rotation.x = Math.sin(walkCycle) * 0.6;
        rightLeg.rotation.x = -Math.sin(walkCycle) * 0.6;
        leftArm.rotation.x = -Math.sin(walkCycle) * 0.5;
        rightArm.rotation.x = Math.sin(walkCycle) * 0.5;
        torso.position.y = 0.95 + Math.abs(Math.sin(walkCycle * 2)) * 0.05;
      } else {
        // Idle breathing
        leftLeg.rotation.x = 0;
        rightLeg.rotation.x = 0;
        leftArm.rotation.x = 0;
        rightArm.rotation.x = 0;
        torso.position.y = 0.95 + Math.sin(elapsedTime * 2) * 0.02;
      }

      // Boundary limits
      playerGroup.position.x = THREE.MathUtils.clamp(playerGroup.position.x, -28, 28);
      playerGroup.position.z = THREE.MathUtils.clamp(playerGroup.position.z, -28, 28);

      // Third-person camera following
      const idealOffset = new THREE.Vector3(
        Math.sin(cameraAngleY) * 7.5,
        4.8,
        Math.cos(cameraAngleY) * 7.5
      );
      const targetCamPos = playerGroup.position.clone().add(idealOffset);
      camera.position.lerp(targetCamPos, 0.1);
      camera.lookAt(playerGroup.position.x, playerGroup.position.y + 1.2, playerGroup.position.z);

      // Rotate beacons
      studioBeacon.rotation.y += 0.02;
      puzzleBeacon.rotation.y += 0.02;
      quizBeacon.rotation.y += 0.02;
      npcBeacon.rotation.y += 0.02;
      npcBeacon.position.y = 2.3 + Math.sin(elapsedTime * 3) * 0.1;

      // Animate Artifacts
      artifactMeshes.forEach(({ mesh }) => {
        mesh.position.y = 0.4 + Math.sin(elapsedTime * 2.5 + mesh.position.x) * 0.15;
        mesh.rotation.y += 0.015;
      });

      // --- PROXIMITY DETECTION FOR HUD PROMPTS ---
      const pPos = playerGroup.position;

      // Distances to stations
      const distToNPC = pPos.distanceTo(npcGroup.position);
      const distToEasel = pPos.distanceTo(new THREE.Vector3(1.5, 0, -5));
      const distToPuzzle = pPos.distanceTo(new THREE.Vector3(-6.5, 0, -2.5));
      const distToQuiz = pPos.distanceTo(new THREE.Vector3(7.5, 0, -2.5));

      // Check nearest Artifact
      let nearestArtifact: CulturalArtifact | null = null;
      let minArtDist = 999;
      for (const { artifact, mesh } of artifactMeshes) {
        const d = pPos.distanceTo(mesh.position);
        if (d < 2.4 && d < minArtDist) {
          minArtDist = d;
          nearestArtifact = artifact;
        }
      }

      if (distToNPC < 2.8) {
        setInteractPrompt({
          actionType: 'TALK',
          label: `Talk to Artisan ${region.artisan.name}`,
          action: () => {
            sound.playClick();
            onMeetArtisanRef.current();
          },
        });
      } else if (distToEasel < 2.8) {
        setInteractPrompt({
          actionType: 'CREATE',
          label: `Paint in ${region.craftName} Studio`,
          action: () => {
            sound.playClick();
            onEnterPaintingStudioRef.current();
          },
        });
      } else if (distToPuzzle < 2.8) {
        setInteractPrompt({
          actionType: 'PLAY',
          label: 'Solve Sacred Pattern Puzzle',
          action: () => {
            sound.playClick();
            onEnterPatternPuzzleRef.current();
          },
        });
      } else if (distToQuiz < 2.8) {
        setInteractPrompt({
          actionType: 'EXPLORE',
          label: 'Test Knowledge in Cultural Quiz',
          action: () => {
            sound.playClick();
            onEnterQuizRef.current();
          },
        });
      } else if (nearestArtifact) {
        const art = nearestArtifact;
        setInteractPrompt({
          actionType: 'COLLECT',
          label: `Discover Artifact: ${art.name}`,
          action: () => {
            sound.playArtifactDiscovery();
            onDiscoverArtifactRef.current(art);
          },
        });
      } else {
        setInteractPrompt(null);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      sound.stopMusic();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [region.id, JSON.stringify(profile?.customization || characterCustomization)]);

  // Handle keyboard interaction [E]
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'e' && interactPrompt) {
        interactPrompt.action();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [interactPrompt]);

  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-[#1c120c] font-sans">
      {/* Three.js canvas container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating 3D Interaction Prompt Bar at Bottom */}
      {interactPrompt && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 pointer-events-auto animate-bounce-short">
          <button
            onClick={interactPrompt.action}
            className="flex items-center gap-3 px-6 py-3 bg-[#23150d] text-[#fdfbf7] font-bold rounded-full shadow-2xl border-2 border-[#d4af37] hover:scale-105 active:scale-95 transition-all text-sm sm:text-base glow-heritage"
          >
            <span className="bg-[#d4af37] text-[#1c120c] font-black px-2.5 py-0.5 rounded-md text-xs tracking-wider">
              [E] {interactPrompt.actionType}
            </span>
            <span className="text-[#fdfbf7]">{interactPrompt.label}</span>
          </button>
        </div>
      )}

      {/* Quick Action Navigation Hub (Bottom Right) */}
      <div className="absolute bottom-5 right-5 z-20 flex flex-wrap items-center gap-2">
        <button
          onClick={() => {
            sound.playClick();
            onEnterPaintingStudioRef.current();
          }}
          title="Open Painting Studio"
          className="flex items-center gap-2 px-3.5 py-2 bg-[#23150d]/90 hover:bg-[#3d2717] text-[#d4af37] rounded-xl shadow-lg backdrop-blur-sm border border-[#d4af37]/40 text-xs font-bold transition-transform hover:-translate-y-0.5 active:scale-95"
        >
          <span>🎨</span>
          <span className="hidden sm:inline">Painting Studio</span>
        </button>
        <button
          onClick={() => {
            sound.playClick();
            onEnterPatternPuzzleRef.current();
          }}
          title="Open Pattern Puzzle"
          className="flex items-center gap-2 px-3.5 py-2 bg-[#23150d]/90 hover:bg-[#3d2717] text-[#d4af37] rounded-xl shadow-lg backdrop-blur-sm border border-[#d4af37]/40 text-xs font-bold transition-transform hover:-translate-y-0.5 active:scale-95"
        >
          <span>🧩</span>
          <span className="hidden sm:inline">Pattern Puzzle</span>
        </button>
        <button
          onClick={() => {
            sound.playClick();
            onEnterQuizRef.current();
          }}
          title="Open Cultural Quiz"
          className="flex items-center gap-2 px-3.5 py-2 bg-[#23150d]/90 hover:bg-[#3d2717] text-[#d4af37] rounded-xl shadow-lg backdrop-blur-sm border border-[#d4af37]/40 text-xs font-bold transition-transform hover:-translate-y-0.5 active:scale-95"
        >
          <span>📜</span>
          <span className="hidden sm:inline">Cultural Quiz</span>
        </button>
      </div>

      {/* Controls Helper Pill (Bottom Left) */}
      <div className="absolute bottom-5 left-5 z-20 hidden md:flex items-center gap-3 px-4 py-2 bg-[#23150d]/85 backdrop-blur-md rounded-2xl border border-[#d4af37]/30 text-[11px] text-[#e6d7be] shadow-lg">
        <span><strong className="text-[#d4af37]">WASD / Arrows</strong> Walk</span>
        <span>•</span>
        <span><strong className="text-[#d4af37]">Shift</strong> Run</span>
        <span>•</span>
        <span><strong className="text-[#d4af37]">Space</strong> Jump</span>
        <span>•</span>
        <span><strong className="text-[#d4af37]">E</strong> Interact</span>
      </div>
    </div>
  );
};
