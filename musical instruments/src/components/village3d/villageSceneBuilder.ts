import * as THREE from 'three';
import { MusicianCharacter, VILLAGE_LANDMARKS, VILLAGE_MUSICIANS } from '../../data/villageStorylineData.ts';

export interface VillageSceneAssets {
  scene: THREE.Scene;
  ground: THREE.Mesh;
  playerGroup: THREE.Group;
  playerLegL: THREE.Mesh;
  playerLegR: THREE.Mesh;
  playerArmL: THREE.Mesh;
  playerArmR: THREE.Mesh;
  playerBody: THREE.Mesh;
  musicianMeshes: Map<string, { group: THREE.Group; musician: MusicianCharacter; instrumentMesh: THREE.Object3D; noteFloaters: THREE.Mesh[] }>;
  lanternLights: THREE.PointLight[];
  sunLight: THREE.DirectionalLight;
  ambientLight: THREE.AmbientLight;
  waterMesh: THREE.Mesh;
}

export function buildVillageScene(scene: THREE.Scene): VillageSceneAssets {
  // 1. Lighting Setup
  const ambientLight = new THREE.AmbientLight(0xffedd5, 0.7); // Warm golden ambient
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xfff7ed, 1.4);
  sunLight.position.set(30, 45, 25);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.camera.near = 0.5;
  sunLight.shadow.camera.far = 120;
  sunLight.shadow.camera.left = -45;
  sunLight.shadow.camera.right = 45;
  sunLight.shadow.camera.top = 45;
  sunLight.shadow.camera.bottom = -45;
  sunLight.shadow.bias = -0.0005;
  scene.add(sunLight);

  // Soft secondary sky hemisphere light
  const hemiLight = new THREE.HemisphereLight(0xfef3c7, 0x78350f, 0.5);
  scene.add(hemiLight);

  // 2. Terrain & Ground
  // Main earthen village ground
  const groundGeo = new THREE.PlaneGeometry(120, 120, 32, 32);
  const groundMat = new THREE.MeshStandardMaterial({
    color: 0xdfd5c0, // Warm sandy Indian terracotta loam
    roughness: 0.9,
    metalness: 0.05,
  });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  ground.name = 'ground';
  scene.add(ground);

  // Decorative grassy patches around village perimeter
  const grassMat = new THREE.MeshStandardMaterial({ color: 0x84a95a, roughness: 0.9 });
  const patchCoords = [
    [-35, -20, 22], [32, 28, 26], [-28, 25, 20], [30, -25, 24], [-12, -38, 20], [15, 38, 22]
  ];
  patchCoords.forEach(([px, pz, radius]) => {
    const patch = new THREE.Mesh(new THREE.CircleGeometry(radius, 16), grassMat);
    patch.rotation.x = -Math.PI / 2;
    patch.position.set(px, 0.02, pz);
    patch.receiveShadow = true;
    scene.add(patch);
  });

  // Winding Village Dirt Pathways (cobblestone/sandstone pavers connecting landmarks)
  const pathMat = new THREE.MeshStandardMaterial({ color: 0xc4a482, roughness: 0.95 });
  const pathwayStrips = [
    { start: [0, 0], end: [-22, -16], width: 3.2 }, // to River Ghat
    { start: [0, 0], end: [18, -12], width: 3.2 }, // to Haveli Baithak
    { start: [0, 0], end: [20, 16], width: 3.2 },  // to Mandap
    { start: [0, 0], end: [-16, 18], width: 3.2 }, // to Temple Sanctum
    { start: [0, 0], end: [0, 24], width: 3.0 },   // to South Pavilion
    { start: [0, 0], end: [-26, 0], width: 3.0 },  // to Folk Choupal
    { start: [0, 0], end: [2, -26], width: 3.0 },  // to Luthier Workshop
  ];

  pathwayStrips.forEach(({ start, end, width }) => {
    const dx = end[0] - start[0];
    const dz = end[1] - start[1];
    const len = Math.hypot(dx, dz);
    const angle = Math.atan2(dx, dz);
    const stripGeo = new THREE.PlaneGeometry(width, len);
    const strip = new THREE.Mesh(stripGeo, pathMat);
    strip.rotation.x = -Math.PI / 2;
    strip.rotation.z = -angle;
    strip.position.set((start[0] + end[0]) / 2, 0.03, (start[1] + end[1]) / 2);
    strip.receiveShadow = true;
    scene.add(strip);
  });

  // 3. Central Great Banyan Tree & Choupal Platform
  const choupalPlinth = new THREE.Mesh(
    new THREE.CylinderGeometry(8, 8.5, 0.8, 8),
    new THREE.MeshStandardMaterial({ color: 0xd6c4b2, roughness: 0.8 })
  );
  choupalPlinth.position.set(0, 0.4, 0);
  choupalPlinth.receiveShadow = true;
  choupalPlinth.castShadow = true;
  scene.add(choupalPlinth);

  // Banyan trunk
  const trunkGeo = new THREE.CylinderGeometry(1.8, 2.6, 7, 10);
  const barkMat = new THREE.MeshStandardMaterial({ color: 0x4a3728, roughness: 0.9 });
  const trunk = new THREE.Mesh(trunkGeo, barkMat);
  trunk.position.set(0, 4, 0);
  trunk.castShadow = true;
  scene.add(trunk);

  // Aerial banyan roots
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const root = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.35, 6, 6), barkMat);
    root.position.set(Math.cos(angle) * 3.5, 3.5, Math.sin(angle) * 3.5);
    root.rotation.z = Math.sin(angle) * 0.15;
    root.rotation.x = Math.cos(angle) * 0.15;
    root.castShadow = true;
    scene.add(root);
  }

  // Sprawling leafy crowns
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x2e5c1e, roughness: 0.7 });
  const crownPositions = [
    [0, 8.5, 0, 5.5],
    [-3.2, 7.8, 2.5, 3.8],
    [3.5, 7.5, -2, 4.0],
    [2.8, 8.2, 3, 3.6],
    [-2.5, 7.6, -3, 3.8],
  ];
  crownPositions.forEach(([cx, cy, cz, r]) => {
    const crown = new THREE.Mesh(new THREE.DodecahedronGeometry(r, 1), leafMat);
    crown.position.set(cx, cy, cz);
    crown.castShadow = true;
    scene.add(crown);
  });

  // Bolsters & Gaddi carpet under the banyan
  const gaddiCarpet = new THREE.Mesh(
    new THREE.BoxGeometry(4.2, 0.1, 4.2),
    new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.8 }) // Royal crimson gaddi
  );
  gaddiCarpet.position.set(0, 0.85, 1.8);
  gaddiCarpet.receiveShadow = true;
  scene.add(gaddiCarpet);

  const bolster = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.3, 2.5, 12),
    new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.7 }) // Golden bolster
  );
  bolster.rotation.z = Math.PI / 2;
  bolster.position.set(0, 1.15, 0.7);
  scene.add(bolster);

  // 4. Saraswati River Ghat (Northwest)
  const riverBed = new THREE.Mesh(
    new THREE.BoxGeometry(32, 2, 20),
    new THREE.MeshStandardMaterial({ color: 0x1e3a5f, roughness: 0.6 })
  );
  riverBed.position.set(-36, -0.9, -24);
  scene.add(riverBed);

  const waterGeo = new THREE.PlaneGeometry(32, 20, 24, 24);
  const waterMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    roughness: 0.1,
    metalness: 0.8,
    transparent: true,
    opacity: 0.85,
  });
  const waterMesh = new THREE.Mesh(waterGeo, waterMat);
  waterMesh.rotation.x = -Math.PI / 2;
  waterMesh.position.set(-36, 0.05, -24);
  scene.add(waterMesh);

  // Ghat stone steps
  for (let s = 0; s < 4; s++) {
    const step = new THREE.Mesh(
      new THREE.BoxGeometry(18, 0.35, 1.6),
      new THREE.MeshStandardMaterial({ color: 0xd4c2a5, roughness: 0.75 })
    );
    step.position.set(-23 - s * 1.5, 0.7 - s * 0.28, -20);
    step.receiveShadow = true;
    step.castShadow = true;
    scene.add(step);
  }

  // Wooden boat by the ghat
  const boat = new THREE.Mesh(
    new THREE.CylinderGeometry(1.2, 0.8, 5, 8),
    new THREE.MeshStandardMaterial({ color: 0x5c3d2e, roughness: 0.8 })
  );
  boat.rotation.x = Math.PI / 2;
  boat.rotation.z = 0.3;
  boat.position.set(-27, 0.2, -26);
  boat.scale.set(0.7, 0.5, 1);
  scene.add(boat);

  // 5. Haveli Heritage Baithak (Northeast)
  const baithakPlinth = new THREE.Mesh(
    new THREE.BoxGeometry(14, 0.7, 12),
    new THREE.MeshStandardMaterial({ color: 0xe2d7c5, roughness: 0.8 })
  );
  baithakPlinth.position.set(20, 0.35, -14);
  baithakPlinth.receiveShadow = true;
  baithakPlinth.castShadow = true;
  scene.add(baithakPlinth);

  // Wooden carved pillars
  const pillarGeo = new THREE.CylinderGeometry(0.25, 0.35, 4.2, 8);
  const pillarMat = new THREE.MeshStandardMaterial({ color: 0x543621, roughness: 0.7 });
  const pillarOffsets = [
    [-6, -5], [6, -5], [-6, 5], [6, 5], [-2, -5], [2, -5]
  ];
  pillarOffsets.forEach(([px, pz]) => {
    const pil = new THREE.Mesh(pillarGeo, pillarMat);
    pil.position.set(20 + px, 2.5, -14 + pz);
    pil.castShadow = true;
    scene.add(pil);
  });

  // Terracotta tiled roof
  const roofGeo = new THREE.ConeGeometry(10.5, 3.2, 4);
  const roofMat = new THREE.MeshStandardMaterial({ color: 0xc2410c, roughness: 0.8 }); // Red clay terracotta
  const roof = new THREE.Mesh(roofGeo, roofMat);
  roof.rotation.y = Math.PI / 4;
  roof.position.set(20, 6.2, -14);
  roof.castShadow = true;
  scene.add(roof);

  // Baithak velvet floor mat
  const baithakRug = new THREE.Mesh(
    new THREE.BoxGeometry(9, 0.08, 7),
    new THREE.MeshStandardMaterial({ color: 0x065f46, roughness: 0.75 }) // Emerald Indian rug
  );
  baithakRug.position.set(20, 0.75, -14);
  scene.add(baithakRug);

  // 6. Festive Celebration Mandap (Southeast)
  const mandapBase = new THREE.Mesh(
    new THREE.CylinderGeometry(6, 6.4, 0.5, 8),
    new THREE.MeshStandardMaterial({ color: 0xebd9be, roughness: 0.8 })
  );
  mandapBase.position.set(22, 0.25, 18);
  mandapBase.receiveShadow = true;
  scene.add(mandapBase);

  // Mandap bamboo posts and fabric canopy
  for (let m = 0; m < 4; m++) {
    const ang = (m / 4) * Math.PI * 2 + Math.PI / 4;
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 4.5, 8), pillarMat);
    post.position.set(22 + Math.cos(ang) * 4.2, 2.4, 18 + Math.sin(ang) * 4.2);
    post.castShadow = true;
    scene.add(post);
  }

  // Saffron cloth canopy
  const canopy = new THREE.Mesh(
    new THREE.ConeGeometry(5.8, 2.2, 8),
    new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.6, side: THREE.DoubleSide })
  );
  canopy.position.set(22, 5.2, 18);
  canopy.castShadow = true;
  scene.add(canopy);

  // Marigold flower torans (garlands)
  const garlandMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.7 });
  for (let g = 0; g < 12; g++) {
    const ang = (g / 12) * Math.PI * 2;
    const marigold = new THREE.Mesh(new THREE.SphereGeometry(0.2, 6, 6), garlandMat);
    marigold.position.set(22 + Math.cos(ang) * 4.4, 4.1 - (g % 2) * 0.3, 18 + Math.sin(ang) * 4.4);
    scene.add(marigold);
  }

  // 7. Nada Mandir Temple Sanctum (Southwest)
  const templePlinth = new THREE.Mesh(
    new THREE.BoxGeometry(11, 0.8, 11),
    new THREE.MeshStandardMaterial({ color: 0xd1bfa7, roughness: 0.85 })
  );
  templePlinth.position.set(-18, 0.4, 20);
  templePlinth.receiveShadow = true;
  scene.add(templePlinth);

  // Stone pillars
  const templePillarGeo = new THREE.BoxGeometry(0.6, 4.2, 0.6);
  const stoneMat = new THREE.MeshStandardMaterial({ color: 0x9c8b77, roughness: 0.9 });
  [[-4, -4], [4, -4], [-4, 4], [4, 4]].forEach(([tx, tz]) => {
    const tp = new THREE.Mesh(templePillarGeo, stoneMat);
    tp.position.set(-18 + tx, 2.7, 20 + tz);
    tp.castShadow = true;
    scene.add(tp);
  });

  // Temple Shikara (Spire)
  const shikara = new THREE.Mesh(
    new THREE.ConeGeometry(5.2, 6, 4),
    new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.75 })
  );
  shikara.rotation.y = Math.PI / 4;
  shikara.position.set(-18, 7.8, 20);
  shikara.castShadow = true;
  scene.add(shikara);

  // Brass temple bell
  const bell = new THREE.Mesh(
    new THREE.CylinderGeometry(0.15, 0.45, 0.6, 10),
    new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.8, roughness: 0.3 })
  );
  bell.position.set(-18, 4.2, 20);
  scene.add(bell);

  // 8. Master Craftsman Luthier Workshop (North)
  const hutWall = new THREE.Mesh(
    new THREE.BoxGeometry(10, 3.5, 8),
    new THREE.MeshStandardMaterial({ color: 0x855333, roughness: 0.9 })
  );
  hutWall.position.set(2, 1.75, -28);
  hutWall.castShadow = true;
  scene.add(hutWall);

  const hutRoof = new THREE.Mesh(
    new THREE.ConeGeometry(7.5, 2.8, 4),
    new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.85 })
  );
  hutRoof.rotation.y = Math.PI / 4;
  hutRoof.position.set(2, 4.8, -28);
  scene.add(hutRoof);

  // Workbench outside the hut
  const bench = new THREE.Mesh(
    new THREE.BoxGeometry(3.5, 1.0, 1.6),
    new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.8 })
  );
  bench.position.set(2, 0.5, -23.5);
  bench.castShadow = true;
  scene.add(bench);

  // Wood shavings & curing gourds
  for (let gd = 0; gd < 3; gd++) {
    const gourd = new THREE.Mesh(
      new THREE.SphereGeometry(0.35, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.7 })
    );
    gourd.position.set(0.8 + gd * 0.9, 1.2, -23.5);
    scene.add(gourd);
  }

  // 9. Folk Campfire Choupal (West)
  const fireBase = new THREE.Mesh(
    new THREE.CylinderGeometry(1.8, 2.2, 0.4, 12),
    new THREE.MeshStandardMaterial({ color: 0x44403c, roughness: 0.9 })
  );
  fireBase.position.set(-28, 0.2, 0);
  scene.add(fireBase);

  // Glowing logs
  const logMat = new THREE.MeshStandardMaterial({ color: 0x7c2d12, roughness: 0.9 });
  for (let l = 0; l < 4; l++) {
    const log = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 2.0, 6), logMat);
    log.rotation.z = Math.PI / 2;
    log.rotation.y = (l / 4) * Math.PI;
    log.position.set(-28, 0.35, 0);
    scene.add(log);
  }
  // Warm firepoint light
  const fireLight = new THREE.PointLight(0xf97316, 1.6, 15);
  fireLight.position.set(-28, 0.8, 0);
  scene.add(fireLight);

  // 10. South Mridangam Rhythm Pavilion (South)
  const pavBase = new THREE.Mesh(
    new THREE.BoxGeometry(9, 0.5, 9),
    new THREE.MeshStandardMaterial({ color: 0x374151, roughness: 0.6 }) // Granite stone
  );
  pavBase.position.set(0, 0.25, 26);
  scene.add(pavBase);

  // Pillared canopy
  [[-3.6, -3.6], [3.6, -3.6], [-3.6, 3.6], [3.6, 3.6]].forEach(([px, pz]) => {
    const p = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 3.8, 8), stoneMat);
    p.position.set(0 + px, 2.15, 26 + pz);
    p.castShadow = true;
    scene.add(p);
  });
  const pavRoof = new THREE.Mesh(
    new THREE.BoxGeometry(9.6, 0.4, 9.6),
    new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.8 })
  );
  pavRoof.position.set(0, 4.2, 26);
  scene.add(pavRoof);

  // 11. Surrounding village trees & mud huts for village immersion
  const hutOffsets = [
    [-18, -32], [22, -32], [32, 2], [-32, 22], [30, 32], [-30, -32]
  ];
  hutOffsets.forEach(([hx, hz]) => {
    const vHut = new THREE.Mesh(
      new THREE.BoxGeometry(6, 2.8, 5),
      new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.9 })
    );
    vHut.position.set(hx, 1.4, hz);
    vHut.castShadow = true;
    scene.add(vHut);

    const vRoof = new THREE.Mesh(
      new THREE.ConeGeometry(4.8, 2.2, 4),
      new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.9 })
    );
    vRoof.rotation.y = Math.PI / 4;
    vRoof.position.set(hx, 3.8, hz);
    scene.add(vRoof);
  });

  // Additional village trees
  const treeCoords = [
    [-12, -18], [12, -22], [-8, 14], [14, 8], [-26, 12], [28, -6], [-10, 32], [16, 24]
  ];
  treeCoords.forEach(([tx, tz]) => {
    const tTrunk = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.4, 4.5, 8), barkMat);
    tTrunk.position.set(tx, 2.25, tz);
    tTrunk.castShadow = true;
    scene.add(tTrunk);

    const tFoliage = new THREE.Mesh(new THREE.SphereGeometry(2.2, 8, 8), leafMat);
    tFoliage.position.set(tx, 5.2, tz);
    tFoliage.castShadow = true;
    scene.add(tFoliage);
  });

  // Lantern posts with warm glowing point lights
  const lanternLights: THREE.PointLight[] = [];
  const lanternPositions: [number, number, number][] = [
    [0, 2.5, 5],
    [-18, 2.2, -14],
    [14, 2.2, -10],
    [16, 2.2, 14],
    [-14, 2.2, 16],
    [0, 2.2, 22],
    [2, 2.2, -22],
  ];
  const postMat = new THREE.MeshStandardMaterial({ color: 0x27272a, metalness: 0.8 });
  const lanternGlassMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xfbbf24, emissiveIntensity: 0.7 });

  lanternPositions.forEach(([lx, ly, lz]) => {
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 2.8, 6), postMat);
    pole.position.set(lx, 1.4, lz);
    scene.add(pole);

    const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.45, 0.35), lanternGlassMat);
    lamp.position.set(lx, 2.7, lz);
    scene.add(lamp);

    const point = new THREE.PointLight(0xfef08a, 0.9, 10);
    point.position.set(lx, 2.7, lz);
    scene.add(point);
    lanternLights.push(point);
  });

  // 12. Build Main Player Character (The Swara Seeker)
  const playerGroup = new THREE.Group();
  playerGroup.position.set(0, 0, 8); // Start on central pathway

  // Dhoti / Legs
  const legMat = new THREE.MeshStandardMaterial({ color: 0xfaf5ef, roughness: 0.8 }); // White dhoti
  const legGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.85, 8);

  const playerLegL = new THREE.Mesh(legGeo, legMat);
  playerLegL.position.set(-0.2, 0.45, 0);
  playerLegL.castShadow = true;
  playerGroup.add(playerLegL);

  const playerLegR = new THREE.Mesh(legGeo, legMat);
  playerLegR.position.set(0.2, 0.45, 0);
  playerLegR.castShadow = true;
  playerGroup.add(playerLegR);

  // Torso (Kurta)
  const kurtaMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.7 }); // Saffron/amber kurta
  const playerBody = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.9, 0.35), kurtaMat);
  playerBody.position.set(0, 1.3, 0);
  playerBody.castShadow = true;
  playerGroup.add(playerBody);

  // Shoulder gamchha / shawl
  const shawl = new THREE.Mesh(
    new THREE.BoxGeometry(0.72, 0.25, 0.42),
    new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.8 }) // Maroon shawl
  );
  shawl.position.set(0, 1.6, 0);
  playerGroup.add(shawl);

  // Arms
  const armMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.7 });
  const armGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.75, 8);

  const playerArmL = new THREE.Mesh(armGeo, armMat);
  playerArmL.position.set(-0.45, 1.25, 0);
  playerArmL.castShadow = true;
  playerGroup.add(playerArmL);

  const playerArmR = new THREE.Mesh(armGeo, armMat);
  playerArmR.position.set(0.45, 1.25, 0);
  playerArmR.castShadow = true;
  playerGroup.add(playerArmR);

  // Head
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xc68642, roughness: 0.6 });
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12), skinMat);
  head.position.set(0, 1.95, 0);
  head.castShadow = true;
  playerGroup.add(head);

  // Turban (Pagri)
  const turban = new THREE.Mesh(
    new THREE.CylinderGeometry(0.28, 0.24, 0.22, 10),
    new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.8 })
  );
  turban.position.set(0, 2.12, 0);
  playerGroup.add(turban);

  // Musical Explorer shoulder satchel
  const satchel = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.35, 0.15),
    new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 })
  );
  satchel.position.set(0.32, 1.1, 0.15);
  playerGroup.add(satchel);

  // Player shadow indicator
  const shadowBlob = new THREE.Mesh(
    new THREE.CircleGeometry(0.45, 12),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.35 })
  );
  shadowBlob.rotation.x = -Math.PI / 2;
  shadowBlob.position.set(0, 0.04, 0);
  playerGroup.add(shadowBlob);

  scene.add(playerGroup);

  // 13. Build 8 Stationed Musician Avatars with 3D Instruments
  const musicianMeshes = new Map<string, { group: THREE.Group; musician: MusicianCharacter; instrumentMesh: THREE.Object3D; noteFloaters: THREE.Mesh[] }>();

  VILLAGE_MUSICIANS.forEach((musician) => {
    const mGroup = new THREE.Group();
    mGroup.position.set(...musician.position);

    // Cross-legged or sitting base
    const sitBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.55, 0.6, 0.4, 10),
      new THREE.MeshStandardMaterial({ color: parseInt(musician.color.replace('#', '0x')), roughness: 0.8 })
    );
    sitBase.position.set(0, 0.2, 0);
    sitBase.castShadow = true;
    mGroup.add(sitBase);

    // Sitting Torso
    const mTorso = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.7, 0.35),
      new THREE.MeshStandardMaterial({ color: parseInt(musician.vestColor.replace('#', '0x')), roughness: 0.7 })
    );
    mTorso.position.set(0, 0.75, 0);
    mTorso.castShadow = true;
    mGroup.add(mTorso);

    // Head
    const mHead = new THREE.Mesh(new THREE.SphereGeometry(0.2, 10, 10), skinMat);
    mHead.position.set(0, 1.3, 0);
    mGroup.add(mHead);

    // Turban
    const mTurban = new THREE.Mesh(
      new THREE.CylinderGeometry(0.26, 0.22, 0.2, 10),
      new THREE.MeshStandardMaterial({ color: parseInt(musician.turbanColor.replace('#', '0x')), roughness: 0.8 })
    );
    mTurban.position.set(0, 1.45, 0);
    mGroup.add(mTurban);

    // Build specific 3D Instrument model attached to musician
    let instrumentMesh: THREE.Object3D;

    if (musician.instrumentSlug === 'sitar') {
      const sitarGroup = new THREE.Group();
      // Round Kaddu Gourd
      const sitarGourd = new THREE.Mesh(
        new THREE.SphereGeometry(0.42, 12, 12),
        new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.6 })
      );
      sitarGourd.scale.set(1, 0.7, 1);
      sitarGourd.position.set(0.3, 0.35, 0.3);
      sitarGroup.add(sitarGourd);

      // Long fretted neck
      const sitarNeck = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.09, 1.7, 8),
        new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.5 })
      );
      sitarNeck.position.set(-0.25, 0.9, 0.2);
      sitarNeck.rotation.z = -0.7;
      sitarGroup.add(sitarNeck);

      // Upper tuning peg box
      const upperGourd = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 8, 8),
        new THREE.MeshStandardMaterial({ color: 0x78350f })
      );
      upperGourd.position.set(-0.8, 1.45, 0.2);
      sitarGroup.add(upperGourd);

      mGroup.add(sitarGroup);
      instrumentMesh = sitarGroup;
    } else if (musician.instrumentSlug === 'tabla') {
      const tablaGroup = new THREE.Group();
      // Dayan (right wooden drum)
      const dayan = new THREE.Mesh(
        new THREE.CylinderGeometry(0.22, 0.18, 0.45, 12),
        new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.7 })
      );
      dayan.position.set(0.26, 0.25, 0.45);
      tablaGroup.add(dayan);

      const syahiDayan = new THREE.Mesh(
        new THREE.CircleGeometry(0.09, 12),
        new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9 })
      );
      syahiDayan.rotation.x = -Math.PI / 2;
      syahiDayan.position.set(0.26, 0.48, 0.45);
      tablaGroup.add(syahiDayan);

      // Bayan (left metallic/clay drum)
      const bayan = new THREE.Mesh(
        new THREE.SphereGeometry(0.26, 12, 12),
        new THREE.MeshStandardMaterial({ color: 0x71717a, metalness: 0.6, roughness: 0.4 })
      );
      bayan.scale.set(1, 0.8, 1);
      bayan.position.set(-0.26, 0.22, 0.45);
      tablaGroup.add(bayan);

      const syahiBayan = new THREE.Mesh(
        new THREE.CircleGeometry(0.1, 12),
        new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9 })
      );
      syahiBayan.rotation.x = -Math.PI / 2;
      syahiBayan.position.set(-0.24, 0.44, 0.43);
      tablaGroup.add(syahiBayan);

      mGroup.add(tablaGroup);
      instrumentMesh = tablaGroup;
    } else if (musician.instrumentSlug === 'bansuri') {
      // Bamboo transverse flute held to lips
      const flute = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 0.9, 8),
        new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.6 }) // Bamboo yellow
      );
      flute.rotation.z = Math.PI / 2.3;
      flute.position.set(0.22, 1.25, 0.28);
      mGroup.add(flute);
      instrumentMesh = flute;
    } else if (musician.instrumentSlug === 'shehnai') {
      const shehnaiGroup = new THREE.Group();
      const pipe = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.08, 0.7, 8),
        new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.7 })
      );
      pipe.position.set(0, 1.15, 0.35);
      pipe.rotation.x = 0.5;
      shehnaiGroup.add(pipe);

      // Brass bell
      const bellFlare = new THREE.Mesh(
        new THREE.ConeGeometry(0.18, 0.2, 10),
        new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.8, roughness: 0.3 })
      );
      bellFlare.position.set(0, 0.9, 0.5);
      bellFlare.rotation.x = 0.5;
      shehnaiGroup.add(bellFlare);

      mGroup.add(shehnaiGroup);
      instrumentMesh = shehnaiGroup;
    } else if (musician.instrumentSlug === 'saraswati-veena') {
      const veenaGroup = new THREE.Group();
      const body = new THREE.Mesh(
        new THREE.SphereGeometry(0.48, 12, 12),
        new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.5 })
      );
      body.scale.set(1.1, 0.7, 1);
      body.position.set(0.35, 0.35, 0.25);
      veenaGroup.add(body);

      const neck = new THREE.Mesh(
        new THREE.CylinderGeometry(0.09, 0.09, 1.8, 8),
        new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.5 })
      );
      neck.position.set(-0.35, 0.85, 0.25);
      neck.rotation.z = -0.65;
      veenaGroup.add(neck);

      mGroup.add(veenaGroup);
      instrumentMesh = veenaGroup;
    } else if (musician.instrumentSlug === 'mridangam') {
      // Two headed barrel drum
      const mridangam = new THREE.Mesh(
        new THREE.CylinderGeometry(0.24, 0.24, 0.85, 12),
        new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.7 })
      );
      mridangam.rotation.z = Math.PI / 2;
      mridangam.position.set(0, 0.35, 0.45);
      mGroup.add(mridangam);
      instrumentMesh = mridangam;
    } else if (musician.instrumentSlug === 'dholak') {
      const dholak = new THREE.Mesh(
        new THREE.CylinderGeometry(0.22, 0.22, 0.75, 12),
        new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.7 })
      );
      dholak.rotation.z = Math.PI / 2.2;
      dholak.position.set(0, 0.35, 0.4);
      mGroup.add(dholak);
      instrumentMesh = dholak;
    } else {
      // Sarangi & bow
      const sarangiGroup = new THREE.Group();
      const box = new THREE.Mesh(
        new THREE.BoxGeometry(0.32, 0.85, 0.24),
        new THREE.MeshStandardMaterial({ color: 0x5c2c16, roughness: 0.6 })
      );
      box.position.set(0, 0.7, 0.35);
      sarangiGroup.add(box);

      const bow = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 0.7, 6),
        new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.7 })
      );
      bow.rotation.z = Math.PI / 3;
      bow.position.set(0.2, 0.7, 0.45);
      sarangiGroup.add(bow);

      mGroup.add(sarangiGroup);
      instrumentMesh = sarangiGroup;
    }

    // Floating pulsing musical notes aura above head
    const noteFloaters: THREE.Mesh[] = [];
    const noteMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
    for (let n = 0; n < 3; n++) {
      const noteMesh = new THREE.Mesh(new THREE.DodecahedronGeometry(0.12, 0), noteMat);
      noteMesh.position.set(
        (Math.random() - 0.5) * 0.8,
        1.8 + n * 0.35,
        (Math.random() - 0.5) * 0.8
      );
      mGroup.add(noteMesh);
      noteFloaters.push(noteMesh);
    }

    // Proximity target ring on ground
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(1.4, 1.65, 24),
      new THREE.MeshBasicMaterial({ color: 0xf59e0b, side: THREE.DoubleSide, transparent: true, opacity: 0.55 })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(0, 0.04, 0);
    mGroup.add(ring);

    scene.add(mGroup);
    musicianMeshes.set(musician.id, { group: mGroup, musician, instrumentMesh, noteFloaters });
  });

  return {
    scene,
    ground,
    playerGroup,
    playerLegL,
    playerLegR,
    playerArmL,
    playerArmR,
    playerBody,
    musicianMeshes,
    lanternLights,
    sunLight,
    ambientLight,
    waterMesh,
  };
}
