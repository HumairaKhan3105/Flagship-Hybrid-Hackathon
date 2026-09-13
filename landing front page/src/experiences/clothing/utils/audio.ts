// Web Audio API sound synthesizer for authentic AAA Indian game audio

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isMusicMuted: boolean = false;
  private ambientOscillators: OscillatorNode[] = [];
  private ambientGain: GainNode | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public setEnabled(enabled: boolean) {
    this.isMuted = !enabled;
  }

  public setMusicMuted(muted: boolean) {
    this.isMusicMuted = muted;
    if (muted) {
      this.stopAmbient();
    } else {
      this.startAmbient();
    }
  }

  // Antique wooden / stone button click
  public playClick() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
    } catch {
      // Audio context might be restricted before interaction
    }
  }

  // Brass bell / temple chime
  public playChime() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const freqs = [880, 1320, 1760];
      freqs.forEach((f, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, this.ctx!.currentTime);

        const volume = 0.15 / (idx + 1);
        gain.gain.setValueAtTime(volume, this.ctx!.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx!.currentTime + 1.2 + idx * 0.2);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start();
        osc.stop(this.ctx!.currentTime + 1.5);
      });
    } catch {}
  }

  // Correct Answer Sitar strum fanfare
  public playCorrectFanfare() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      // Raag Bhairavi / Yaman ascending flourish: Sa, Ga, Pa, Ni, Sa'
      const notes = [293.66, 369.99, 440.00, 554.37, 587.33, 739.99]; // D, F#, A, C#, D, F#
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.09);

        // Low-pass filter for sitar acoustic warmth
        const filter = this.ctx!.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1400, this.ctx!.currentTime);

        gain.gain.setValueAtTime(0.001, this.ctx!.currentTime + idx * 0.09);
        gain.gain.linearRampToValueAtTime(0.25, this.ctx!.currentTime + idx * 0.09 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + idx * 0.09 + 0.8);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(this.ctx!.currentTime + idx * 0.09);
        osc.stop(this.ctx!.currentTime + idx * 0.09 + 0.9);
      });
    } catch {}
  }

  // Wrong Answer heart loss sound
  public playWrong() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(65, this.ctx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.36);
    } catch {}
  }

  // 3D Unlock Celestial fanfare (sparkles & golden sheen)
  public playUnlockCelebration() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      // Sparkling rapid chimes + royal low gong
      const gongOsc = this.ctx.createOscillator();
      const gongGain = this.ctx.createGain();
      gongOsc.type = 'sine';
      gongOsc.frequency.setValueAtTime(110, this.ctx.currentTime);
      gongGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      gongGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 2.5);
      gongOsc.connect(gongGain);
      gongGain.connect(this.ctx.destination);
      gongOsc.start();
      gongOsc.stop(this.ctx.currentTime + 2.6);

      const sparklePitches = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98, 2093.00];
      sparklePitches.forEach((pitch, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(pitch, this.ctx!.currentTime + 0.15 + i * 0.08);

        gain.gain.setValueAtTime(0.18, this.ctx!.currentTime + 0.15 + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx!.currentTime + 0.15 + i * 0.08 + 1.0);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(this.ctx!.currentTime + 0.15 + i * 0.08);
        osc.stop(this.ctx!.currentTime + 0.15 + i * 0.08 + 1.1);
      });
    } catch {}
  }

  // Weaver loom shuttle rhythmic clack
  public playLoomShuttle() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(450, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.07);
    } catch {}
  }

  // Ambient Tanpura drone
  public startAmbient() {
    if (this.isMusicMuted || this.ambientOscillators.length > 0) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.ambientGain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 3.0);
      this.ambientGain.connect(this.ctx.destination);

      // Tanpura Pa-Sa-Sa-Sa drone frequencies in D (Pa = 220, Sa = 146.8, Sa' = 293.6)
      const droneFreqs = [146.83, 220.00, 293.66, 440.00];
      droneFreqs.forEach((freq) => {
        const osc = this.ctx!.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime);

        const filter = this.ctx!.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600, this.ctx!.currentTime);

        osc.connect(filter);
        filter.connect(this.ambientGain!);
        osc.start();
        this.ambientOscillators.push(osc);
      });
    } catch {}
  }

  public stopAmbient() {
    if (this.ambientGain && this.ctx) {
      try {
        this.ambientGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 1.0);
        setTimeout(() => {
          this.ambientOscillators.forEach(osc => {
            try { osc.stop(); } catch {}
          });
          this.ambientOscillators = [];
        }, 1100);
      } catch {
        this.ambientOscillators = [];
      }
    }
  }
}

export const soundManager = new SoundManager();
