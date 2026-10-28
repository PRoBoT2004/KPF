// Island sound: small synthesized effects, surface-aware footsteps and an
// ambient bed (waves by the shore, birds by day, crickets at night, fire
// crackle indoors). Everything is generated with WebAudio — no audio files.
// Off by default; the HUD toggle creates the context inside a user gesture.

export function createAudio() {
  let ctx = null, master = null, noise = null, on = false;
  const amb = {};
  let birdT = 2, crackT = 0;

  function init() {
    if (ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    // 2 s of white noise, looped by every noise-based voice
    noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const d = noise.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const loop = (freq, type = "lowpass", q = 0.7) => {
      const src = ctx.createBufferSource();
      src.buffer = noise;
      src.loop = true;
      const f = ctx.createBiquadFilter();
      f.type = type;
      f.frequency.value = freq;
      f.Q.value = q;
      const g = ctx.createGain();
      g.gain.value = 0;
      src.connect(f).connect(g).connect(master);
      src.start();
      return { f, g };
    };
    amb.waves = loop(520);
    amb.wind = loop(260);
    // crickets: a high sine gated by a fast LFO
    const osc = ctx.createOscillator(), lfo = ctx.createOscillator(), lfoG = ctx.createGain(), cg = ctx.createGain(), out = ctx.createGain();
    osc.frequency.value = 4300;
    lfo.frequency.value = 26;
    lfoG.gain.value = 0.5;
    cg.gain.value = 0.5;
    out.gain.value = 0;
    lfo.connect(lfoG).connect(cg.gain);
    osc.connect(cg).connect(out).connect(master);
    osc.start();
    lfo.start();
    amb.crickets = { g: out };
  }

  const now = () => ctx.currentTime;
  function tone(f0, f1, dur, { type = "sine", vol = 0.08, delay = 0, attack = 0.005 } = {}) {
    const t = now() + delay, o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f0, t);
    o.frequency.exponentialRampToValueAtTime(Math.max(f1, 1), t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(master);
    o.start(t);
    o.stop(t + dur + 0.05);
  }
  function burst(freq, dur, vol, type = "lowpass", q = 1, delay = 0) {
    const t = now() + delay, src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    src.buffer = noise;
    f.type = type;
    f.frequency.value = freq;
    f.Q.value = q;
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f).connect(g).connect(master);
    src.start(t, Math.random() * 1.5);
    src.stop(t + dur + 0.05);
  }

  const SFX = {
    star: () => [1047, 1319, 1568, 2093].forEach((f, i) => tone(f, f, 0.32, { type: "triangle", vol: 0.07, delay: i * 0.07 })),
    talk: () => {
      tone(520, 600, 0.06, { type: "triangle", vol: 0.05 });
      tone(660, 720, 0.07, { type: "triangle", vol: 0.05, delay: 0.07 });
    },
    pet: () => {
      tone(392, 587, 0.16, { type: "triangle", vol: 0.07 });
      tone(587, 494, 0.2, { type: "triangle", vol: 0.06, delay: 0.14 });
    },
    coin: () => {
      tone(1319, 1319, 0.08, { type: "square", vol: 0.03 });
      tone(1976, 1976, 0.28, { type: "triangle", vol: 0.06, delay: 0.08 });
    },
    splash: () => {
      burst(900, 0.35, 0.18, "bandpass", 0.8);
      tone(300, 90, 0.25, { type: "sine", vol: 0.06 });
    },
    jump: () => tone(300, 520, 0.12, { type: "sine", vol: 0.05 }),
    land: () => burst(400, 0.08, 0.12),
    door: () => {
      tone(180, 140, 0.18, { type: "triangle", vol: 0.07 });
      burst(700, 0.12, 0.06, "bandpass", 2, 0.02);
    },
    open: () => {
      tone(392, 523, 0.08, { type: "triangle", vol: 0.05 });
      tone(523, 659, 0.12, { type: "triangle", vol: 0.05, delay: 0.08 });
    },
    portal: () => {
      tone(220, 880, 0.6, { type: "sine", vol: 0.06, attack: 0.08 });
      tone(330, 1320, 0.7, { type: "sine", vol: 0.04, delay: 0.05, attack: 0.1 });
    },
    win: () => [523, 659, 784, 1047, 1319, 1568].forEach((f, i) => tone(f, f, 0.3, { type: "triangle", vol: 0.07, delay: i * 0.11 })),
    fish: () => burst(1400, 0.18, 0.08, "bandpass", 1.2),
    quack: () => tone(330, 220, 0.14, { type: "sawtooth", vol: 0.025 }),
  };

  return {
    get on() {
      return on;
    },
    setEnabled(v) {
      on = !!v;
      if (on) init();
      if (!ctx) return;
      if (on && ctx.state === "suspended") ctx.resume();
      master.gain.setTargetAtTime(on ? 0.9 : 0, now(), 0.15);
    },
    sfx(kind) {
      if (!on || !ctx || !SFX[kind]) return;
      try {
        SFX[kind]();
      } catch {
        /* audio is optional */
      }
    },
    /** One footstep. surface: grass | stone | sand | wood */
    step(surface) {
      if (!on || !ctx) return;
      const v = 0.85 + Math.random() * 0.3;
      if (surface === "wood") {
        burst(380 * v, 0.07, 0.16);
        tone(150 * v, 110, 0.06, { type: "sine", vol: 0.05 });
      } else if (surface === "stone") burst(2200 * v, 0.045, 0.07, "bandpass", 1.4);
      else if (surface === "sand") burst(1200 * v, 0.09, 0.06, "lowpass", 0.5);
      else burst(1500 * v, 0.06, 0.06, "highpass", 0.7);
    },
    /** Ambient mix. shore 0..1, night 0..1, inside bool, fire 0..1 */
    update(dt, { shore = 0, night = 0, inside = false, fire = 0, t = 0 }) {
      if (!on || !ctx) return;
      const T = now(), swell = 0.5 + 0.5 * Math.sin(t * 0.55) * Math.sin(t * 0.23 + 1);
      amb.waves.g.gain.setTargetAtTime(inside ? 0.004 : (0.025 + shore * 0.11) * (0.45 + swell * 0.55), T, 0.4);
      amb.waves.f.frequency.setTargetAtTime(380 + swell * 420, T, 0.5);
      amb.wind.g.gain.setTargetAtTime(inside ? 0 : 0.018 + swell * 0.012, T, 0.6);
      amb.crickets.g.gain.setTargetAtTime(inside ? 0 : night * 0.006, T, 0.8);
      // birdsong by day
      birdT -= dt;
      if (birdT <= 0) {
        birdT = 1.6 + Math.random() * 4.5;
        if (!inside && night < 0.5) {
          const f = 2200 + Math.random() * 1600, n = 2 + Math.floor(Math.random() * 3);
          for (let i = 0; i < n; i++) tone(f * (1 + i * 0.06), f * (1.25 + Math.random() * 0.3), 0.09, { type: "sine", vol: 0.018, delay: i * 0.12 });
        }
      }
      // fire crackle indoors
      crackT -= dt;
      if (fire > 0 && crackT <= 0) {
        crackT = 0.05 + Math.random() * 0.35;
        burst(1800 + Math.random() * 2400, 0.03, 0.05 * fire, "bandpass", 3);
      }
    },
    dispose() {
      try {
        ctx?.close();
      } catch {
        /* ignore */
      }
      ctx = null;
    },
  };
}
