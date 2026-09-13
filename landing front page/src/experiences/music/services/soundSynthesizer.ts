// Web Audio API acoustic preview synthesizer for traditional Indian instruments
class SoundSynthesizer {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playCulturalRagaPreview(family: string, noteName: string = 'C4'): () => void {
    this.init();
    if (!this.ctx) return () => {};

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Map base note names to frequencies
    const noteMap: Record<string, number> = {
      'C3': 130.81,
      'D3': 146.83,
      'E3': 164.81,
      'F3': 174.61,
      'G3': 196.0,
      'A3': 220.0,
      'B3': 246.94,
      'C4': 261.63,
      'C#4': 277.18,
      'D4': 293.66,
      'E4': 329.63,
      'F4': 349.23,
      'F#4': 369.99,
      'G4': 392.0,
      'A4': 440.0,
      'Bb4': 466.16,
      'C5': 523.25,
    };

    const baseFreq = noteMap[noteName] || 261.63;

    if (family === 'String') {
      // Sitar / Veena style with characteristic melodic pull (meend)
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(baseFreq, now);
      // Meend glide up and down
      osc.frequency.linearRampToValueAtTime(baseFreq * 1.125, now + 0.4);
      osc.frequency.linearRampToValueAtTime(baseFreq * 1.25, now + 0.8);
      osc.frequency.linearRampToValueAtTime(baseFreq, now + 1.4);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);
    } else if (family === 'Wind') {
      // Bansuri / Shehnai flute breath tone with vibrato
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq, now);
      // Gentle warm microtonal vibrato
      osc.frequency.linearRampToValueAtTime(baseFreq * 1.01, now + 0.3);
      osc.frequency.linearRampToValueAtTime(baseFreq * 0.99, now + 0.6);
      osc.frequency.linearRampToValueAtTime(baseFreq * 1.01, now + 0.9);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.15);
      gain.gain.linearRampToValueAtTime(0.2, now + 1.5);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);
    } else if (family === 'Percussion') {
      // Resonant drum stroke (Na / Dha overtone)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq * 1.8, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.6, now + 0.25);

      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
    } else {
      // Warm acoustic harmonic tone
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, now);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.28, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);
    }

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 3.0);

    return () => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {
        // Ignored
      }
    };
  }

  // Play Indian percussion stroke (Dha, Dhin, Ta, Clap, Ghungroo)
  playPercussionBeat(type: 'dha' | 'dhin' | 'ta' | 'clap' | 'ting' = 'dha') {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    if (type === 'dha') {
      // Combined treble + bass stroke
      const oscBass = this.ctx.createOscillator();
      const gainBass = this.ctx.createGain();
      oscBass.type = 'sine';
      oscBass.frequency.setValueAtTime(120, now);
      oscBass.frequency.exponentialRampToValueAtTime(55, now + 0.28);
      gainBass.gain.setValueAtTime(0.6, now);
      gainBass.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      oscBass.connect(gainBass);
      gainBass.connect(this.ctx.destination);
      oscBass.start(now);
      oscBass.stop(now + 0.4);

      // Treble snap
      const oscTreble = this.ctx.createOscillator();
      const gainTreble = this.ctx.createGain();
      oscTreble.type = 'triangle';
      oscTreble.frequency.setValueAtTime(440, now);
      oscTreble.frequency.exponentialRampToValueAtTime(220, now + 0.12);
      gainTreble.gain.setValueAtTime(0.35, now);
      gainTreble.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      oscTreble.connect(gainTreble);
      gainTreble.connect(this.ctx.destination);
      oscTreble.start(now);
      oscTreble.stop(now + 0.2);
    } else if (type === 'dhin') {
      // Warm resonant bass stroke
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(90, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.3);
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.45);
    } else if (type === 'ta' || type === 'clap') {
      // Crisp dry rim stroke or clap
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.08);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'ting') {
      // Brass manjira / bell ring
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, now);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.85);
    }
  }

  // Play characteristic acoustic tone for Blind Sound Mystery game
  playInstrumentMysteryTone(slug: string) {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    if (slug === 'sitar') {
      // Sawtooth with meend glide and sympathetic overtone
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(277.18, now); // C#4
      osc.frequency.linearRampToValueAtTime(329.63, now + 0.5); // glide to E4
      osc.frequency.linearRampToValueAtTime(277.18, now + 1.1);
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2.4);
    } else if (slug === 'bansuri') {
      // Warm airy flute tone with breath vibrato
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now); // A4
      osc.frequency.linearRampToValueAtTime(445, now + 0.4);
      osc.frequency.linearRampToValueAtTime(438, now + 0.8);
      osc.frequency.linearRampToValueAtTime(440, now + 1.2);
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);
    } else if (slug === 'shehnai') {
      // High nasal double-reed acoustic wave
      osc.type = 'square';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.linearRampToValueAtTime(587.33, now + 0.3); // D5
      osc.frequency.linearRampToValueAtTime(523.25, now + 0.7);
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);
    } else if (slug === 'ghatam') {
      // Clay pot metallic-earth thud
      osc.type = 'sine';
      osc.frequency.setValueAtTime(360, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.18);
      gain.gain.setValueAtTime(0.55, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    } else if (slug === 'tabla') {
      this.playPercussionBeat('dha');
      return;
    } else if (slug === 'mridangam') {
      this.playPercussionBeat('dhin');
      return;
    } else {
      // Default melodious bell / string tone
      osc.type = 'sine';
      osc.frequency.setValueAtTime(392.0, now); // G4
      osc.frequency.linearRampToValueAtTime(440.0, now + 0.3);
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
    }

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 2.6);
  }

  // Chime feedback
  playSuccessSound() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      gain.gain.setValueAtTime(0.18, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.4);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.45);
    });
  }

  playErrorSound() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.linearRampToValueAtTime(110, now + 0.2);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.28);
  }

  private ambientTanpuraNodes: { osc: OscillatorNode; gain: GainNode }[] = [];

  startVillageAmbientDrone(volume: number = 0.08) {
    this.init();
    if (!this.ctx || this.ambientTanpuraNodes.length > 0) return;

    try {
      const frequencies = [146.83, 220.0, 293.66]; // D3, A3, D4 tanpura harmony
      const now = this.ctx.currentTime;

      frequencies.forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq + (i * 0.5), now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(volume * (1 - i * 0.2), now + 2.0);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now);

        this.ambientTanpuraNodes.push({ osc, gain });
      });
    } catch (e) {
      console.warn('Audio ambient initialization error:', e);
    }
  }

  stopVillageAmbientDrone() {
    if (this.ambientTanpuraNodes.length === 0) return;
    try {
      const now = this.ctx ? this.ctx.currentTime : 0;
      this.ambientTanpuraNodes.forEach(({ osc, gain }) => {
        if (this.ctx) {
          gain.gain.linearRampToValueAtTime(0.0001, now + 0.5);
          setTimeout(() => {
            try {
              osc.stop();
              osc.disconnect();
            } catch (e) {}
          }, 600);
        } else {
          osc.stop();
          osc.disconnect();
        }
      });
    } catch (e) {}
    this.ambientTanpuraNodes = [];
  }

  playVillageInstrumentSolo(
    type: 'bansuri' | 'tabla' | 'sitar' | 'shehnai' | 'veena' | 'mridangam' | 'dholak' | 'sarangi',
    volumeScale: number = 1.0
  ) {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const vol = Math.max(0.05, Math.min(1.0, volumeScale));

    if (type === 'bansuri') {
      // 4-note pastoral flute phrase: Pa - Dha - Sa - Re
      const notes = [392.0, 440.0, 523.25, 587.33];
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        const start = now + idx * 0.35;
        osc.frequency.setValueAtTime(freq, start);
        osc.frequency.linearRampToValueAtTime(freq * 1.015, start + 0.18);
        osc.frequency.linearRampToValueAtTime(freq, start + 0.32);

        gain.gain.setValueAtTime(0.001, start);
        gain.gain.linearRampToValueAtTime(0.28 * vol, start + 0.08);
        gain.gain.linearRampToValueAtTime(0.001, start + 0.38);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(start);
        osc.stop(start + 0.4);
      });
    } else if (type === 'tabla') {
      // Dha - Dhin - Dhin - Dha rhythm pattern
      const beats: ('dha' | 'dhin' | 'dhin' | 'dha')[] = ['dha', 'dhin', 'dhin', 'dha'];
      beats.forEach((b, i) => {
        setTimeout(() => this.playPercussionBeat(b), i * 320);
      });
    } else if (type === 'mridangam') {
      // Tha - Dhi - Thom - Nam pattern
      const beats: ('ta' | 'dhin' | 'dha' | 'ting')[] = ['ta', 'dhin', 'dha', 'ting'];
      beats.forEach((b, i) => {
        setTimeout(() => this.playPercussionBeat(b), i * 260);
      });
    } else if (type === 'dholak') {
      // Fast folk beat
      const beats: ('dha' | 'ta' | 'dha' | 'ta' | 'dhin')[] = ['dha', 'ta', 'dha', 'ta', 'dhin'];
      beats.forEach((b, i) => {
        setTimeout(() => this.playPercussionBeat(b), i * 180);
      });
    } else if (type === 'shehnai') {
      // Auspicious celebration motif
      const notes = [523.25, 587.33, 659.25, 783.99, 659.25];
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sawtooth';
        const start = now + idx * 0.28;
        osc.frequency.setValueAtTime(freq, start);
        osc.frequency.linearRampToValueAtTime(freq * 1.02, start + 0.12);

        gain.gain.setValueAtTime(0.001, start);
        gain.gain.linearRampToValueAtTime(0.18 * vol, start + 0.04);
        gain.gain.linearRampToValueAtTime(0.001, start + 0.27);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(start);
        osc.stop(start + 0.3);
      });
    } else if (type === 'sitar') {
      // Sitar Meend phrase in Raga Yaman (Ni - Re - Ga - Ma# - Pa)
      const frets = [246.94, 293.66, 329.63, 369.99, 392.0];
      frets.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sawtooth';
        const start = now + idx * 0.35;
        osc.frequency.setValueAtTime(freq, start);
        osc.frequency.linearRampToValueAtTime(freq * 1.08, start + 0.22); // meend pull

        gain.gain.setValueAtTime(0.001, start);
        gain.gain.linearRampToValueAtTime(0.24 * vol, start + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.5);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(start);
        osc.stop(start + 0.55);
      });
    } else if (type === 'veena') {
      // Deep resonant Carnatic Gamaka
      const notes = [196.0, 220.0, 246.94, 261.63];
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        const start = now + idx * 0.42;
        osc.frequency.setValueAtTime(freq, start);
        osc.frequency.linearRampToValueAtTime(freq * 1.06, start + 0.2);
        osc.frequency.linearRampToValueAtTime(freq, start + 0.38);

        gain.gain.setValueAtTime(0.001, start);
        gain.gain.linearRampToValueAtTime(0.3 * vol, start + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.7);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(start);
        osc.stop(start + 0.75);
      });
    } else {
      // Sarangi - bowed vocal glides with microtones
      const notes = [293.66, 311.13, 349.23, 392.0];
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        const start = now + idx * 0.4;
        osc.frequency.setValueAtTime(freq, start);
        osc.frequency.linearRampToValueAtTime(freq * 1.04, start + 0.2);
        osc.frequency.linearRampToValueAtTime(freq * 0.98, start + 0.35);

        gain.gain.setValueAtTime(0.001, start);
        gain.gain.linearRampToValueAtTime(0.22 * vol, start + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(start);
        osc.stop(start + 0.65);
      });
    }
  }
}

export const soundSynthesizer = new SoundSynthesizer();
