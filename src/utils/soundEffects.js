// Web Audio API based sound synthesizer for keyboard clicks and UI interactions
// 100% lightweight, no external MP3/WAV assets needed!

class SoundEngine {
  constructor() {
    this.ctx = null
    this.muted = false
    try {
      this.muted = localStorage.getItem('upg_sound_muted') === 'true'
    } catch {
      this.muted = false
    }
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  isMuted() {
    return this.muted
  }

  toggleMute() {
    this.muted = !this.muted
    try {
      localStorage.setItem('upg_sound_muted', String(this.muted))
    } catch {}
    return this.muted
  }

  // Helper: Create a short noise burst buffer for physical impact simulation
  _getNoiseBuffer(duration = 0.04) {
    if (!this.ctx) return null
    const bufferSize = Math.max(1, Math.floor(this.ctx.sampleRate * duration))
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      // Exponential decay envelope baked into noise
      const decay = Math.exp(-i / (this.ctx.sampleRate * 0.009))
      data[i] = (Math.random() * 2 - 1) * decay
    }
    return buffer
  }

  // Realistic mechanical switch sound synthesis (Blue / Red / Brown)
  playSwitchClick(type = 'blue', isRelease = false) {
    if (this.muted) return
    this.init()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    // Subtle organic variation (+/- 2.5%) so rapid typing sounds natural
    const pitchJitter = 1 + (Math.random() * 0.05 - 0.025)

    if (type === 'blue') {
      // === BLUE SWITCH: Crisp Clicky with Metal Leaf Ping + Plate Snap ===
      if (!isRelease) {
        // 1. Sharp Click Leaf Snap (High-Q Bandpass on Noise)
        const noise = this.ctx.createBufferSource()
        noise.buffer = this._getNoiseBuffer(0.025)
        const noiseFilter = this.ctx.createBiquadFilter()
        noiseFilter.type = 'bandpass'
        noiseFilter.frequency.setValueAtTime(3600 * pitchJitter, now)
        noiseFilter.Q.setValueAtTime(4.5, now)

        const noiseGain = this.ctx.createGain()
        noiseGain.gain.setValueAtTime(0.55, now)
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.022)

        noise.connect(noiseFilter)
        noiseFilter.connect(noiseGain)
        noiseGain.connect(this.ctx.destination)
        noise.start(now)

        // 2. High-pitch metallic ping (Click Leaf snap harmonic)
        const clickOsc = this.ctx.createOscillator()
        const clickGain = this.ctx.createGain()
        clickOsc.type = 'triangle'
        clickOsc.frequency.setValueAtTime(2800 * pitchJitter, now)
        clickOsc.frequency.exponentialRampToValueAtTime(800 * pitchJitter, now + 0.018)

        clickGain.gain.setValueAtTime(0.35, now)
        clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.018)

        clickOsc.connect(clickGain)
        clickGain.connect(this.ctx.destination)
        clickOsc.start(now)
        clickOsc.stop(now + 0.02)

        // 3. Bottom-out housing & plate impact (Clack body)
        const bodyOsc = this.ctx.createOscillator()
        const bodyGain = this.ctx.createGain()
        bodyOsc.type = 'sine'
        bodyOsc.frequency.setValueAtTime(420 * pitchJitter, now + 0.004)
        bodyOsc.frequency.exponentialRampToValueAtTime(140 * pitchJitter, now + 0.045)

        bodyGain.gain.setValueAtTime(0.3, now + 0.004)
        bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.045)

