/**
 * Culture Detective Web Audio API Sound Engine
 * Provides synthesized sound effects and authentic Indian instrument tones
 * without relying on external copyrighted audio files.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private musicEnabled: boolean = true;
  private bgmGain: GainNode | null = null;
  private isBgmPlaying: boolean = false;
  private bgmInterval: number | null = null;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setSoundEnabled(val: boolean) {
    this.soundEnabled = val;
  }

  public setMusicEnabled(val: boolean) {
    this.musicEnabled = val;
    if (!val) {
      this.stopBgm();
    } else {
      this.startBgm();
    }
  }

  // --- Core Game SFX ---

  public playClick() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.05);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  public playCorrect() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 arpeggio

    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const startTime = now + idx * 0.08;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.25, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.3);
    });
  }

  public playWrong() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.28);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.28);
  }

  public playCoin() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const freqs = [987.77, 1318.51]; // B5, E6

    freqs.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const startTime = now + idx * 0.07;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.22, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.2);
    });
  }

  public playStar(starIndex: number = 0) {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const baseFreqs = [587.33, 739.99, 880.0]; // D5, F#5, A5
    const freq = baseFreqs[Math.min(starIndex, baseFreqs.length - 1)];

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.25);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  public playLevelComplete() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Triumphant Indian classical Bilawal/Major celebration riff
    const chord = [392, 493.88, 587.33, 783.99]; // G4, B4, D5, G5
    chord.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const startTime = now + i * 0.1;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.6);
    });
  }

  public playLevelUp() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const fanfare = [
      { f: 523.25, t: 0.0, d: 0.12 },
      { f: 659.25, t: 0.12, d: 0.12 },
      { f: 783.99, t: 0.24, d: 0.15 },
      { f: 1046.5, t: 0.39, d: 0.4 },
      { f: 880.0, t: 0.82, d: 0.15 },
      { f: 1046.5, t: 0.98, d: 0.6 },
    ];

    fanfare.forEach((item) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const st = now + item.t;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(item.f, st);

      gain.gain.setValueAtTime(0.24, st);
      gain.gain.exponentialRampToValueAtTime(0.001, st + item.d);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(st);
      osc.stop(st + item.d);
    });
  }

  public playTimerTick() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  }

  // --- Authentic Indian Instrument Synthesizers for Sound Recognition Games ---

  public playInstrumentSound(instrumentType: string) {
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const type = instrumentType.toLowerCase();

    if (type.includes('sitar')) {
      // Sitar: Rich harmonic plucked sound with sympathetic resonance / meend glide
      const freqs = [293.66, 587.33, 880.0, 1174.66]; // D4, D5, A5, D6
      freqs.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = idx === 0 ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        // Sitar pitch bend (meend)
        osc.frequency.linearRampToValueAtTime(freq * 1.05, now + 0.4);
        osc.frequency.linearRampToValueAtTime(freq, now + 0.8);

        const vol = 0.2 / (idx + 1);
        gain.gain.setValueAtTime(vol, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now);
        osc.stop(now + 1.4);
      });
    } else if (type.includes('flute') || type.includes('bansuri')) {
      // Bansuri: Soft pure breathy sine with gentle vibrato
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const vibrato = this.ctx.createOscillator();
      const vibratoGain = this.ctx.createGain();

      vibrato.frequency.setValueAtTime(5.5, now);
      vibratoGain.gain.setValueAtTime(8, now);
      vibrato.connect(osc.frequency);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.linearRampToValueAtTime(493.88, now + 0.4); // B4 glide
      osc.frequency.linearRampToValueAtTime(523.25, now + 0.8); // C5

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.2);
      gain.gain.linearRampToValueAtTime(0.2, now + 1.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      vibrato.start(now);
      osc.start(now);
      vibrato.stop(now + 1.8);
      osc.stop(now + 1.8);
    } else if (type.includes('tabla') || type.includes('dholak')) {
      // Tabla: Bayan (bass pitch bend "ghe") + Dayan (sharp tuned "na/tin")
      // Bayan
      const oscB = this.ctx.createOscillator();
      const gainB = this.ctx.createGain();
      oscB.type = 'sine';
      oscB.frequency.setValueAtTime(95, now);
      oscB.frequency.exponentialRampToValueAtTime(140, now + 0.12);
      oscB.frequency.exponentialRampToValueAtTime(80, now + 0.5);

      gainB.gain.setValueAtTime(0.35, now);
      gainB.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      oscB.connect(gainB);
      gainB.connect(this.ctx.destination);
      oscB.start(now);
      oscB.stop(now + 0.6);

      // Dayan stroke
      const oscD = this.ctx.createOscillator();
      const gainD = this.ctx.createGain();
      oscD.type = 'triangle';
      oscD.frequency.setValueAtTime(320, now + 0.15);

      gainD.gain.setValueAtTime(0.25, now + 0.15);
      gainD.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      oscD.connect(gainD);
      gainD.connect(this.ctx.destination);
      oscD.start(now + 0.15);
      oscD.stop(now + 0.45);
    } else if (type.includes('veena')) {
      // Saraswati Veena: Warm, deep resonant pluck
      const notes = [220, 440, 659.25];
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.linearRampToValueAtTime(freq * 1.03, now + 0.3);
        osc.frequency.linearRampToValueAtTime(freq, now + 0.6);

        gain.gain.setValueAtTime(0.25 / (idx + 1), now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now);
        osc.stop(now + 1.2);
      });
    } else if (type.includes('shehnai') || type.includes('nadaswaram')) {
      // Shehnai: Piercing, auspicious double-reed timbre
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(466.16, now); // Bb4
      osc.frequency.linearRampToValueAtTime(523.25, now + 0.3); // C5
      osc.frequency.linearRampToValueAtTime(587.33, now + 0.7); // D5

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 1.3);
    } else if (type.includes('dhol')) {
      // Punjabi Dhol: Huge booming bass strike + sharp treble stick ("dagga" and "tilli")
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.3);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.5);
    } else {
      // Default melodious acoustic bell chime
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, now);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.6);
    }
  }

  // --- Ambient Indian Classical Tanpura / Flute Drone BGM ---
  public startBgm() {
    if (!this.musicEnabled || this.isBgmPlaying) return;
    this.initContext();
    if (!this.ctx) return;

    this.isBgmPlaying = true;
    const ragaNotes = [
      261.63, // Sa (C4)
      329.63, // Ga (E4)
      392.00, // Pa (G4)
      493.88, // Ni (B4)
      523.25, // Sa (C5)
    ];

    let noteIdx = 0;
    this.bgmInterval = window.setInterval(() => {
      if (!this.musicEnabled || !this.isBgmPlaying || !this.ctx) return;
      
      const now = this.ctx.currentTime;
      const freq = ragaNotes[noteIdx % ragaNotes.length];
      noteIdx++;

      // Gentle warm drone note
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.025, now + 0.8);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 2.5);
    }, 1800);
  }

  public stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmInterval !== null) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }
  public isMutedState(): boolean {
    return !this.soundEnabled;
  }

  public toggleMute(): boolean {
    this.soundEnabled = !this.soundEnabled;
    this.musicEnabled = this.soundEnabled;
    if (!this.soundEnabled) {
      this.stopBgm();
    }
    return !this.soundEnabled;
  }

  public playTick() {
    this.playTimerTick();
  }

  public playLevelStart() {
    this.playCoin();
  }

  public playInstrument(type: string) {
    this.playInstrumentSound(type);
  }
}

export const soundManager = new SoundEngine();
export const soundEngine = soundManager;
