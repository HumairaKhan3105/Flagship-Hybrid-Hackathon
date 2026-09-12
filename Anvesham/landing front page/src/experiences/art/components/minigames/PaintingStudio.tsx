import React, { useEffect, useRef, useState } from 'react';
import { CraftRegion, SavedArtwork } from '../../types';
import { sound } from '../../utils/soundEngine';
import confetti from 'canvas-confetti';
import { 
  Undo2, Redo2, Eraser, Paintbrush, PenTool, PaintBucket, 
  Download, Save, Trash2, CheckCircle, Sparkles, ChevronLeft 
} from 'lucide-react';

interface PaintingStudioProps {
  region: CraftRegion;
  onSaveArtwork: (artwork: SavedArtwork) => void;
  onBackToWorld: () => void;
  initialArtwork?: SavedArtwork | null;
}

// Traditional Mineral / Herbal Indian Color Palette
const TRADITIONAL_PALETTE = [
  { name: 'Kohl Lampblack', hex: '#18181b', naturalSource: 'Earthen mustard lamp soot' },
  { name: 'Sindoor Vermilion', hex: '#dc2626', naturalSource: 'Kusum & marigold petals' },
  { name: 'Haldi Ochre', hex: '#f59e0b', naturalSource: 'Fresh wild turmeric & pollen' },
  { name: 'Indigo Blue', hex: '#2563eb', naturalSource: 'Indigofera tinctoria leaf extract' },
  { name: 'Neem & Bael Green', hex: '#16a34a', naturalSource: 'Wood apple & henna leaves' },
  { name: 'Geru Terracotta', hex: '#b45309', naturalSource: 'Red mountain hematite clay' },
  { name: 'Chuna & Rice White', hex: '#fdfbf7', naturalSource: 'Ground rice paste & conch shell' },
  { name: 'Kesari Marigold', hex: '#ea580c', naturalSource: 'Sacred saffron & marigold' },
  { name: 'Pari Lotus Pink', hex: '#ec4899', naturalSource: 'Rose & palash flower extract' },
  { name: 'Deep Jamun Violet', hex: '#7c3aed', naturalSource: 'Black plum & madder root' },
];

