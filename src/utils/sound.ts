// Audio & Sound Engine for Harshitha's Birthday Website
// Includes support for /audio/birthday.mp3 with an intelligent Web Audio API music-box fallback

class SoundEngine {
  private audioCtx: AudioContext | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private isMusicPlaying: boolean = false;
  private isMuted: boolean = false;
  private volume: number = 0.7;
  private synthInterval: number | null = null;
  private listeners: Set<(isPlaying: boolean) => void> = new Set();

  constructor() {
    // Lazy initialize on first user interaction
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  public subscribe(fn: (isPlaying: boolean) => void) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private notify() {
    this.listeners.forEach((fn) => fn(this.isMusicPlaying));
  }

  public toggleMusic(): boolean {
    if (this.isMusicPlaying) {
      this.pauseMusic();
      return false;
    } else {
      this.playMusic();
      return true;
    }
  }

  public playMusic() {
    const ctx = this.getAudioContext();
    this.isMusicPlaying = true;
    this.notify();

    if (!this.audioElement) {
      this.audioElement = new Audio('/audio/birthday.mp3');
      this.audioElement.loop = true;
      this.audioElement.volume = this.volume;
    }

    // Try playing HTML5 Audio
    const playPromise = this.audioElement.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // Playing actual file
        })
        .catch(() => {
          // If file is empty or missing, start Web Audio Music Box Synthesizer
          this.startMusicBoxSynth();
        });
    } else {
      this.startMusicBoxSynth();
    }
  }

  public pauseMusic() {
    this.isMusicPlaying = false;
    this.notify();
    if (this.audioElement) {
      this.audioElement.pause();
    }
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
  }

  public getPlayingState(): boolean {
    return this.isMusicPlaying;
  }

  // Web Audio Music Box Synthesizer: Sweet, dreamy "Happy Birthday" music box chime
  private startMusicBoxSynth() {
    if (this.synthInterval) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    // Melody notes (Hz frequencies) & relative durations for a music-box style celebration
    // Happy Birthday melody in key of C & F:
    const notes: { freq: number; dur: number; delay: number }[] = [
      { freq: 261.63, dur: 0.35, delay: 0 },    // C4
      { freq: 261.63, dur: 0.35, delay: 400 },  // C4
      { freq: 293.66, dur: 0.7, delay: 800 },   // D4
      { freq: 261.63, dur: 0.7, delay: 1600 },  // C4
      { freq: 349.23, dur: 0.7, delay: 2400 },  // F4
      { freq: 329.63, dur: 1.2, delay: 3200 },  // E4

      { freq: 261.63, dur: 0.35, delay: 4600 },  // C4
      { freq: 261.63, dur: 0.35, delay: 5000 },  // C4
      { freq: 293.66, dur: 0.7, delay: 5400 },   // D4
      { freq: 261.63, dur: 0.7, delay: 6200 },   // C4
      { freq: 392.00, dur: 0.7, delay: 7000 },   // G4
      { freq: 349.23, dur: 1.2, delay: 7800 },   // F4

      { freq: 261.63, dur: 0.35, delay: 9200 },  // C4
      { freq: 261.63, dur: 0.35, delay: 9600 },  // C4
      { freq: 523.25, dur: 0.7, delay: 10000 },  // C5
      { freq: 440.00, dur: 0.7, delay: 10800 },  // A4
      { freq: 349.23, dur: 0.7, delay: 11600 },  // F4
      { freq: 329.63, dur: 0.7, delay: 12400 },  // E4
      { freq: 293.66, dur: 1.0, delay: 13200 },  // D4

      { freq: 466.16, dur: 0.35, delay: 14600 }, // Bb4
      { freq: 466.16, dur: 0.35, delay: 15000 }, // Bb4
      { freq: 440.00, dur: 0.7, delay: 15400 },  // A4
      { freq: 349.23, dur: 0.7, delay: 16200 },  // F4
      { freq: 392.00, dur: 0.7, delay: 17000 },  // G4
      { freq: 349.23, dur: 1.6, delay: 17800 },  // F4
    ];

    const loopLength = 20500;

    const playCycle = () => {
      if (!this.isMusicPlaying) return;
      notes.forEach((item) => {
        setTimeout(() => {
          if (this.isMusicPlaying && !this.isMuted) {
            this.playMusicBoxNote(item.freq, item.dur);
          }
        }, item.delay);
      });
    };

    playCycle();
    this.synthInterval = window.setInterval(() => {
      if (this.isMusicPlaying) {
        playCycle();
      }
    }, loopLength);
  }

  private playMusicBoxNote(frequency: number, duration: number = 0.5) {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Sine wave with slight triangle shimmer for celestial music box feel
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.18 * this.volume, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.7);
    } catch {
      // Ignored
    }
  }

  // SFX: Candle blow (soft breath / wind noise)
  public playCandleBlowSound() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const bufferSize = ctx.sampleRate * 0.7;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.6);
      filter.Q.setValueAtTime(3, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start();
    } catch {
      // Ignored
    }
  }

  // SFX: Cake slice sound
  public playCakeSliceSound() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.001, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.12, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.45);
      });
    } catch {
      // Ignored
    }
  }

  // SFX: Balloon Pop
  public playPopSound() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(380, now);
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.1);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.13);
    } catch {
      // Ignored
    }
  }

  // SFX: Sparkle chime / Lantern release
  public playSparkleSound() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const freqs = [880, 1108.73, 1318.51, 1760, 2093];
      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.05);

        gain.gain.setValueAtTime(0.001, now + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.1, now + i * 0.05 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.05 + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 0.55);
      });
    } catch {
      // Ignored
    }
  }

  // SFX: Letter envelope open
  public playEnvelopeOpenSound() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.2);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch {
      // Ignored
    }
  }
}

export const soundEngine = new SoundEngine();