        bodyOsc.connect(bodyGain)
        bodyGain.connect(this.ctx.destination)
        bodyOsc.start(now + 0.004)
        bodyOsc.stop(now + 0.046)
      } else {
        // Release tactile click reset
        const relNoise = this.ctx.createBufferSource()
        relNoise.buffer = this._getNoiseBuffer(0.015)
        const relFilter = this.ctx.createBiquadFilter()
        relFilter.type = 'bandpass'
        relFilter.frequency.setValueAtTime(2600, now)
        relFilter.Q.setValueAtTime(3.0, now)

        const relGain = this.ctx.createGain()
        relGain.gain.setValueAtTime(0.2, now)
        relGain.gain.exponentialRampToValueAtTime(0.001, now + 0.015)

        relNoise.connect(relFilter)
        relFilter.connect(relGain)
        relGain.connect(this.ctx.destination)
        relNoise.start(now)
      }

    } else if (type === 'red') {
      // === RED SWITCH: Deep Creamy Linear "Thock" (No click leaf, muffled plate hit) ===
      if (!isRelease) {
        // 1. Soft damped impact transient
        const noise = this.ctx.createBufferSource()
        noise.buffer = this._getNoiseBuffer(0.035)
        const noiseFilter = this.ctx.createBiquadFilter()
        noiseFilter.type = 'lowpass'
        noiseFilter.frequency.setValueAtTime(750 * pitchJitter, now)

        const noiseGain = this.ctx.createGain()
        noiseGain.gain.setValueAtTime(0.5, now)
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035)

        noise.connect(noiseFilter)
        noiseFilter.connect(noiseGain)
        noiseGain.connect(this.ctx.destination)
        noise.start(now)

        // 2. Deep Sub-Plate Body ("Thock" resonance)
        const thockOsc = this.ctx.createOscillator()
        const thockGain = this.ctx.createGain()
        thockOsc.type = 'sine'
        thockOsc.frequency.setValueAtTime(230 * pitchJitter, now)
        thockOsc.frequency.exponentialRampToValueAtTime(75 * pitchJitter, now + 0.065)

        thockGain.gain.setValueAtTime(0.65, now)
        thockGain.gain.exponentialRampToValueAtTime(0.001, now + 0.065)

        thockOsc.connect(thockGain)
        thockGain.connect(this.ctx.destination)
        thockOsc.start(now)
        thockOsc.stop(now + 0.07)
      } else {
        // Subtle soft release
        const relOsc = this.ctx.createOscillator()
        const relGain = this.ctx.createGain()
        relOsc.type = 'sine'
        relOsc.frequency.setValueAtTime(140, now)
        relGain.gain.setValueAtTime(0.12, now)
        relGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02)
        relOsc.connect(relGain)
        relGain.connect(this.ctx.destination)
        relOsc.start(now)
        relOsc.stop(now + 0.022)
      }

    } else {
      // === BROWN SWITCH: Tactile Bump + Medium Clack ===
      if (!isRelease) {
        // 1. Tactile friction scrape & bump
        const noise = this.ctx.createBufferSource()
        noise.buffer = this._getNoiseBuffer(0.03)
        const noiseFilter = this.ctx.createBiquadFilter()
        noiseFilter.type = 'bandpass'
        noiseFilter.frequency.setValueAtTime(1600 * pitchJitter, now)
        noiseFilter.Q.setValueAtTime(2.0, now)

        const noiseGain = this.ctx.createGain()
        noiseGain.gain.setValueAtTime(0.4, now)
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03)

        noise.connect(noiseFilter)
        noiseFilter.connect(noiseGain)
        noiseGain.connect(this.ctx.destination)
        noise.start(now)

        // 2. Mid-frequency tactile housing clack
        const bumpOsc = this.ctx.createOscillator()
        const bumpGain = this.ctx.createGain()
        bumpOsc.type = 'triangle'
        bumpOsc.frequency.setValueAtTime(480 * pitchJitter, now)
        bumpOsc.frequency.exponentialRampToValueAtTime(160 * pitchJitter, now + 0.045)

        bumpGain.gain.setValueAtTime(0.38, now)
        bumpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.045)

        bumpOsc.connect(bumpGain)
        bumpGain.connect(this.ctx.destination)
        bumpOsc.start(now)
        bumpOsc.stop(now + 0.048)
      } else {
        // Tactile return bump
        const relNoise = this.ctx.createBufferSource()
        relNoise.buffer = this._getNoiseBuffer(0.015)
        const relFilter = this.ctx.createBiquadFilter()
        relFilter.type = 'bandpass'
        relFilter.frequency.setValueAtTime(1400, now)

        const relGain = this.ctx.createGain()
        relGain.gain.setValueAtTime(0.15, now)
        relGain.gain.exponentialRampToValueAtTime(0.001, now + 0.015)

        relNoise.connect(relFilter)
        relFilter.connect(relGain)
        relGain.connect(this.ctx.destination)
        relNoise.start(now)
      }
    }
  }

  // Futuristic UI Add-to-cart chime
  playCartSuccess() {
    if (this.muted) return
    this.init()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc1 = this.ctx.createOscillator()
    const osc2 = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc1.type = 'sine'
    osc2.type = 'triangle'

    osc1.frequency.setValueAtTime(587.33, now) // D5
    osc1.frequency.setValueAtTime(880.0, now + 0.08) // A5

    osc2.frequency.setValueAtTime(880.0, now)
    osc2.frequency.setValueAtTime(1174.66, now + 0.08) // D6

    gain.gain.setValueAtTime(0.18, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28)

    osc1.connect(gain)
    osc2.connect(gain)
    gain.connect(this.ctx.destination)

    osc1.start(now)
    osc2.start(now)
    osc1.stop(now + 0.28)
    osc2.stop(now + 0.28)
  }

  // Subtle tap sound for buttons
  playTap() {
    if (this.muted) return
    this.init()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(800, now)
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.03)

    gain.gain.setValueAtTime(0.08, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03)

    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start(now)
    osc.stop(now + 0.03)
  }
}

export const soundFx = new SoundEngine()