export const PaintingStudio: React.FC<PaintingStudioProps> = ({
  region,
  onSaveArtwork,
  onBackToWorld,
  initialArtwork,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTool, setSelectedTool] = useState<'pencil' | 'brush' | 'fill' | 'eraser' | 'stamp'>('brush');
  const [selectedColor, setSelectedColor] = useState<string>('#18181b');
  const [brushSize, setBrushSize] = useState<number>(4);
  const [selectedTemplate, setSelectedTemplate] = useState<string>(
    region.paintingTemplates[0]?.id || 'matsya_fish'
  );
  const [selectedStamp, setSelectedStamp] = useState<'lotus' | 'fish' | 'peacock' | 'sun' | 'warli_human'>('fish');
  const [title, setTitle] = useState<string>('Sacred Mithila Creation');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Undo/Redo stack (stores ImageData)
  const historyRef = useRef<ImageData[]>([]);
  const historyIndexRef = useRef<number>(-1);

  const isDrawingRef = useRef<boolean>(false);
  const lastPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Draw Template Outlines
  const drawTemplate = (ctx: CanvasRenderingContext2D, templateId: string) => {
    ctx.save();
    ctx.strokeStyle = '#27272a';
    ctx.fillStyle = '#27272a';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const cx = 400;
    const cy = 270;

    if (templateId === 'matsya_fish') {
      // Twin Sacred Fish (Matsya) Motif of Mithila
      // Fish 1 (Top swimming right)
      ctx.beginPath();
      ctx.ellipse(cx - 30, cy - 60, 140, 55, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Fish double line
      ctx.beginPath();
      ctx.ellipse(cx - 30, cy - 60, 132, 47, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Tail
      ctx.beginPath();
      ctx.moveTo(cx - 170, cy - 60);
      ctx.lineTo(cx - 240, cy - 110);
      ctx.lineTo(cx - 210, cy - 60);
      ctx.lineTo(cx - 240, cy - 10);
      ctx.closePath();
      ctx.stroke();

      // Big Eye
      ctx.beginPath();
      ctx.arc(cx + 60, cy - 65, 12, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx + 60, cy - 65, 5, 0, Math.PI * 2);
      ctx.fill();

      // Fish 2 (Bottom swimming left)
      ctx.beginPath();
      ctx.ellipse(cx + 30, cy + 70, 140, 55, Math.PI, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(cx + 30, cy + 70, 132, 47, Math.PI, 0, Math.PI * 2);
      ctx.stroke();

      // Tail
      ctx.beginPath();
      ctx.moveTo(cx + 170, cy + 70);
      ctx.lineTo(cx + 240, cy + 20);
      ctx.lineTo(cx + 210, cy + 70);
      ctx.lineTo(cx + 240, cy + 120);
      ctx.closePath();
      ctx.stroke();

      // Big Eye
      ctx.beginPath();
      ctx.arc(cx - 60, cy + 65, 12, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx - 60, cy + 65, 5, 0, Math.PI * 2);
      ctx.fill();

      // Traditional Water Ripple & Lotus
      ctx.beginPath();
      ctx.arc(cx, cy + 180, 45, Math.PI, 0);
      ctx.stroke();
    } else if (templateId === 'mayur_peacock') {
      // Royal Peacock (Mayur) with Fan Feathers
      // Body
      ctx.beginPath();
      ctx.ellipse(cx - 60, cy + 30, 45, 90, 0.3, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(cx - 60, cy + 30, 39, 82, 0.3, 0, Math.PI * 2);
      ctx.stroke();

      // Neck & Head
      ctx.beginPath();
      ctx.moveTo(cx - 60, cy - 50);
      ctx.bezierCurveTo(cx - 80, cy - 100, cx - 40, cy - 130, cx - 20, cy - 140);
      ctx.bezierCurveTo(cx + 10, cy - 120, cx - 20, cy - 70, cx - 35, cy - 50);
      ctx.stroke();

      // Eye
      ctx.beginPath();
      ctx.arc(cx - 15, cy - 130, 6, 0, Math.PI * 2);
      ctx.fill();

      // Fan Feathers (Curling circular eyes)
      for (let i = -4; i <= 4; i++) {
        const angle = (i * Math.PI) / 12;
        const fx = cx + 80 + Math.cos(angle) * 160;
        const fy = cy - 20 + Math.sin(angle) * 160;
        ctx.beginPath();
        ctx.moveTo(cx - 20, cy + 20);
        ctx.quadraticCurveTo(cx + 40, cy, fx, fy);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(fx, fy, 18, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(fx, fy, 8, 0, Math.PI * 2);
        ctx.stroke();
      }
    } else if (templateId === 'surya_sun') {
      // Celestial Sun of Mithila (Surya Deva)
      ctx.beginPath();
      ctx.arc(cx, cy, 90, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, 82, 0, Math.PI * 2);
      ctx.stroke();

      // Peaceful eyes and tilak
      ctx.beginPath();
      ctx.ellipse(cx - 35, cy - 15, 18, 9, 0, 0, Math.PI * 2);
      ctx.ellipse(cx + 35, cy - 15, 18, 9, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx - 35, cy - 15, 5, 0, Math.PI * 2);
      ctx.arc(cx + 35, cy - 15, 5, 0, Math.PI * 2);
      ctx.fill();

      // Smile
      ctx.beginPath();
      ctx.arc(cx, cy + 20, 24, 0.2, Math.PI - 0.2);
      ctx.stroke();

      // Radiating Flaming Rays
      for (let i = 0; i < 16; i++) {
        const a = (i * Math.PI * 2) / 16;
        const r1 = 96;
        const r2 = 145;
        const x1 = cx + Math.cos(a) * r1;
        const y1 = cy + Math.sin(a) * r1;
        const x2 = cx + Math.cos(a) * r2;
        const y2 = cy + Math.sin(a) * r2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    } else if (templateId === 'tarpa_dance' || templateId === 'tarpa') {
      // Warli Spiral Dance
      for (let i = 0; i < 14; i++) {
        const a = i * 0.45;
        const r = 50 + i * 12;
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r;

        // Two inverted triangles
        ctx.beginPath();
        ctx.moveTo(x - 10, y - 12);
        ctx.lineTo(x + 10, y - 12);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x - 10, y + 12);
        ctx.lineTo(x + 10, y + 12);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.stroke();

        // Head
        ctx.beginPath();
        ctx.arc(x, y - 18, 6, 0, Math.PI * 2);
        ctx.stroke();
      }
    } else if (templateId === 'jagannath_triad' || templateId === 'jagannath') {
      // Lord Jagannath face
      ctx.beginPath();
      ctx.arc(cx, cy, 120, 0, Math.PI * 2);
      ctx.stroke();
      // Round chakra eyes
      ctx.beginPath();
      ctx.arc(cx - 50, cy - 20, 32, 0, Math.PI * 2);
      ctx.arc(cx + 50, cy - 20, 32, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx - 50, cy - 20, 12, 0, Math.PI * 2);
      ctx.arc(cx + 50, cy - 20, 12, 0, Math.PI * 2);
      ctx.fill();
      // Crescent smile
      ctx.beginPath();
      ctx.arc(cx, cy + 40, 45, 0.2, Math.PI - 0.2);
      ctx.stroke();
    } else {
      // Freehand blank canvas with ornate Mithila border
      ctx.strokeRect(40, 40, 720, 460);
      ctx.strokeRect(48, 48, 704, 444);
    }

    // Outer double border
    ctx.strokeRect(18, 18, 764, 504);
    ctx.strokeRect(26, 26, 748, 488);

    ctx.restore();
  };

  // Initialize Canvas
  const initCanvas = (templateId: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Background handmade paper wash (warm ivory / terracotta)
    ctx.fillStyle = region.theme === 'maharashtra_warli' ? '#78350f' : '#fdf8f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (initialArtwork) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        pushHistory();
      };
      img.src = initialArtwork.dataUrl;
    } else {
      drawTemplate(ctx, templateId);
      pushHistory();
    }
  };

  useEffect(() => {
    initCanvas(selectedTemplate);
  }, [selectedTemplate]);

  const pushHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    // Trim forward history if we rewound
    historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
    historyRef.current.push(imgData);
    historyIndexRef.current = historyRef.current.length - 1;
  };

  const handleUndo = () => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current -= 1;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;
      ctx.putImageData(historyRef.current[historyIndexRef.current], 0, 0);
      sound.playClick();
    }
  };

  const handleRedo = () => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current += 1;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;
      ctx.putImageData(historyRef.current[historyIndexRef.current], 0, 0);
      sound.playClick();
    }
  };

  // Flood Fill Algorithm
  const floodFill = (startX: number, startY: number, fillColorHex: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    // Convert hex to rgb
    const fillR = parseInt(fillColorHex.slice(1, 3), 16);
    const fillG = parseInt(fillColorHex.slice(3, 5), 16);
    const fillB = parseInt(fillColorHex.slice(5, 7), 16);

    const startIndex = (startY * canvas.width + startX) * 4;
    const targetR = data[startIndex];
    const targetG = data[startIndex + 1];
    const targetB = data[startIndex + 2];
    const targetA = data[startIndex + 3];

    // Don't fill if same color
    if (
      Math.abs(targetR - fillR) < 10 &&
      Math.abs(targetG - fillG) < 10 &&
      Math.abs(targetB - fillB) < 10
    ) {
      return;
    }

    const matchTarget = (idx: number) => {
      return (
        Math.abs(data[idx] - targetR) < 30 &&
        Math.abs(data[idx + 1] - targetG) < 30 &&
        Math.abs(data[idx + 2] - targetB) < 30 &&
        Math.abs(data[idx + 3] - targetA) < 30
      );
    };

    // Queue-based flood fill with pixel spanning
    const queue: [number, number][] = [[startX, startY]];
    const visited = new Uint8Array(canvas.width * canvas.height);

    while (queue.length > 0) {
      const [x, y] = queue.pop()!;
      const idx = (y * canvas.width + x) * 4;
      const pos = y * canvas.width + x;

      if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) continue;
      if (visited[pos]) continue;
      if (!matchTarget(idx)) continue;

      visited[pos] = 1;
      data[idx] = fillR;
      data[idx + 1] = fillG;
      data[idx + 2] = fillB;
      data[idx + 3] = 255;

      if (x + 1 < canvas.width) queue.push([x + 1, y]);
      if (x - 1 >= 0) queue.push([x - 1, y]);
      if (y + 1 < canvas.height) queue.push([x, y + 1]);
      if (y - 1 >= 0) queue.push([x, y - 1]);
    }

    ctx.putImageData(imgData, 0, 0);
    pushHistory();
    sound.playPaintingStroke();
  };

  // Stamp Tool
  const placeStamp = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    ctx.save();
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;
    ctx.lineWidth = 3;

    if (selectedStamp === 'lotus') {
      // Sacred Lotus
      ctx.beginPath();
      ctx.arc(x, y, 20, Math.PI, 0);
      ctx.stroke();
      // Petals
      ctx.beginPath();
      ctx.ellipse(x, y - 25, 10, 20, 0, 0, Math.PI * 2);
      ctx.ellipse(x - 18, y - 18, 10, 18, -Math.PI / 4, 0, Math.PI * 2);
      ctx.ellipse(x + 18, y - 18, 10, 18, Math.PI / 4, 0, Math.PI * 2);
      ctx.stroke();
    } else if (selectedStamp === 'fish') {
      // Little Auspicious Fish
      ctx.beginPath();
      ctx.ellipse(x, y, 30, 14, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x - 30, y);
      ctx.lineTo(x - 45, y - 12);
      ctx.lineTo(x - 40, y);
      ctx.lineTo(x - 45, y + 12);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x + 18, y - 3, 3, 0, Math.PI * 2);
      ctx.fill();
    } else if (selectedStamp === 'sun') {
      // Mini Sun
      ctx.beginPath();
      ctx.arc(x, y, 16, 0, Math.PI * 2);
      ctx.stroke();
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI * 2) / 8;
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(a) * 18, y + Math.sin(a) * 18);
        ctx.lineTo(x + Math.cos(a) * 26, y + Math.sin(a) * 26);
        ctx.stroke();
      }
    } else if (selectedStamp === 'warli_human') {
      // Warli Dancing Person
      ctx.beginPath();
      ctx.moveTo(x - 8, y - 10);
      ctx.lineTo(x + 8, y - 10);
      ctx.lineTo(x, y);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x - 8, y + 10);
      ctx.lineTo(x + 8, y + 10);
      ctx.lineTo(x, y);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x, y - 16, 5, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
    pushHistory();
    sound.playPaintingStroke();
  };

  // Mouse / Touch drawing handlers
  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: Math.round((touch.clientX - rect.left) * scaleX),
        y: Math.round((touch.clientY - rect.top) * scaleY),
      };
    } else {
      return {
        x: Math.round((e.clientX - rect.left) * scaleX),
        y: Math.round((e.clientY - rect.top) * scaleY),
      };
    }
  };

  const handleStartDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const { x, y } = getCanvasCoordinates(e);

    if (selectedTool === 'fill') {
      floodFill(x, y, selectedColor);
      return;
    }

    if (selectedTool === 'stamp') {
      placeStamp(x, y);
      return;
    }

    isDrawingRef.current = true;
    lastPosRef.current = { x, y };

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = selectedTool === 'eraser' 
      ? (region.theme === 'maharashtra_warli' ? '#78350f' : '#fdf8f0') 
      : selectedColor;
    ctx.fill();
  };

  const handleDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const { x, y } = getCanvasCoordinates(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
    ctx.lineTo(x, y);

    if (selectedTool === 'eraser') {
      ctx.strokeStyle = region.theme === 'maharashtra_warli' ? '#78350f' : '#fdf8f0';
      ctx.lineWidth = brushSize * 3;
    } else if (selectedTool === 'pencil') {
      ctx.strokeStyle = selectedColor;
      ctx.lineWidth = 2;
    } else {
      // Brush
      ctx.strokeStyle = selectedColor;
      ctx.lineWidth = brushSize;
    }

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    lastPosRef.current = { x, y };
  };

  const handleEndDraw = () => {
    if (isDrawingRef.current) {
      isDrawingRef.current = false;
      pushHistory();
      sound.playPaintingStroke();
    }
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    const artwork: SavedArtwork = {
      id: initialArtwork?.id || 'art_' + Date.now(),
      title: title || `${region.craftName} Creation`,
      craftId: region.id,
      craftName: region.craftName,
      region: region.state,
      dataUrl,
      createdAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      xpEarned: 50,
    };

    onSaveArtwork(artwork);
    setIsSaved(true);
    sound.playLevelVictory();

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#dc2626', '#10b981', '#2563eb'],
    });
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `KalaYatra_${region.craftName.replace(/\s+/g, '_')}_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    sound.playClick();
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-stone-950 text-amber-50 select-none overflow-hidden">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-stone-900 border-b border-amber-500/30 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onBackToWorld();
            }}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-500/20 transition-all active:scale-95"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h2 className="text-lg font-bold font-heading text-amber-400">
              {region.craftName} Studio
            </h2>
            <p className="text-xs text-stone-400">
              Traditional Indian Canvas • {region.state}
            </p>
          </div>
        </div>

        {/* Artwork Title Input */}
        <div className="hidden sm:flex items-center gap-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-stone-800 border border-amber-500/30 text-amber-200 text-sm px-3 py-1.5 rounded-lg focus:outline-none focus:border-amber-400 w-64 text-center font-medium"
            placeholder="Name your artwork..."
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold border border-stone-700 transition-all active:scale-95"
          >
            <Download size={14} />
            <span className="hidden md:inline">Download</span>
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-sm font-bold shadow-lg shadow-orange-950/50 border border-amber-400/40 transition-all hover:scale-105 active:scale-95 glow-heritage"
          >
            <Save size={16} />
            <span>SAVE ARTWORK (+50 XP)</span>
          </button>
        </div>
      </div>

      {/* Main Studio Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Toolbar */}
        <div className="w-18 sm:w-20 bg-stone-900/95 border-r border-amber-500/20 flex flex-col items-center py-4 gap-3 z-10 overflow-y-auto">
          {/* Tool selectors */}
          <button
            onClick={() => {
              setSelectedTool('brush');
              sound.playClick();
            }}
            className={`p-3 rounded-2xl transition-all ${
              selectedTool === 'brush'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-950/60 scale-105'
                : 'text-stone-400 hover:bg-stone-800 hover:text-amber-300'
            }`}
            title="Traditional Brush"
          >
            <Paintbrush size={22} />
          </button>

          <button
            onClick={() => {
              setSelectedTool('pencil');
              sound.playClick();
            }}
            className={`p-3 rounded-2xl transition-all ${
              selectedTool === 'pencil'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-950/60 scale-105'
                : 'text-stone-400 hover:bg-stone-800 hover:text-amber-300'
            }`}
            title="Fine Bamboo Nib Pen"
          >
            <PenTool size={22} />
          </button>

          <button
            onClick={() => {
              setSelectedTool('fill');
              sound.playClick();
            }}
            className={`p-3 rounded-2xl transition-all ${
              selectedTool === 'fill'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-950/60 scale-105'
                : 'text-stone-400 hover:bg-stone-800 hover:text-amber-300'
            }`}
            title="Bharni Color Bucket Fill"
          >
            <PaintBucket size={22} />
          </button>

          <button
            onClick={() => {
              setSelectedTool('stamp');
              sound.playClick();
            }}
            className={`p-3 rounded-2xl transition-all ${
              selectedTool === 'stamp'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-950/60 scale-105'
                : 'text-stone-400 hover:bg-stone-800 hover:text-amber-300'
            }`}
            title="Sacred Stamp Motifs"
          >
            <Sparkles size={22} />
          </button>

          <button
            onClick={() => {
              setSelectedTool('eraser');
              sound.playClick();
            }}
            className={`p-3 rounded-2xl transition-all ${
              selectedTool === 'eraser'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-950/60 scale-105'
                : 'text-stone-400 hover:bg-stone-800 hover:text-amber-300'
            }`}
            title="Eraser"
          >
            <Eraser size={22} />
          </button>

          <div className="w-8 h-px bg-stone-800 my-1" />

          {/* Undo / Redo */}
          <button
            onClick={handleUndo}
            className="p-2.5 rounded-xl text-stone-400 hover:bg-stone-800 hover:text-amber-200 transition-all active:scale-95"
            title="Undo"
          >
            <Undo2 size={18} />
          </button>
          <button
            onClick={handleRedo}
            className="p-2.5 rounded-xl text-stone-400 hover:bg-stone-800 hover:text-amber-200 transition-all active:scale-95"
            title="Redo"
          >
            <Redo2 size={18} />
          </button>

          <div className="w-8 h-px bg-stone-800 my-1" />

          {/* Clear Canvas */}
          <button
            onClick={() => {
              sound.playClick();
              initCanvas('blank');
            }}
            className="p-2.5 rounded-xl text-red-400 hover:bg-red-950/40 transition-all active:scale-95"
            title="Clear Canvas"
          >
            <Trash2 size={18} />
          </button>
        </div>

        {/* Center Canvas Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 bg-stone-950 overflow-auto">
          {/* Canvas Wrapper */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-amber-900/60 bg-amber-50">
            <canvas
              ref={canvasRef}
              width={800}
              height={540}
              onMouseDown={handleStartDraw}
              onMouseMove={handleDraw}
              onMouseUp={handleEndDraw}
              onMouseLeave={handleEndDraw}
              onTouchStart={handleStartDraw}
              onTouchMove={handleDraw}
              onTouchEnd={handleEndDraw}
              className="canvas-cursor-brush touch-none max-w-full h-auto block"
              style={{
                width: '100%',
                maxWidth: '800px',
                aspectRatio: '800 / 540',
              }}
            />
          </div>

          {/* Size Slider & Stamp Options */}
          <div className="mt-3 flex flex-wrap items-center gap-4 bg-stone-900/90 px-4 py-2 rounded-xl border border-amber-500/20 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-stone-400">Brush Size:</span>
              <input
                type="range"
                min={2}
                max={24}
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-24 accent-amber-500"
              />
              <span className="text-amber-300 font-mono w-4">{brushSize}</span>
            </div>

            {selectedTool === 'stamp' && (
              <div className="flex items-center gap-1.5 pl-3 border-l border-stone-800">
                <span className="text-stone-400">Stamp:</span>
                {(['fish', 'lotus', 'sun', 'warli_human'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setSelectedStamp(s);
                      sound.playClick();
                    }}
                    className={`px-2 py-0.5 rounded capitalize ${
                      selectedStamp === s ? 'bg-amber-600 text-white' : 'bg-stone-800 text-stone-300'
                    }`}
                  >
                    {s.replace('_', ' ')}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: Colors & Templates */}
        <div className="w-64 sm:w-72 bg-stone-900/95 border-l border-amber-500/20 p-4 flex flex-col gap-5 overflow-y-auto z-10">
          {/* Color Palette */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2.5">
              Traditional Herbal Pigments
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {TRADITIONAL_PALETTE.map((color) => (
                <button
                  key={color.name}
                  onClick={() => {
                    setSelectedColor(color.hex);
                    sound.playClick();
                  }}
                  className={`w-9 h-9 rounded-xl transition-all relative border-2 ${
                    selectedColor === color.hex
                      ? 'border-amber-400 scale-110 shadow-lg'
                      : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={`${color.name} (${color.naturalSource})`}
                >
                  {selectedColor === color.hex && (
                    <span className="absolute inset-0 flex items-center justify-center text-xs">
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>
            {/* Color description */}
            <p className="text-[11px] text-stone-400 mt-2 italic">
              {TRADITIONAL_PALETTE.find((c) => c.hex === selectedColor)?.name}:{' '}
              {TRADITIONAL_PALETTE.find((c) => c.hex === selectedColor)?.naturalSource}
            </p>
          </div>

          {/* Templates Library */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2.5">
              Heritage Templates
            </h3>
            <div className="space-y-2">
              {region.paintingTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => {
                    setSelectedTemplate(template.id);
                    sound.playClick();
                  }}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all ${
                    selectedTemplate === template.id
                      ? 'bg-amber-950/60 border-amber-500/80 text-amber-200'
                      : 'bg-stone-800/60 border-stone-800 hover:border-amber-500/40 text-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-amber-300">
                      {template.name}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-900/60 text-amber-300">
                      {template.difficulty}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-400 mt-1 line-clamp-2">
                    {template.description}
                  </p>
                </button>
              ))}

              <button
                onClick={() => {
                  setSelectedTemplate('blank');
                  sound.playClick();
                }}
                className={`w-full text-left p-2.5 rounded-xl border transition-all ${
                  selectedTemplate === 'blank'
                    ? 'bg-amber-950/60 border-amber-500/80 text-amber-200'
                    : 'bg-stone-800/60 border-stone-800 hover:border-amber-500/40 text-stone-300'
                }`}
              >
                <div className="font-semibold text-xs text-amber-300">
                  ✨ Blank Sacred Canvas
                </div>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Freehand drawing with ornate ceremonial double borders.
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Success Popup Modal */}
      {isSaved && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-b from-stone-900 to-stone-950 border-2 border-amber-500/60 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl glow-heritage">
            <div className="w-16 h-16 bg-amber-500/20 border-2 border-amber-400 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
              🎉
            </div>
            <h2 className="text-2xl font-bold font-heading text-amber-300">
              Painting Complete!
            </h2>
            <p className="text-stone-300 text-sm mt-2">
              Your authentic traditional artwork has been framed and saved to your personal gallery.
            </p>

            <div className="bg-stone-800/80 border border-amber-500/30 rounded-2xl p-4 my-6 flex justify-around">
              <div>
                <span className="text-xs text-stone-400 block">Reward</span>
                <span className="text-xl font-extrabold text-amber-400">+50 XP</span>
              </div>
              <div className="border-r border-stone-700" />
              <div>
                <span className="text-xs text-stone-400 block">Badge Unlocked</span>
                <span className="text-sm font-bold text-amber-200 flex items-center gap-1 justify-center">
                  🎨 Young Artist
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleDownload}
                className="flex-1 py-3 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl font-semibold text-sm transition-all"
              >
                Download PNG
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  onBackToWorld();
                }}
                className="flex-1 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold text-sm shadow-lg transition-all"
              >
                Continue Explorer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
