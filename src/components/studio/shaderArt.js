// ============================================================
// Generative "art plate" shader — the abstract imagery of the
// Studio world. Domain-warped fbm (Inigo Quilez style), tinted
// with the brand accents. One module powers the live hero canvas
// and the still plates in /public/studio/art (rendered offline).
// WebGL1 + GLSL ES 1.0 so it runs everywhere.
// ============================================================

export const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

export const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uSeed;
uniform float uZoom;
uniform vec3 uA;   // primary bloom
uniform vec3 uB;   // secondary bloom
uniform vec3 uC;   // body tint
uniform vec3 uBg;
uniform float uGrain;
uniform float uLines;

float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = m * p; a *= 0.5; }
  return v;
}

void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / min(uRes.x, uRes.y);
  vec2 pv = p;
  p *= uZoom;
  float t = uTime * 0.035;
  p += (uMouse - 0.5) * 0.18;
  vec2 s = vec2(uSeed, uSeed * 1.7);

  vec2 q = vec2(fbm(p + s + vec2(0.0, t)), fbm(p + s + vec2(5.2, 1.3) - t));
  vec2 r = vec2(fbm(p + 2.2 * q + vec2(1.7, 9.2) + 1.2 * t),
                fbm(p + 2.2 * q + vec2(8.3, 2.8) - 1.1 * t));
  float f = fbm(p + 2.4 * r);

  // body haze + two luminous "silk" ribbons following the warped field
  vec3 col = uBg + uC * smoothstep(0.25, 0.85, f) * 0.85;
  float band0 = exp(-pow((f - 0.56) * 7.0, 2.0));          // soft glow
  float band1 = exp(-pow((f - 0.56) * 16.0, 2.0));         // silk ribbon core
  float band2 = exp(-pow((r.x - 0.6) * 9.0, 2.0));
  col += uA * (band0 * 0.55 + band1 * 0.75);
  col += uB * band2 * 0.55 * smoothstep(0.3, 0.7, f);
  col += vec3(1.0, 0.95, 0.86) * pow(band1, 5.0) * 0.5 * uLines;

  float vig = smoothstep(1.5, 0.15, length(pv * vec2(0.8, 1.1)));
  col *= mix(0.3, 1.0, vig);
  col = 1.0 - exp(-col * 1.35);   // soft tone-map: rich highlights, no clipping

  float g = hash(gl_FragCoord.xy + fract(uTime * 0.37) * 91.7) - 0.5;
  col += g * uGrain;
  gl_FragColor = vec4(max(col, 0.0), 1.0);
}
`;

const hex = (h) => {
  const n = parseInt(h.replace("#", ""), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

// Named palettes — brand accents only (gold / cyan / rose on warm black).
export const PALETTES = {
  ember: { a: "#D4A848", b: "#4FD1C5", c: "#7a2f22", bg: "#08080a" },
  tide: { a: "#4FD1C5", b: "#D4A848", c: "#123a40", bg: "#060809" },
  bloom: { a: "#E07B6B", b: "#D4A848", c: "#5a2230", bg: "#0a0709" },
  dusk: { a: "#D4A848", b: "#E07B6B", c: "#1d2a3a", bg: "#07080b" },
};

/**
 * Mount the shader on a canvas.
 * @returns {{ destroy(): void, setMouse(x:number,y:number): void, renderOnce(t?:number): void } | null}
 */
export function createShaderArt(canvas, opts = {}) {
  const {
    palette = "ember", seed = 0, zoom = 1.2, grain = 0, lines = 1,
    scale = 0.5, animate = true, time = 12, preserve = false,
  } = opts;
  const gl = canvas.getContext("webgl", { antialias: false, alpha: false, preserveDrawingBuffer: preserve, powerPreference: "low-power" });
  if (!gl) return null;

  const compile = (type, src) => {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src); gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(sh)); return null; }
    return sh;
  };
  const vs = compile(gl.VERTEX_SHADER, VERT), fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;
  const prog = gl.createProgram();
  gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "aPos");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const U = (n) => gl.getUniformLocation(prog, n);
  const u = {
    res: U("uRes"), time: U("uTime"), mouse: U("uMouse"), seed: U("uSeed"), zoom: U("uZoom"),
    a: U("uA"), b: U("uB"), c: U("uC"), bg: U("uBg"), grain: U("uGrain"), lines: U("uLines"),
  };
  const pal = PALETTES[palette] || PALETTES.ember;
  gl.uniform3fv(u.a, hex(pal.a)); gl.uniform3fv(u.b, hex(pal.b));
  gl.uniform3fv(u.c, hex(pal.c)); gl.uniform3fv(u.bg, hex(pal.bg));
  gl.uniform1f(u.seed, seed); gl.uniform1f(u.zoom, zoom);
  gl.uniform1f(u.grain, grain); gl.uniform1f(u.lines, lines);

  const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
  const resize = () => {
    const w = Math.max(1, Math.floor(canvas.clientWidth * scale));
    const h = Math.max(1, Math.floor(canvas.clientHeight * scale));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    gl.viewport(0, 0, w, h);
    gl.uniform2f(u.res, w, h);
  };
  const draw = (t) => {
    mouse.x += (mouse.tx - mouse.x) * 0.04;
    mouse.y += (mouse.ty - mouse.y) * 0.04;
    gl.uniform2f(u.mouse, mouse.x, mouse.y);
    gl.uniform1f(u.time, t);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  resize();
  let raf = 0, running = false, visible = true, t0 = performance.now();
  const loop = (now) => {
    if (!running) return;
    draw(time + (now - t0) / 1000);
    raf = requestAnimationFrame(loop);
  };
  const start = () => { if (!running && animate && visible && !document.hidden) { running = true; raf = requestAnimationFrame(loop); } };
  const stop = () => { running = false; cancelAnimationFrame(raf); };

  const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => { resize(); if (!running) draw(time); }) : null;
  ro?.observe(canvas);
  const io = typeof IntersectionObserver !== "undefined"
    ? new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? start() : stop(); })
    : null;
  io?.observe(canvas);
  const onVis = () => (document.hidden ? stop() : start());
  document.addEventListener("visibilitychange", onVis);

  draw(time);
  start();

  return {
    destroy() {
      stop(); ro?.disconnect(); io?.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
    setMouse(x, y) { mouse.tx = x; mouse.ty = y; },
    renderOnce(t = time) { resize(); draw(t); },
  };
}
