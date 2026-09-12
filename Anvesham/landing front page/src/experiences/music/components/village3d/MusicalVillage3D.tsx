import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import {
  Compass,
  Volume2,
  VolumeX,
  Sun,
  Sunset,
  Moon,
  BookOpen,
  MapPin,
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  Layers,
  ChevronRight,
  Eye,
  Crosshair,
  Footprints,
  ArrowLeft,
  Home,
} from 'lucide-react';

import {
  MusicianCharacter,
  VILLAGE_MUSICIANS,
  VILLAGE_LANDMARKS,
} from '../../data/villageStorylineData.ts';
import { buildVillageScene, VillageSceneAssets } from './villageSceneBuilder.ts';
import { StorylineDialogModal } from './StorylineDialogModal.tsx';
import { StorylineJournalModal } from './StorylineJournalModal.tsx';
import { soundSynthesizer } from '../../services/soundSynthesizer.ts';

const QUEST_STORAGE_KEY = 'itihaasx_village_quest_progress';

export const MusicalVillage3D: React.FC = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Three.js instances ref
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneAssetsRef = useRef<VillageSceneAssets | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  // Player position & motion state
  const playerPos = useRef(new THREE.Vector3(0, 0, 8));
  const playerTargetPos = useRef<THREE.Vector3 | null>(null);
  const playerRotationY = useRef(0);
  const isWalking = useRef(false);
  const walkTime = useRef(0);

  // Keyboard input state
  const keysDown = useRef<Record<string, boolean>>({});

  // Virtual Joystick state for mobile
  const joystickCenter = useRef<{ x: number; y: number } | null>(null);
  const joystickVector = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Proximity & Interaction state
  const [nearestMusician, setNearestMusician] = useState<MusicianCharacter | null>(null);
  const [activeMusicianDialogue, setActiveMusicianDialogue] = useState<MusicianCharacter | null>(null);
  const [isJournalOpen, setIsJournalOpen] = useState(false);

  // Storyline Quest Progress
  const [completedQuests, setCompletedQuests] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(QUEST_STORAGE_KEY);
      if (saved) return new Set(JSON.parse(saved));
    } catch (e) {}
    return new Set<string>();
  });

  const [activeQuestChapter, setActiveQuestChapter] = useState(1);

  // Atmosphere mode: 'golden' | 'day' | 'night'
  const [atmosphere, setAtmosphere] = useState<'golden' | 'day' | 'night'>('golden');
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [cameraMode, setCameraMode] = useState<'follow' | 'topdown'>('follow');
  const [isCinematicTour, setIsCinematicTour] = useState(false);
  const cinematicTourStep = useRef(0);

  // Save quest progress
  useEffect(() => {
    try {
      localStorage.setItem(QUEST_STORAGE_KEY, JSON.stringify(Array.from(completedQuests)));
    } catch (e) {}
  }, [completedQuests]);

  // Update active quest chapter
  useEffect(() => {
    const uncompleted = VILLAGE_MUSICIANS.find((m) => !completedQuests.has(m.id));
    if (uncompleted) {
      setActiveQuestChapter(uncompleted.storyChapter);
    } else {
      setActiveQuestChapter(9); // All completed!
    }
  }, [completedQuests]);

  const activeQuestMusician = VILLAGE_MUSICIANS.find(
    (m) => m.storyChapter === activeQuestChapter
  ) || VILLAGE_MUSICIANS[0];

  // Detect touch device
  useEffect(() => {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setIsTouchDevice(true);
    }
  }, []);

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysDown.current[e.code] = true;
      if (e.code === 'KeyE' && nearestMusician) {
        setActiveMusicianDialogue(nearestMusician);
      }
      if (e.code === 'KeyJ') {
        setIsJournalOpen((prev) => !prev);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysDown.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [nearestMusician]);

  // Ground Click to Move (Raycaster)
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !cameraRef.current || !sceneAssetsRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);
    const intersects = raycaster.intersectObject(sceneAssetsRef.current.ground);

    if (intersects.length > 0) {
      const pt = intersects[0].point;
      playerTargetPos.current = new THREE.Vector3(pt.x, 0, pt.z);
    }
  };

  // Setup Three.js Scene
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfde047); // Golden dawn
    scene.fog = new THREE.FogExp2(0xfef3c7, 0.015);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 200);
    camera.position.set(0, 7, 18);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // 4. Build Environment & Avatars
    const assets = buildVillageScene(scene);
    sceneAssetsRef.current = assets;

    // ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 0 && h > 0 && cameraRef.current && rendererRef.current) {
          cameraRef.current.aspect = w / h;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(containerRef.current);

    // 5. Main Game Loop
    let lastTime = performance.now();

    const animate = (time: number) => {
      animationFrameIdRef.current = requestAnimationFrame(animate);
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Handle Character Movement
      const moveSpeed = 7.0;
      let moveX = 0;
      let moveZ = 0;

      // Check keys
      if (keysDown.current['KeyW'] || keysDown.current['ArrowUp']) moveZ -= 1;
      if (keysDown.current['KeyS'] || keysDown.current['ArrowDown']) moveZ += 1;
      if (keysDown.current['KeyA'] || keysDown.current['ArrowLeft']) moveX -= 1;
      if (keysDown.current['KeyD'] || keysDown.current['ArrowRight']) moveX += 1;

      // Add Joystick input
      if (joystickVector.current.x !== 0 || joystickVector.current.y !== 0) {
        moveX += joystickVector.current.x;
        moveZ += joystickVector.current.y;
      }

      // If keyboard or joystick is active, cancel click-to-move target
      if (moveX !== 0 || moveZ !== 0) {
        playerTargetPos.current = null;
        const len = Math.hypot(moveX, moveZ);
        const normX = (moveX / len) * moveSpeed * delta;
        const normZ = (moveZ / len) * moveSpeed * delta;

        playerPos.current.x += normX;
        playerPos.current.z += normZ;

        playerRotationY.current = Math.atan2(normX, normZ);
        isWalking.current = true;
      } else if (playerTargetPos.current) {
        // Click-to-move towards target
        const dist = playerPos.current.distanceTo(playerTargetPos.current);
        if (dist > 0.3) {
          const dir = new THREE.Vector3()
            .subVectors(playerTargetPos.current, playerPos.current)
            .normalize();
          playerPos.current.x += dir.x * moveSpeed * delta;
          playerPos.current.z += dir.z * moveSpeed * delta;
          playerRotationY.current = Math.atan2(dir.x, dir.z);
          isWalking.current = true;
        } else {
          playerTargetPos.current = null;
          isWalking.current = false;
        }
      } else {
        isWalking.current = false;
      }

      // Constrain within village bounds
      playerPos.current.x = Math.max(-48, Math.min(48, playerPos.current.x));
      playerPos.current.z = Math.max(-48, Math.min(48, playerPos.current.z));

      // Update Player Mesh Position and Rotation
      if (assets.playerGroup) {
        assets.playerGroup.position.x = playerPos.current.x;
        assets.playerGroup.position.z = playerPos.current.z;
        assets.playerGroup.rotation.y = playerRotationY.current;

        // Walking leg/arm swing cycle
        if (isWalking.current) {
          walkTime.current += delta * 12;
          const legSwing = Math.sin(walkTime.current) * 0.45;
          assets.playerLegL.rotation.x = legSwing;
          assets.playerLegR.rotation.x = -legSwing;
          assets.playerArmL.rotation.x = -legSwing * 0.7;
          assets.playerArmR.rotation.x = legSwing * 0.7;
          assets.playerBody.position.y = 1.3 + Math.abs(Math.sin(walkTime.current)) * 0.05;
        } else {
          assets.playerLegL.rotation.x = 0;
          assets.playerLegR.rotation.x = 0;
          assets.playerArmL.rotation.x = 0;
          assets.playerArmR.rotation.x = 0;
          assets.playerBody.position.y = 1.3;
        }
      }

      // Update Camera Position
      if (cameraRef.current) {
        if (cameraMode === 'topdown') {
          // Overhead drone map view
          cameraRef.current.position.lerp(
            new THREE.Vector3(playerPos.current.x, 38, playerPos.current.z + 0.1),
            0.08
          );
          cameraRef.current.lookAt(playerPos.current.x, 0, playerPos.current.z);
        } else {
          // 3rd Person Follow Camera
          const camOffset = new THREE.Vector3(0, 4.2, 7.5);
          const targetCamPos = playerPos.current.clone().add(camOffset);
          cameraRef.current.position.lerp(targetCamPos, 0.1);
          cameraRef.current.lookAt(playerPos.current.x, 1.4, playerPos.current.z);
        }
      }

      // Idle animations for musicians (floating musical notes & swaying instruments)
      assets.musicianMeshes.forEach(({ noteFloaters }) => {
        noteFloaters.forEach((note, nIdx) => {
          note.position.y = 1.8 + nIdx * 0.35 + Math.sin(time * 0.003 + nIdx) * 0.12;
          note.rotation.y += 0.02;
        });
      });

      // Subtle water shimmer
      if (assets.waterMesh) {
        assets.waterMesh.rotation.z = Math.sin(time * 0.001) * 0.02;
      }

      // Proximity Detection
      let closest: MusicianCharacter | null = null;
      let minDistance = 4.2;

      VILLAGE_MUSICIANS.forEach((m) => {
        const mPos = new THREE.Vector3(...m.position);
        const dist = playerPos.current.distanceTo(mPos);
        if (dist < minDistance) {
          minDistance = dist;
          closest = m;
        }
      });

      setNearestMusician(closest);

      // Render
      renderer.render(scene, camera);
    };

    animationFrameIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      resizeObserver.disconnect();
      renderer.dispose();
    };
  }, [cameraMode]);

  // Handle Atmosphere Lighting Change
  useEffect(() => {
    if (!sceneAssetsRef.current || !sceneRef.current) return;
    const { sunLight, ambientLight, lanternLights } = sceneAssetsRef.current;
    const scene = sceneRef.current;

    if (atmosphere === 'golden') {
      scene.background = new THREE.Color(0xfef08a); // Golden Hour
      scene.fog = new THREE.FogExp2(0xfef3c7, 0.015);
      ambientLight.color.setHex(0xffedd5);
      ambientLight.intensity = 0.7;
      sunLight.color.setHex(0xf97316);
      sunLight.intensity = 1.3;
      lanternLights.forEach((l) => (l.intensity = 0.8));
    } else if (atmosphere === 'day') {
      scene.background = new THREE.Color(0xbae6fd); // Bright Day
      scene.fog = new THREE.FogExp2(0xe0f2fe, 0.01);
      ambientLight.color.setHex(0xffffff);
      ambientLight.intensity = 0.9;
      sunLight.color.setHex(0xffffff);
      sunLight.intensity = 1.5;
      lanternLights.forEach((l) => (l.intensity = 0.2));
    } else {
      // Village Night with glowing lantern points
      scene.background = new THREE.Color(0x0f172a); // Deep blue night
      scene.fog = new THREE.FogExp2(0x0f172a, 0.025);
      ambientLight.color.setHex(0x312e81);
      ambientLight.intensity = 0.35;
      sunLight.color.setHex(0x60a5fa);
      sunLight.intensity = 0.3;
      lanternLights.forEach((l) => (l.intensity = 2.2));
    }
  }, [atmosphere]);

  // Audio Toggle Effect
  useEffect(() => {
    if (isAudioEnabled) {
      soundSynthesizer.startVillageAmbientDrone(0.06);
    } else {
      soundSynthesizer.stopVillageAmbientDrone();
    }
    return () => {
      soundSynthesizer.stopVillageAmbientDrone();
    };
  }, [isAudioEnabled]);

  // Fast Travel Teleport Handler
  const handleFastTravel = useCallback((musicianId: string) => {
    const targetMusician = VILLAGE_MUSICIANS.find((m) => m.id === musicianId);
    if (!targetMusician) return;
    // Place player 3 units in front of musician
    playerPos.current.set(
      targetMusician.position[0],
      0,
      targetMusician.position[2] + 2.8
    );
    playerTargetPos.current = null;
    playerRotationY.current = Math.PI; // Face north towards musician
    soundSynthesizer.playSuccessSound();
  }, []);

  // Guided Cinematic Tour Runner
  const handleStartCinematicTour = () => {
    setIsCinematicTour(true);
    cinematicTourStep.current = 0;
    runNextCinematicStop();
  };

  const runNextCinematicStop = () => {
    if (cinematicTourStep.current >= VILLAGE_MUSICIANS.length) {
      setIsCinematicTour(false);
      return;
    }
    const currentM = VILLAGE_MUSICIANS[cinematicTourStep.current];
    handleFastTravel(currentM.id);
    setTimeout(() => {
      setActiveMusicianDialogue(currentM);
      cinematicTourStep.current += 1;
    }, 1200);
  };

  // Complete Quest Handler
  const handleCompleteQuest = (musicianId: string) => {
    setCompletedQuests((prev) => new Set([...prev, musicianId]));
  };

  // Touch Joystick Touch Handlers
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    joystickCenter.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!joystickCenter.current) return;
    const touch = e.touches[0];
    const dx = touch.clientX - joystickCenter.current.x;
    const dy = touch.clientY - joystickCenter.current.y;
    const dist = Math.hypot(dx, dy);
    const maxRadius = 40;

    if (dist > 5) {
      joystickVector.current = {
        x: Math.max(-1, Math.min(1, dx / maxRadius)),
        y: Math.max(-1, Math.min(1, dy / maxRadius)),
      };
    } else {
      joystickVector.current = { x: 0, y: 0 };
    }
  };

  const handleTouchEnd = () => {
    joystickCenter.current = null;
    joystickVector.current = { x: 0, y: 0 };
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen min-h-[600px] bg-stone-900 overflow-hidden select-none font-sans"
    >
      {/* 3D WebGL Canvas */}
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="w-full h-full block cursor-crosshair"
      />

      {/* Return to Main Screen Button */}
      <div className="absolute top-4 left-4 z-30 pointer-events-auto">
        <button
          onClick={() => navigate('/')}
          className="py-2.5 px-4 rounded-2xl bg-stone-900/90 hover:bg-stone-950 text-amber-100 hover:text-white text-xs font-semibold backdrop-blur-md border border-amber-500/40 shadow-xl transition-all flex items-center gap-2 cursor-pointer active:scale-95 group hover:border-amber-300"
          aria-label="Return to Main Screen"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400 group-hover:-translate-x-1 transition-transform" />
          <Home className="w-4 h-4 text-amber-300" />
          <span>Return to Main Screen</span>
        </button>
      </div>

      {/* Top Floating Storyline Quest Banner */}
      <div className="absolute top-18 md:top-4 left-4 right-4 md:left-60 md:right-52 max-w-xl mx-auto z-20 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-md border border-amber-300/80 rounded-2xl p-3 sm:p-4 shadow-lg pointer-events-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-800 text-amber-100 flex items-center justify-center shrink-0 shadow-xs font-serif font-bold">
              {activeQuestChapter <= 8 ? activeQuestChapter : '✓'}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                {activeQuestChapter <= 8
                  ? `Active Quest • Chapter ${activeQuestChapter}`
                  : 'All Village Quests Mastered!'}
              </span>
              <h3 className="font-serif font-bold text-stone-900 text-xs sm:text-sm">
                {activeQuestChapter <= 8
                  ? activeQuestMusician.questTitle
                  : 'Nada Brahma Awakened in Sangeet Gram'}
              </h3>
              <p className="text-[11px] text-stone-600 hidden sm:block">
                {activeQuestChapter <= 8
                  ? activeQuestMusician.questObjective
                  : 'You have gathered all 8 sacred seals of the acoustic traditions.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {activeQuestChapter <= 8 && (
              <button
                onClick={() => handleFastTravel(activeQuestMusician.id)}
                className="py-1.5 px-3 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Footprints className="w-3.5 h-3.5 text-amber-700" />
                <span className="hidden sm:inline">Guide to Master</span>
              </button>
            )}

            <button
              onClick={() => setIsJournalOpen(true)}
              className="py-1.5 px-3 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Journal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Mini-Map in Top Right */}
      <div className="absolute top-4 right-4 z-20 hidden md:block">
        <div className="bg-stone-900/80 backdrop-blur-md border border-white/20 rounded-2xl p-2.5 shadow-xl text-white w-44">
          <div className="flex items-center justify-between mb-1.5 text-[10px] uppercase font-bold text-amber-400">
            <span className="flex items-center gap-1">
              <Compass className="w-3 h-3 text-amber-400" />
              Sangeet Gram Map
            </span>
            <span>8 Masters</span>
          </div>

          {/* Minimap graphic representation */}
          <div className="relative w-38 h-38 bg-amber-950/60 rounded-xl border border-white/10 overflow-hidden mx-auto">
            {/* Center Great Banyan Tree */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-emerald-600 border border-emerald-400" />

            {/* Musicians pins */}
            {VILLAGE_MUSICIANS.map((m) => {
              // Map 3D coordinates [-40, 40] to [0%, 100%]
              const leftPercent = ((m.position[0] + 40) / 80) * 100;
              const topPercent = ((m.position[2] + 40) / 80) * 100;
              const isCompleted = completedQuests.has(m.id);

              return (
                <div
                  key={m.id}
                  title={`${m.name} (${m.instrumentName})`}
                  className={`absolute w-2.5 h-2.5 rounded-full -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-150 cursor-pointer ${
                    isCompleted
                      ? 'bg-emerald-400 ring-1 ring-white'
                      : 'bg-amber-400 ring-1 ring-amber-200 animate-pulse'
                  }`}
                  style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
                  onClick={() => handleFastTravel(m.id)}
                />
              );
            })}

            {/* Current Player Character Location Dot */}
            <div
              className="absolute w-3.5 h-3.5 rounded-full bg-rose-500 border-2 border-white -translate-x-1/2 -translate-y-1/2 shadow-sm transition-all"
              style={{
                left: `${((playerPos.current.x + 40) / 80) * 100}%`,
                top: `${((playerPos.current.z + 40) / 80) * 100}%`,
              }}
            />
          </div>

          <div className="flex items-center justify-between text-[9px] text-stone-400 mt-1.5 px-0.5">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> You
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Master
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Met
            </span>
          </div>
        </div>
      </div>

      {/* Floating Controls Toolbar (Atmosphere, Audio, Camera) in Top Left */}
      <div className="absolute top-20 sm:top-24 left-4 z-20 flex flex-col gap-2">
        {/* Audio Toggle */}
        <button
          onClick={() => setIsAudioEnabled((prev) => !prev)}
          className={`w-10 h-10 rounded-2xl flex items-center justify-center backdrop-blur-md border shadow-md transition-all cursor-pointer ${
            isAudioEnabled
              ? 'bg-amber-800 text-white border-amber-600'
              : 'bg-white/80 text-stone-700 border-stone-200 hover:bg-white'
          }`}
          title={isAudioEnabled ? 'Mute Ambient Tanpura' : 'Enable Ambient Tanpura'}
        >
          {isAudioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Atmosphere Sun/Sunset/Night Toggle */}
        <button
          onClick={() => {
            if (atmosphere === 'golden') setAtmosphere('day');
            else if (atmosphere === 'day') setAtmosphere('night');
            else setAtmosphere('golden');
          }}
          className="w-10 h-10 rounded-2xl bg-white/80 hover:bg-white text-stone-700 border border-stone-200 backdrop-blur-md flex items-center justify-center shadow-md transition-all cursor-pointer"
          title={`Current Atmosphere: ${atmosphere}. Click to switch`}
        >
          {atmosphere === 'golden' && <Sunset className="w-4 h-4 text-amber-600" />}
          {atmosphere === 'day' && <Sun className="w-4 h-4 text-yellow-500" />}
          {atmosphere === 'night' && <Moon className="w-4 h-4 text-indigo-500" />}
        </button>

        {/* Camera Perspective Toggle */}
        <button
          onClick={() => setCameraMode((prev) => (prev === 'follow' ? 'topdown' : 'follow'))}
          className={`w-10 h-10 rounded-2xl flex items-center justify-center backdrop-blur-md border shadow-md transition-all cursor-pointer ${
            cameraMode === 'topdown'
              ? 'bg-amber-800 text-white border-amber-600'
              : 'bg-white/80 text-stone-700 border-stone-200 hover:bg-white'
          }`}
          title={cameraMode === 'follow' ? 'Switch to Top-down Drone Map' : 'Switch to 3rd-Person Follow'}
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Proximity Interaction Prompt (When near a musician) */}
      {nearestMusician && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 animate-in zoom-in-95 duration-150">
          <button
            onClick={() => setActiveMusicianDialogue(nearestMusician)}
            className="group px-6 py-3.5 rounded-2xl bg-amber-900/90 hover:bg-amber-950 text-white border-2 border-amber-400 shadow-2xl backdrop-blur-md flex items-center gap-3 transition-all cursor-pointer hover:scale-105"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-bold text-xs">
              E
            </div>
            <div className="text-left">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300 block">
                Talk with Maestro ({nearestMusician.zoneName})
              </span>
              <span className="font-serif font-bold text-sm sm:text-base text-white">
                {nearestMusician.name} • Playing {nearestMusician.instrumentName}
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-amber-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}

      {/* On-Screen Touch Joystick for Mobile / Tablet */}
      {isTouchDevice && (
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="absolute bottom-6 left-6 z-20 w-24 h-24 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/40 flex items-center justify-center touch-none"
        >
          <div
            className="w-10 h-10 rounded-full bg-amber-500/80 border-2 border-white shadow-md transition-transform"
            style={{
              transform: `translate(${joystickVector.current.x * 24}px, ${
                joystickVector.current.y * 24
              }px)`,
            }}
          />
        </div>
      )}

      {/* Bottom Exploration Status & Fast Access Bar */}
      <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none flex items-center justify-between">
        {/* Movement Instruction Pill */}
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900/75 backdrop-blur-md border border-white/20 text-stone-200 text-xs shadow-md pointer-events-auto">
          <span className="font-mono bg-white/20 px-1.5 py-0.5 rounded text-[11px] font-bold">
            W A S D
          </span>
          <span>or click ground to walk</span>
          <span className="text-stone-400">•</span>
          <span className="font-mono bg-white/20 px-1.5 py-0.5 rounded text-[11px] font-bold">
            E
          </span>
          <span>talk to musician</span>
        </div>

        {/* Quick Links to Instruments Catalog & Games */}
        <div className="flex items-center gap-2 pointer-events-auto ml-auto">
          <button
            onClick={() => navigate('/instruments')}
            className="py-2 px-3.5 rounded-xl bg-white/90 hover:bg-white text-stone-800 text-xs font-semibold border border-stone-300 shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-amber-700" />
            <span>All Instruments Catalog</span>
          </button>

          <button
            onClick={() => navigate('/games')}
            className="py-2 px-3.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Games</span>
          </button>
        </div>
      </div>

      {/* Dialogue Modal for nearest/selected Musician */}
      {activeMusicianDialogue && (
        <StorylineDialogModal
          musician={activeMusicianDialogue}
          isQuestCompleted={completedQuests.has(activeMusicianDialogue.id)}
          onCompleteQuest={handleCompleteQuest}
          onClose={() => setActiveMusicianDialogue(null)}
          onViewFullInstrument={(slug) => navigate(`/instruments/${slug}`)}
        />
      )}

      {/* Storyline Quest Journal Modal */}
      {isJournalOpen && (
        <StorylineJournalModal
          completedQuests={completedQuests}
          activeQuestChapter={activeQuestChapter}
          onFastTravel={handleFastTravel}
          onStartCinematicTour={handleStartCinematicTour}
          onResetStory={() => setCompletedQuests(new Set())}
          onClose={() => setIsJournalOpen(false)}
        />
      )}
    </div>
  );
};
