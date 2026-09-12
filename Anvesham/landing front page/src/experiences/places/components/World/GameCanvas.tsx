import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { useGameStore } from '../../store/gameStore';
import { InteractiveWorldObject, LocationId } from '../../types';
import { soundService } from '../../services/soundService';

interface GameCanvasProps {
  onInteractPrompt?: (obj: InteractiveWorldObject | null) => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    currentLocation,
    nearbyInteractiveObject,
    setNearbyInteractiveObject,
    interactWithCurrentObject,
    setActiveModal,
    useHint,
    screen
  } = useGameStore();

  // Mobile virtual joystick state
  const [touchActive, setTouchActive] = useState(false);
  const touchStartPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const touchDelta = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Camera & Player control references
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const isInteracting = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // --- THREE.JS SCENE SETUP ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xd7a15c); // Warm golden sunset sky
    scene.fog = new THREE.FogExp2(0xcf9552, 0.009);

    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // --- LIGHTING (Ancient Hampi Sunset) ---
    const ambientLight = new THREE.AmbientLight(0xffddaa, 0.65);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xff9944, 2.2);
    sunLight.position.set(120, 90, 80);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 400;
    sunLight.shadow.camera.left = -120;
    sunLight.shadow.camera.right = 120;
    sunLight.shadow.camera.top = 120;
    sunLight.shadow.camera.bottom = -120;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    const skyLight = new THREE.HemisphereLight(0xffcaa0, 0x5a3d28, 0.85);
    scene.add(skyLight);

    // Torch light points
    const createTorch = (x: number, y: number, z: number) => {
      const torchGroup = new THREE.Group();
      torchGroup.position.set(x, y, z);

      // Sconce
      const bracketGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.2, 8);
      const ironMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.9 });
      const bracket = new THREE.Mesh(bracketGeo, ironMat);
      bracket.position.y = 0.6;
      torchGroup.add(bracket);

      const fireBowlGeo = new THREE.ConeGeometry(0.25, 0.4, 8);
      const fireBowl = new THREE.Mesh(fireBowlGeo, ironMat);
      fireBowl.position.y = 1.2;
      fireBowl.rotation.x = Math.PI;
      torchGroup.add(fireBowl);

      // Flame
      const flameGeo = new THREE.SphereGeometry(0.2, 8, 8);
      const flameMat = new THREE.MeshBasicMaterial({ color: 0xffaa22 });
      const flame = new THREE.Mesh(flameGeo, flameMat);
      flame.position.y = 1.45;
      torchGroup.add(flame);

      const light = new THREE.PointLight(0xff7711, 2.5, 18, 1.5);
      light.position.y = 1.5;
      torchGroup.add(light);

      scene.add(torchGroup);
      return light;
    };

    const torches: THREE.PointLight[] = [
      createTorch(10, 0, -12),
      createTorch(-10, 0, -12),
      createTorch(62, 0, -35),
      createTorch(48, 0, -35),
      createTorch(152, 0, 15),
      createTorch(168, 0, 15),
      createTorch(152, 0, 25),
      createTorch(168, 0, 25)
    ];

    // --- ATMOSPHERIC DUST PARTICLES ---
    const particleCount = 450;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 300;
      particlePositions[i + 1] = Math.random() * 25 + 0.5;
      particlePositions[i + 2] = (Math.random() - 0.5) * 300;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xffdd88,
      size: 0.35,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });
    const dustParticles = new THREE.Points(particleGeo, particleMat);
    scene.add(dustParticles);

    // --- MATERIALS ---
    const sandstoneColor = 0xbda07a;
    const darkStoneColor = 0x7a634a;
    const ancientStoneMat = new THREE.MeshStandardMaterial({
      color: sandstoneColor,
      roughness: 0.88,
      metalness: 0.05
    });
    const carvedPlinthMat = new THREE.MeshStandardMaterial({
      color: darkStoneColor,
      roughness: 0.82,
      metalness: 0.1
    });
    const goldOrnamentMat = new THREE.MeshStandardMaterial({
      color: 0xe5a93b,
      roughness: 0.35,
      metalness: 0.8
    });
    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0xa98c68,
      roughness: 0.95,
      metalness: 0.02
    });

    // --- TERRAIN & ENVIRONMENT ---
    const groundGeo = new THREE.PlaneGeometry(600, 600, 48, 48);
    // Subtle undulation
    const posAttr = groundGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const vx = posAttr.getX(i);
      const vy = posAttr.getY(i);
      const d = Math.sqrt(vx * vx + vy * vy);
      const height = Math.sin(vx * 0.02) * 1.5 + Math.cos(vy * 0.02) * 1.2 + Math.sin(d * 0.04) * 0.8;
      posAttr.setZ(i, height);
    }
    groundGeo.computeVertexNormals();

    const ground = new THREE.Mesh(groundGeo, terrainMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Paved Stone Pathways between monuments
    const pathGeo = new THREE.BoxGeometry(12, 0.15, 280);
    const pathMat = new THREE.MeshStandardMaterial({ color: 0x9e8568, roughness: 0.9 });
    const mainAvenue = new THREE.Mesh(pathGeo, pathMat);
    mainAvenue.position.set(0, 0.08, 0);
    mainAvenue.receiveShadow = true;
    scene.add(mainAvenue);

    // Lateral walkway to Vitthala & Stone Chariot
    const vitPath = new THREE.Mesh(new THREE.BoxGeometry(180, 0.15, 10), pathMat);
    vitPath.position.set(80, 0.08, 0);
    vitPath.receiveShadow = true;
    scene.add(vitPath);

    // Boulder Crags (Iconic Hampi Granite Hills)
    const createGraniteCrag = (x: number, z: number, scale = 1) => {
      const cragGroup = new THREE.Group();
      cragGroup.position.set(x, 0, z);

      for (let i = 0; i < 6; i++) {
        const rad = (3 + Math.random() * 4) * scale;
        const boulderGeo = new THREE.DodecahedronGeometry(rad, 1);
        const boulder = new THREE.Mesh(boulderGeo, ancientStoneMat);
        boulder.position.set(
          (Math.random() - 0.5) * 8 * scale,
          rad * 0.6 + i * 1.8 * scale,
          (Math.random() - 0.5) * 8 * scale
        );
        boulder.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        boulder.castShadow = true;
        boulder.receiveShadow = true;
        cragGroup.add(boulder);
      }
      scene.add(cragGroup);
    };

    // Distant & perimeter boulders
    createGraniteCrag(-45, -70, 1.8);
    createGraniteCrag(-60, 50, 1.5);
    createGraniteCrag(90, -80, 2.2);
    createGraniteCrag(200, 70, 2.0);
    createGraniteCrag(110, 110, 1.6);
    createGraniteCrag(-30, 140, 1.9);

    // Palm trees
    const createPalmTree = (x: number, z: number) => {
      const treeGroup = new THREE.Group();
      treeGroup.position.set(x, 0, z);

      // Trunk
      const trunkGeo = new THREE.CylinderGeometry(0.3, 0.5, 9, 7);
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5a4430, roughness: 0.9 });
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 4.5;
      trunk.rotation.z = (Math.random() - 0.5) * 0.15;
      trunk.castShadow = true;
      treeGroup.add(trunk);

      // Fronds
      const frondMat = new THREE.MeshStandardMaterial({ color: 0x486b3a, roughness: 0.7, side: THREE.DoubleSide });
      for (let i = 0; i < 7; i++) {
        const frondGeo = new THREE.PlaneGeometry(1.6, 4.5);
        const frond = new THREE.Mesh(frondGeo, frondMat);
        frond.position.set(0, 9, 0);
        frond.rotation.y = (i / 7) * Math.PI * 2;
        frond.rotation.x = Math.PI / 3;
        frond.castShadow = true;
        treeGroup.add(frond);
      }
      scene.add(treeGroup);
    };

    createPalmTree(-18, -25);
    createPalmTree(18, -35);
    createPalmTree(35, -15);
    createPalmTree(85, 35);
    createPalmTree(135, 45);
    createPalmTree(45, 75);

    // ==========================================
    // MONUMENT 1: HAMPI BAZAAR (Position: [0, 0, 0])
    // ==========================================
    const bazaarGroup = new THREE.Group();
    bazaarGroup.position.set(0, 0, 0);

    // Double colonnade street
    const pillarGeo = new THREE.BoxGeometry(0.8, 4.5, 0.8);
    const roofBeamGeo = new THREE.BoxGeometry(1.2, 0.5, 5.5);
    const roofSlabGeo = new THREE.BoxGeometry(5.0, 0.35, 5.5);

    for (let side = -1; side <= 1; side += 2) {
      const xOffset = side * 14;
      for (let z = -60; z <= 60; z += 6) {
        // Front pillar
        const p1 = new THREE.Mesh(pillarGeo, ancientStoneMat);
        p1.position.set(xOffset, 2.25, z);
        p1.castShadow = true;
        bazaarGroup.add(p1);

        // Back pillar
        const p2 = new THREE.Mesh(pillarGeo, ancientStoneMat);
        p2.position.set(xOffset + side * 4, 2.25, z);
        p2.castShadow = true;
        bazaarGroup.add(p2);

        // Roof slab
        const roof = new THREE.Mesh(roofSlabGeo, ancientStoneMat);
        roof.position.set(xOffset + side * 2, 4.6, z);
        roof.castShadow = true;
        roof.receiveShadow = true;
        bazaarGroup.add(roof);

        // Merchant stone plinth / seat
        const seatGeo = new THREE.BoxGeometry(3.6, 0.6, 4.8);
        const seat = new THREE.Mesh(seatGeo, carvedPlinthMat);
        seat.position.set(xOffset + side * 2, 0.3, z);
        seat.receiveShadow = true;
        bazaarGroup.add(seat);
      }
    }
    scene.add(bazaarGroup);

    // ==========================================
    // MONUMENT 2: VIRUPAKSHA TEMPLE (Position: [55, 0, -40])
    // ==========================================
    const virupakshaGroup = new THREE.Group();
    virupakshaGroup.position.set(55, 0, -40);

    // 50-meter 9-tiered Rajagopuram
    const gopuramTiers = 7;
    for (let t = 0; t < gopuramTiers; t++) {
      const w = 22 - t * 2.2;
      const d = 14 - t * 1.4;
      const h = 4.2;
      const tierGeo = new THREE.BoxGeometry(w, h, d);
      const tier = new THREE.Mesh(tierGeo, ancientStoneMat);
      tier.position.y = 2.1 + t * h;
      tier.castShadow = true;
      tier.receiveShadow = true;
      virupakshaGroup.add(tier);

      // Cornice edge
      const corniceGeo = new THREE.BoxGeometry(w + 1.2, 0.6, d + 1.2);
      const cornice = new THREE.Mesh(corniceGeo, carvedPlinthMat);
      cornice.position.y = (t + 1) * h;
      cornice.castShadow = true;
      virupakshaGroup.add(cornice);
    }

    // Gopuram Golden Kalashas (Finials)
    for (let k = -2; k <= 2; k++) {
      const kalashaGeo = new THREE.ConeGeometry(0.45, 1.8, 8);
      const kalasha = new THREE.Mesh(kalashaGeo, goldOrnamentMat);
      kalasha.position.set(k * 2.2, 2.1 + gopuramTiers * 4.2 + 0.9, 0);
      virupakshaGroup.add(kalasha);
    }

    // Temple Gateway portal archway
    const gateOpeningGeo = new THREE.BoxGeometry(5.5, 6.0, 16);
    const gateOpeningMat = new THREE.MeshBasicMaterial({ color: 0x110c08 });
    const gate = new THREE.Mesh(gateOpeningGeo, gateOpeningMat);
    gate.position.set(0, 3.0, 0);
    virupakshaGroup.add(gate);

    // Ranga Mandapa hypostyle hall behind gopuram
    const mandapaFloor = new THREE.Mesh(new THREE.BoxGeometry(32, 1.0, 28), carvedPlinthMat);
    mandapaFloor.position.set(0, 0.5, -24);
    mandapaFloor.receiveShadow = true;
    virupakshaGroup.add(mandapaFloor);

    for (let mx = -12; mx <= 12; mx += 6) {
      for (let mz = -34; mz <= -14; mz += 5) {
        const mp = new THREE.Mesh(pillarGeo, ancientStoneMat);
        mp.position.set(mx, 3.25, mz);
        mp.castShadow = true;
        virupakshaGroup.add(mp);
      }
    }
    const mandapaRoof = new THREE.Mesh(new THREE.BoxGeometry(34, 0.8, 30), ancientStoneMat);
    mandapaRoof.position.set(0, 6.0, -24);
    mandapaRoof.castShadow = true;
    virupakshaGroup.add(mandapaRoof);

    scene.add(virupakshaGroup);

    // ==========================================
    // MONUMENT 3 & 4: VITTHALA TEMPLE & THE STONE CHARIOT
    // Position: [160, 0, 20]
    // ==========================================
    const vitthalaGroup = new THREE.Group();
    vitthalaGroup.position.set(120, 0, 25);

    // Vitthala Maha Mandapa (Musical Pillars Hall)
    const vFloor = new THREE.Mesh(new THREE.BoxGeometry(42, 1.2, 36), carvedPlinthMat);
    vFloor.position.set(0, 0.6, 0);
    vFloor.receiveShadow = true;
    vitthalaGroup.add(vFloor);

    // 56 Musical Pillar clusters
    for (let px = -16; px <= 16; px += 8) {
      for (let pz = -14; pz <= 14; pz += 7) {
        const clusterGroup = new THREE.Group();
        clusterGroup.position.set(px, 1.2, pz);

        // Center column
        const cCol = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 5.5, 8), ancientStoneMat);
        cCol.position.y = 2.75;
        cCol.castShadow = true;
        clusterGroup.add(cCol);

        // Slender resonant colonnettes around center
        for (let s = 0; s < 4; s++) {
          const colAngle = (s / 4) * Math.PI * 2;
          const sCol = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 5.2, 6), carvedPlinthMat);
          sCol.position.set(Math.cos(colAngle) * 0.75, 2.75, Math.sin(colAngle) * 0.75);
          sCol.castShadow = true;
          clusterGroup.add(sCol);
        }
        vitthalaGroup.add(clusterGroup);
      }
    }
    const vRoof = new THREE.Mesh(new THREE.BoxGeometry(44, 0.9, 38), ancientStoneMat);
    vRoof.position.set(0, 7.1, 0);
    vRoof.castShadow = true;
    vitthalaGroup.add(vRoof);
    scene.add(vitthalaGroup);

    // --- THE STONE CHARIOT (KALLINA RATHA) ---
    // Position: [160, 0, 20]
    const chariotGroup = new THREE.Group();
    chariotGroup.position.set(160, 0, 20);

    // Chariot Raised Plinth
    const chPlinth = new THREE.Mesh(new THREE.BoxGeometry(9.0, 1.2, 11.0), carvedPlinthMat);
    chPlinth.position.y = 0.6;
    chPlinth.receiveShadow = true;
    chPlinth.castShadow = true;
    chariotGroup.add(chPlinth);

    // Chariot Main Body / Carriage Box
    const chBody = new THREE.Mesh(new THREE.BoxGeometry(6.8, 3.8, 8.4), ancientStoneMat);
    chBody.position.y = 3.1;
    chBody.castShadow = true;
    chariotGroup.add(chBody);

    // Garuda Shrine Inner Sanctum Door
    const sanctumOpening = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 2.8, 0.4),
      new THREE.MeshBasicMaterial({ color: 0x181008 })
    );
    sanctumOpening.position.set(0, 3.0, 4.21);
    chariotGroup.add(sanctumOpening);

    // Central Secret Mechanical Seal Core (Glows!)
    const coreGlowMat = new THREE.MeshStandardMaterial({
      color: 0xffb833,
      emissive: 0xdd7700,
      emissiveIntensity: 0.8,
      roughness: 0.2
    });
    const secretCore = new THREE.Mesh(new THREE.OctahedronGeometry(0.65, 0), coreGlowMat);
    secretCore.position.set(0, 3.0, 4.0);
    chariotGroup.add(secretCore);

    // Chariot Tiered Dravidian Vimana Tower Roof
    const vimana1 = new THREE.Mesh(new THREE.BoxGeometry(5.4, 1.4, 6.8), ancientStoneMat);
    vimana1.position.y = 5.7;
    vimana1.castShadow = true;
    chariotGroup.add(vimana1);

    const vimana2 = new THREE.Mesh(new THREE.BoxGeometry(3.8, 1.2, 5.0), ancientStoneMat);
    vimana2.position.y = 7.0;
    vimana2.castShadow = true;
    chariotGroup.add(vimana2);

    const vimanaDome = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.8, 1.4, 12), carvedPlinthMat);
    vimanaDome.position.y = 8.3;
    chariotGroup.add(vimanaDome);

    const chKalasha = new THREE.Mesh(new THREE.ConeGeometry(0.4, 1.2, 8), goldOrnamentMat);
    chKalasha.position.y = 9.5;
    chariotGroup.add(chKalasha);

    // 4 Concentric Giant Stone Wheels
    const wheels: THREE.Mesh[] = [];
    const wheelOffsets = [
      { x: -4.5, z: 2.8 },
      { x: 4.5, z: 2.8 },
      { x: -4.5, z: -2.8 },
      { x: 4.5, z: -2.8 }
    ];

    wheelOffsets.forEach(({ x, z }) => {
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(x, 1.3, z);

      // Outer tire & rim
      const wheelGeo = new THREE.CylinderGeometry(1.3, 1.3, 0.45, 24);
      const wheel = new THREE.Mesh(wheelGeo, carvedPlinthMat);
      wheel.rotation.z = Math.PI / 2;
      wheel.castShadow = true;
      wheelGroup.add(wheel);

      // Ornate hub medallion
      const hubGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.65, 12);
      const hub = new THREE.Mesh(hubGeo, goldOrnamentMat);
      hub.rotation.z = Math.PI / 2;
      wheelGroup.add(hub);

      chariotGroup.add(wheelGroup);
      wheels.push(wheel);
    });

    // Twin Elephant Guardians in Front
    for (let elSide = -1; elSide <= 1; elSide += 2) {
      const elephantGroup = new THREE.Group();
      elephantGroup.position.set(elSide * 2.2, 0.6, 5.6);

      const elBody = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.4, 2.2), carvedPlinthMat);
      elBody.position.y = 0.7;
      elBody.castShadow = true;
      elephantGroup.add(elBody);

      const elHead = new THREE.Mesh(new THREE.SphereGeometry(0.65, 8, 8), carvedPlinthMat);
      elHead.position.set(0, 1.3, 1.0);
      elephantGroup.add(elHead);

      const trunkGeo = new THREE.CylinderGeometry(0.18, 0.12, 1.2, 6);
      const elTrunk = new THREE.Mesh(trunkGeo, carvedPlinthMat);
      elTrunk.position.set(0, 0.8, 1.5);
      elTrunk.rotation.x = Math.PI / 5;
      elephantGroup.add(elTrunk);

      chariotGroup.add(elephantGroup);
    }

    scene.add(chariotGroup);

    // ==========================================
    // MONUMENT 5: LOTUS MAHAL (Position: [60, 0, 85])
    // ==========================================
    const lotusGroup = new THREE.Group();
    lotusGroup.position.set(60, 0, 85);

    const lmPlinth = new THREE.Mesh(new THREE.BoxGeometry(22, 1.2, 22), carvedPlinthMat);
    lmPlinth.position.y = 0.6;
    lmPlinth.receiveShadow = true;
    lotusGroup.add(lmPlinth);

    // Two tiers of arched pavilions
    const lmTier1 = new THREE.Mesh(new THREE.BoxGeometry(16, 4.5, 16), ancientStoneMat);
    lmTier1.position.y = 3.45;
    lmTier1.castShadow = true;
    lotusGroup.add(lmTier1);

    const lmTier2 = new THREE.Mesh(new THREE.BoxGeometry(10, 3.8, 10), ancientStoneMat);
    lmTier2.position.y = 7.6;
    lmTier2.castShadow = true;
    lotusGroup.add(lmTier2);

    // Stepped pyramidal lotus petal roofs
    for (let r = 0; r < 3; r++) {
      const rRoof = new THREE.Mesh(new THREE.ConeGeometry(5.5 - r * 1.2, 1.8, 8), carvedPlinthMat);
      rRoof.position.y = 10.2 + r * 1.4;
      lotusGroup.add(rRoof);
    }
    scene.add(lotusGroup);

    // ==========================================
    // MONUMENT 6: ROYAL ENCLOSURE & MAHANAVAMI DIBBA ([10, 0, 110])
    // ==========================================
    const royalGroup = new THREE.Group();
    royalGroup.position.set(10, 0, 110);

    // Massive 3-tiered ceremonial victory platform
    const dibba1 = new THREE.Mesh(new THREE.BoxGeometry(34, 3.0, 34), carvedPlinthMat);
    dibba1.position.y = 1.5;
    dibba1.receiveShadow = true;
    dibba1.castShadow = true;
    royalGroup.add(dibba1);

    const dibba2 = new THREE.Mesh(new THREE.BoxGeometry(26, 2.5, 26), ancientStoneMat);
    dibba2.position.y = 4.25;
    dibba2.castShadow = true;
    royalGroup.add(dibba2);

    const dibba3 = new THREE.Mesh(new THREE.BoxGeometry(18, 2.0, 18), carvedPlinthMat);
    dibba3.position.y = 6.5;
    dibba3.castShadow = true;
    royalGroup.add(dibba3);

    // Geometric Pushkarani (Stepped Tank) beside platform
    const tankGroup = new THREE.Group();
    tankGroup.position.set(-28, 0, 0);
    const tankRim = new THREE.Mesh(new THREE.BoxGeometry(20, 0.4, 20), carvedPlinthMat);
    tankRim.position.y = 0.2;
    tankGroup.add(tankRim);
    const tankWater = new THREE.Mesh(
      new THREE.PlaneGeometry(16, 16),
      new THREE.MeshStandardMaterial({ color: 0x1f5f6b, roughness: 0.1, metalness: 0.6 })
    );
    tankWater.rotation.x = -Math.PI / 2;
    tankWater.position.y = 0.05;
    tankGroup.add(tankWater);
    royalGroup.add(tankGroup);

    scene.add(royalGroup);

    // ==========================================
    // THIRD-PERSON HERITAGE EXPLORER CHARACTER
    // ==========================================
    const playerGroup = new THREE.Group();
    playerGroup.position.set(0, 0, 0);

    // Explorer Model Body Parts
    // Legs
    const legGeo = new THREE.CylinderGeometry(0.18, 0.15, 1.2, 8);
    const pantsMat = new THREE.MeshStandardMaterial({ color: 0x47392b, roughness: 0.8 }); // Khaki cargo
    const leftLeg = new THREE.Mesh(legGeo, pantsMat);
    leftLeg.position.set(-0.25, 0.6, 0);
    leftLeg.castShadow = true;
    playerGroup.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, pantsMat);
    rightLeg.position.set(0.25, 0.6, 0);
    rightLeg.castShadow = true;
    playerGroup.add(rightLeg);

    // Torso & Field Jacket
    const jacketMat = new THREE.MeshStandardMaterial({ color: 0x8a6d4e, roughness: 0.75 });
    const torsoGeo = new THREE.BoxGeometry(0.75, 1.1, 0.45);
    const torso = new THREE.Mesh(torsoGeo, jacketMat);
    torso.position.set(0, 1.75, 0);
    torso.castShadow = true;
    playerGroup.add(torso);

    // Explorer Field Backpack
    const packMat = new THREE.MeshStandardMaterial({ color: 0x362c21, roughness: 0.9 });
    const packGeo = new THREE.BoxGeometry(0.65, 0.85, 0.35);
    const backpack = new THREE.Mesh(packGeo, packMat);
    backpack.position.set(0, 1.8, -0.36);
    backpack.castShadow = true;
    playerGroup.add(backpack);

    // Bedroll on top of backpack
    const rollGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.7, 8);
    const rollMat = new THREE.MeshStandardMaterial({ color: 0xb58a53, roughness: 0.8 });
    const bedroll = new THREE.Mesh(rollGeo, rollMat);
    bedroll.rotation.z = Math.PI / 2;
    bedroll.position.set(0, 2.35, -0.36);
    playerGroup.add(bedroll);

    // Arms
    const armGeo = new THREE.CylinderGeometry(0.13, 0.11, 1.0, 8);
    const leftArm = new THREE.Mesh(armGeo, jacketMat);
    leftArm.position.set(-0.52, 1.7, 0);
    leftArm.castShadow = true;
    playerGroup.add(leftArm);

    const rightArm = new THREE.Mesh(armGeo, jacketMat);
    rightArm.position.set(0.52, 1.7, 0);
    rightArm.castShadow = true;
    playerGroup.add(rightArm);

    // Head
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xd9a47a, roughness: 0.6 });
    const headGeo = new THREE.SphereGeometry(0.28, 12, 12);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.set(0, 2.55, 0);
    head.castShadow = true;
    playerGroup.add(head);

    // Explorer Fedora Hat
    const hatMat = new THREE.MeshStandardMaterial({ color: 0x423223, roughness: 0.8 });
    const brimGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.05, 16);
    const brim = new THREE.Mesh(brimGeo, hatMat);
    brim.position.set(0, 2.75, 0);
    playerGroup.add(brim);

    const crownGeo = new THREE.CylinderGeometry(0.3, 0.33, 0.35, 16);
    const crown = new THREE.Mesh(crownGeo, hatMat);
    crown.position.set(0, 2.92, 0);
    crown.castShadow = true;
    playerGroup.add(crown);

    // Player Shadow disk on ground
    const shadowGeo = new THREE.CircleGeometry(0.65, 16);
    const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.35 });
    const playerShadow = new THREE.Mesh(shadowGeo, shadowMat);
    playerShadow.rotation.x = -Math.PI / 2;
    playerShadow.position.y = 0.05;
    playerGroup.add(playerShadow);

    scene.add(playerGroup);

    // ==========================================
    // INTERACTIVE OBJECTS IN THE 3D WORLD
    // ==========================================
    const interactiveObjectsList: InteractiveWorldObject[] = [
      {
        id: 'chest_bazaar',
        title: 'Ancient Stone Merchant Chest',
        type: 'clue',
        position: [0, 0.5, -8],
        interactionRadius: 4.5,
        promptText: 'Inspect Merchant Chest',
        associatedClueId: 'clue_map_fragment'
      },
      {
        id: 'coin_bazaar',
        title: 'Varaha Gold Seal Plinth',
        type: 'clue',
        position: [12, 0.6, 5],
        interactionRadius: 4.5,
        promptText: 'Examine Imperial Coin',
        associatedClueId: 'clue_merchant_seal'
      },
      {
        id: 'pillar_virupaksha',
        title: 'Gopuram Inversion Mandapa',
        type: 'puzzle_trigger',
        position: [55, 0.5, -45],
        interactionRadius: 6.0,
        promptText: 'Inspect Architectural Frieze',
        associatedPuzzleId: 'puzzle_architecture',
        associatedClueId: 'clue_gopuram_cipher'
      },
      {
        id: 'altar_virupaksha',
        title: 'Sacred Sanctum Altar',
        type: 'clue',
        position: [55, 0.5, -30],
        interactionRadius: 5.0,
        promptText: 'Inspect Sacred Altar',
        associatedClueId: 'clue_royal_seal'
      },
      {
        id: 'musical_pillars',
        title: 'Sa-Re-Ga-Ma Resonator Pillar',
        type: 'clue',
        position: [116, 0.5, 20],
        interactionRadius: 5.0,
        promptText: 'Listen to Acoustic Resonator',
        associatedClueId: 'clue_musical_notes'
      },
      {
        id: 'inscription_slab',
        title: '1516 CE Kannada Royal Stele',
        type: 'puzzle_trigger',
        position: [125, 0.5, 32],
        interactionRadius: 5.5,
        promptText: 'Decode Stone Inscription',
        associatedPuzzleId: 'puzzle_inscription',
        associatedClueId: 'clue_stone_inscription'
      },
      {
        id: 'chariot_wheel',
        title: 'Rotating Granite Wheel Hub',
        type: 'clue',
        position: [156, 0.5, 18],
        interactionRadius: 5.0,
        promptText: 'Examine Chariot Wheel Mechanism',
        associatedClueId: 'clue_chariot_quadrant'
      },
      {
        id: 'chariot_altar',
        title: 'Stone Chariot Garuda Altar',
        type: 'puzzle_trigger',
        position: [160, 0.5, 24],
        interactionRadius: 6.0,
        promptText: 'Activate Chariot Mystery Mechanism',
        associatedPuzzleId: 'puzzle_stone_chariot',
        associatedClueId: 'clue_final_decree'
      },
      {
        id: 'lotus_arch',
        title: 'Zenana Royal Water Conduits',
        type: 'puzzle_trigger',
        position: [60, 0.5, 85],
        interactionRadius: 6.0,
        promptText: 'Consult Royal Timeline Archive',
        associatedPuzzleId: 'puzzle_timeline'
      }
    ];

    // Visual 3D markers above interactive objects
    const beaconRings: THREE.Mesh[] = [];
    interactiveObjectsList.forEach(obj => {
      // Golden glowing ring beacon on ground
      const ringGeo = new THREE.RingGeometry(0.9, 1.3, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xffbb33,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.75
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(obj.position[0], 0.12, obj.position[2]);
      scene.add(ring);
      beaconRings.push(ring);

      // Spinning floating diamond crystal beacon
      const beaconGeo = new THREE.OctahedronGeometry(0.35, 0);
      const beaconMat = new THREE.MeshStandardMaterial({
        color: 0xffcc44,
        emissive: 0xaa7700,
        emissiveIntensity: 0.7,
        roughness: 0.2
      });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.set(obj.position[0], 2.2, obj.position[2]);
      scene.add(beacon);
      beaconRings.push(beacon);
    });

    // --- KEYBOARD CONTROLS ---
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = true;
      keysPressed.current[e.code] = true;

      // Quick hotkeys
      if (e.key === 'm' || e.key === 'M') {
        setActiveModal(useGameStore.getState().activeModal === 'map' ? null : 'map');
      } else if (e.key === 'i' || e.key === 'I' || e.key === 'j' || e.key === 'J') {
        setActiveModal(useGameStore.getState().activeModal === 'journal' ? null : 'journal');
      } else if (e.key === 'h' || e.key === 'H') {
        useHint();
      } else if (e.key === 'e' || e.key === 'E') {
        interactWithCurrentObject();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = false;
      keysPressed.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Mouse camera orbit drag controls
    let isMouseDown = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let cameraYaw = 0;
    let cameraPitch = 0.28; // slightly looking down
    let cameraDistance = 8.5;

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0 || e.button === 2) {
        isMouseDown = true;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isMouseDown) return;
      const dx = e.clientX - prevMouseX;
      const dy = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      cameraYaw -= dx * 0.005;
      cameraPitch = Math.max(0.05, Math.min(Math.PI / 2.5, cameraPitch + dy * 0.005));
    };

    const handleMouseUp = () => {
      isMouseDown = false;
    };

    const handleWheel = (e: WheelEvent) => {
      cameraDistance = Math.max(4.5, Math.min(18.0, cameraDistance + e.deltaY * 0.008));
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('wheel', handleWheel, { passive: true });

    // --- GAME TICK & ANIMATION LOOP ---
    let animationFrameId: number;
    let lastTime = performance.now();
    let walkCycle = 0;
    let playerVelocityY = 0;
    let isJumping = false;
    let playerFacingAngle = 0;
    let footstepCooldown = 0;

    // Synchronize initial position from store
    const initialPos = useGameStore.getState().playerPosition;
    playerGroup.position.set(initialPos[0], 0, initialPos[2]);

    const animate = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      // Animate dust particles
      const positions = dustParticles.geometry.attributes.position.array as Float32Array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] -= delta * 0.4;
        if (positions[i] < 0.2) positions[i] = 25;
      }
      dustParticles.geometry.attributes.position.needsUpdate = true;

      // Animate torch flickers
      torches.forEach((torch, idx) => {
        torch.intensity = 2.2 + Math.sin(currentTime * 0.008 + idx * 1.5) * 0.45;
      });

      // Animate Chariot secret core
      secretCore.rotation.y += delta * 1.2;
      secretCore.rotation.x += delta * 0.6;

      // Animate beacon rings & crystals
      beaconRings.forEach((b, idx) => {
        if (b.type === 'Mesh' && b.geometry instanceof THREE.OctahedronGeometry) {
          b.rotation.y += delta * 1.8;
          b.position.y = 2.2 + Math.sin(currentTime * 0.004 + idx) * 0.25;
        } else if (b.geometry instanceof THREE.RingGeometry) {
          const scale = 1 + Math.sin(currentTime * 0.005 + idx) * 0.08;
          b.scale.set(scale, scale, 1);
        }
      });

      // --- PLAYER MOVEMENT CALCULATIONS ---
      let moveForward = 0;
      let moveRight = 0;
      const keys = keysPressed.current;

      if (keys['w'] || keys['arrowup'] || keys['KeyW']) moveForward += 1;
      if (keys['s'] || keys['arrowdown'] || keys['KeyS']) moveForward -= 1;
      if (keys['a'] || keys['arrowleft'] || keys['KeyA']) moveRight -= 1;
      if (keys['d'] || keys['arrowright'] || keys['KeyD']) moveRight += 1;

      // Virtual touch delta integration
      if (touchDelta.current.x !== 0 || touchDelta.current.y !== 0) {
        moveRight += touchDelta.current.x;
        moveForward -= touchDelta.current.y;
      }

      const isSprinting = keys['shift'] || keys['ShiftLeft'] || keys['ShiftRight'];
      const isMoving = Math.abs(moveForward) > 0.05 || Math.abs(moveRight) > 0.05;
      const speed = (isSprinting ? 8.5 : 5.0) * delta;

      if (isMoving) {
        // Calculate movement relative to camera orientation
        const inputAngle = Math.atan2(moveRight, moveForward);
        const targetFacing = cameraYaw + inputAngle;

        // Smooth player rotation
        playerFacingAngle = THREE.MathUtils.lerp(playerFacingAngle, targetFacing, 0.2);
        playerGroup.rotation.y = playerFacingAngle;

        // Move player
        const dx = Math.sin(cameraYaw + inputAngle) * speed;
        const dz = Math.cos(cameraYaw + inputAngle) * speed;

        playerGroup.position.x += dx;
        playerGroup.position.z += dz;

        // Walk cycle animation
        walkCycle += delta * (isSprinting ? 14 : 9);
        leftLeg.rotation.x = Math.sin(walkCycle) * 0.65;
        rightLeg.rotation.x = -Math.sin(walkCycle) * 0.65;
        leftArm.rotation.x = -Math.sin(walkCycle) * 0.6;
        rightArm.rotation.x = Math.sin(walkCycle) * 0.6;
        torso.position.y = 1.75 + Math.abs(Math.sin(walkCycle * 2)) * 0.08;

        // Footstep sounds
        footstepCooldown -= delta;
        if (footstepCooldown <= 0) {
          soundService.playFootstep();
          footstepCooldown = isSprinting ? 0.28 : 0.42;
        }
      } else {
        // Idle breathing animation
        leftLeg.rotation.x = THREE.MathUtils.lerp(leftLeg.rotation.x, 0, 0.15);
        rightLeg.rotation.x = THREE.MathUtils.lerp(rightLeg.rotation.x, 0, 0.15);
        leftArm.rotation.x = THREE.MathUtils.lerp(leftArm.rotation.x, 0, 0.15);
        rightArm.rotation.x = THREE.MathUtils.lerp(rightArm.rotation.x, 0, 0.15);
        torso.position.y = 1.75 + Math.sin(currentTime * 0.003) * 0.03;
      }

      // Jump Physics
      if ((keys[' '] || keys['Space']) && !isJumping) {
        isJumping = true;
        playerVelocityY = 6.8;
      }
      if (isJumping) {
        playerVelocityY -= 18.0 * delta;
        playerGroup.position.y += playerVelocityY * delta;
        if (playerGroup.position.y <= 0) {
          playerGroup.position.y = 0;
          isJumping = false;
          playerVelocityY = 0;
        }
      }

      // --- SMOOTH THIRD-PERSON CAMERA FOLLOW ---
      const targetCamX = playerGroup.position.x - Math.sin(cameraYaw) * Math.cos(cameraPitch) * cameraDistance;
      const targetCamY = playerGroup.position.y + Math.sin(cameraPitch) * cameraDistance + 2.0;
      const targetCamZ = playerGroup.position.z - Math.cos(cameraYaw) * Math.cos(cameraPitch) * cameraDistance;

      camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetCamX, 0.12);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetCamY, 0.12);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetCamZ, 0.12);

      const lookTarget = new THREE.Vector3(
        playerGroup.position.x,
        playerGroup.position.y + 1.8,
        playerGroup.position.z
      );
      camera.lookAt(lookTarget);

      // --- PROXIMITY DETECTION WITH INTERACTIVE OBJECTS ---
      let closestObj: InteractiveWorldObject | null = null;
      let minDistance = 999;

      interactiveObjectsList.forEach(obj => {
        const dist = Math.sqrt(
          Math.pow(playerGroup.position.x - obj.position[0], 2) +
          Math.pow(playerGroup.position.z - obj.position[2], 2)
        );
        if (dist <= obj.interactionRadius && dist < minDistance) {
          minDistance = dist;
          closestObj = obj;
        }
      });

      setNearbyInteractiveObject(closestObj);

      // Render
      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Responsive window resize observer
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width && height) {
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
        }
      }
    });
    resizeObserver.observe(container);

    // CLEANUP
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('wheel', handleWheel);
      resizeObserver.disconnect();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Listen to teleport/travel requests from store
  useEffect(() => {
    // When player teleports to a monument via map
    // The player's position in store will trigger if needed
  }, [currentLocation]);

  // Touch Virtual Joystick Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartPos.current = { x: touch.clientX, y: touch.clientY };
    touchDelta.current = { x: 0, y: 0 };
    setTouchActive(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchActive) return;
    const touch = e.touches[0];
    const dx = (touch.clientX - touchStartPos.current.x) / 50;
    const dy = (touch.clientY - touchStartPos.current.y) / 50;
    const clampedX = Math.max(-1, Math.min(1, dx));
    const clampedY = Math.max(-1, Math.min(1, dy));
    touchDelta.current = { x: clampedX, y: clampedY };
  };

  const handleTouchEnd = () => {
    touchDelta.current = { x: 0, y: 0 };
    setTouchActive(false);
  };

  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-stone-950">
      {/* Three.js canvas container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Interaction Prompt */}
      {nearbyInteractiveObject && (
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
          <button
            onClick={interactWithCurrentObject}
            className="flex items-center gap-3 px-6 py-3 bg-stone-900/90 hover:bg-amber-950/90 text-amber-300 border border-amber-500/60 rounded-full box-gold-glow backdrop-blur-md shadow-2xl transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-500 text-stone-950 font-bold text-sm shadow-md animate-pulse">
              E
            </span>
            <span className="font-serif font-semibold tracking-wide text-sm sm:text-base text-amber-100">
              {nearbyInteractiveObject.promptText || 'INTERACT'}
            </span>
          </button>
        </div>
      )}

      {/* Mobile Touch Joystick Overlay */}
      <div
        className="md:hidden absolute bottom-6 left-6 w-32 h-32 rounded-full border-2 border-amber-500/30 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center z-20 touch-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className={`w-12 h-12 rounded-full bg-amber-500/60 border border-amber-300 transition-transform ${
            touchActive ? 'scale-110' : ''
          }`}
          style={{
            transform: `translate(${touchDelta.current.x * 25}px, ${touchDelta.current.y * 25}px)`
          }}
        />
      </div>

      {/* Mobile Quick Action Buttons */}
      <div className="md:hidden absolute bottom-6 right-6 flex flex-col gap-3 z-20">
        {nearbyInteractiveObject && (
          <button
            onClick={interactWithCurrentObject}
            className="w-14 h-14 rounded-full bg-amber-500 text-stone-950 font-bold text-lg shadow-lg flex items-center justify-center border-2 border-amber-200 active:scale-95"
          >
            E
          </button>
        )}
      </div>
    </div>
  );
};
