import { DestroyRef, Injectable, inject } from '@angular/core';
import { State } from '../state';
import frag from './liquid-glass.frag.glsl';

const VERT = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';

const UNIFORMS = [
  'uRes',
  'uTime',
  'uDark',
  'uStr',
  'uGrid',
  'uHue',
  'uDpr',
  'uR',
  'uRad',
  'uN',
  'uB',
  'uBRad',
  'uBN',
  'uD',
  'uDN',
  'uRip',
  'uRN',
  'uTex',
  'uPh',
  'uPhR',
  'uPhA',
  'uPhOn',
  'uPhS',
] as const;

type Locations = Record<(typeof UNIFORMS)[number], WebGLUniformLocation | null>;

interface Item {
  el: HTMLElement;
  radius: () => number;
  indicator?: () => boolean;
}

interface Droplet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  l: number;
}

interface Trail {
  x: number;
  y: number;
  l: number;
}

interface Rip {
  x: number;
  y: number;
  t0: number;
}

interface Swell {
  s: number;
  on: number;
  t: number;
}

@Injectable({ providedIn: 'root' })
export class LiquidGlass {
  private readonly state = inject(State);
  private readonly coarse = matchMedia('(pointer: coarse)');

  private canvas: HTMLCanvasElement | null = null;
  private ctx: { gl: WebGLRenderingContext; u: Locations } | null = null;
  private raf = 0;
  private t0 = 0;

  private readonly glasses: Item[] = [];
  private readonly bubbles: Item[] = [];
  private readonly tasks: (() => void)[] = [];
  private photo: Item | null = null;

  private readonly rectBuf = new Float32Array(32);
  private readonly radBuf = new Float32Array(8);
  private readonly bubBuf = new Float32Array(96);
  private readonly bubRadBuf = new Float32Array(24);
  private readonly dropBuf = new Float32Array(30);
  private readonly ripBuf = new Float32Array(24);

  private readonly m = { x: -300, y: -300, sx: -300, sy: -300, down: 0, hide: 0, hideT: 0 };
  private readonly swell = new Map<HTMLElement, Swell>();
  private splat: Droplet[] = [];
  private trail: Trail[] = [];
  private rips: Rip[] = [];
  private impact = 0;
  private shrink = 0;
  private darkT = this.state.dark() ? 1 : 0;
  private lastSpawn = 0;
  private lastRip = 0;
  private phA = 1;
  private phOn = 0;

  constructor() {
    window.addEventListener('pointermove', this.onMove);
    window.addEventListener('pointerdown', this.onDown);
    window.addEventListener('pointerup', this.onUp);
    window.addEventListener('touchstart', this.onTouchStart, { passive: true });
    window.addEventListener('touchend', this.onTouchEnd);
    inject(DestroyRef).onDestroy(() => {
      cancelAnimationFrame(this.raf);
      window.removeEventListener('pointermove', this.onMove);
      window.removeEventListener('pointerdown', this.onDown);
      window.removeEventListener('pointerup', this.onUp);
      window.removeEventListener('touchstart', this.onTouchStart);
      window.removeEventListener('touchend', this.onTouchEnd);
      this.canvas?.removeEventListener('webglcontextlost', this.onLost);
      this.canvas?.removeEventListener('webglcontextrestored', this.onRestored);
    });
  }

  attach(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    this.t0 = performance.now();
    this.raf = requestAnimationFrame(this.frame);
    canvas.addEventListener('webglcontextlost', this.onLost);
    canvas.addEventListener('webglcontextrestored', this.onRestored);
    this.initGL(canvas);
  }

  private initGL(canvas: HTMLCanvasElement): void {
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false });
    if (!gl) return;

    const program = gl.createProgram();
    this.compile(gl, program, gl.VERTEX_SHADER, VERT);
    this.compile(gl, program, gl.FRAGMENT_SHADER, frag);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const a = gl.getAttribLocation(program, 'a');
    gl.enableVertexAttribArray(a);
    gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);

    const u = {} as Locations;
    for (const name of UNIFORMS) u[name] = gl.getUniformLocation(program, name);

    this.phOn = 0;
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    const grey = new Uint8Array([200, 200, 200]);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, grey);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.uniform1i(u.uTex, 0);

    const img = new Image();
    img.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
      this.phA = img.width / img.height;
      this.phOn = 1;
    };
    img.src = '/assets/portrait.jpg';

    this.ctx = { gl, u };
  }

  registerGlass(el: HTMLElement, radius: () => number): () => void {
    return this.add(this.glasses, { el, radius });
  }

  registerBubble(el: HTMLElement, radius: () => number, indicator: () => boolean): () => void {
    return this.add(this.bubbles, { el, radius, indicator });
  }

  registerFrame(task: () => void): () => void {
    this.tasks.push(task);
    return () => {
      const i = this.tasks.indexOf(task);
      if (i >= 0) this.tasks.splice(i, 1);
    };
  }

  registerPhoto(el: HTMLElement, radius: () => number): () => void {
    this.photo = { el, radius };
    return () => {
      if (this.photo?.el === el) this.photo = null;
    };
  }

  ripple(x: number, y: number): void {
    if (this.rips.length >= 8) this.rips.shift();
    this.rips.push({ x, y, t0: performance.now() });
  }

  private add(list: Item[], item: Item): () => void {
    list.push(item);
    return () => {
      const i = list.indexOf(item);
      if (i >= 0) list.splice(i, 1);
      this.swell.delete(item.el);
    };
  }

  private compile(
    gl: WebGLRenderingContext,
    program: WebGLProgram,
    type: number,
    src: string,
  ): void {
    const shader = gl.createShader(type);
    if (!shader) return;
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
      console.error(gl.getShaderInfoLog(shader));
    gl.attachShader(program, shader);
  }

  private readonly onMove = (e: PointerEvent): void => {
    this.m.x = e.clientX;
    this.m.y = e.clientY;
  };

  private readonly onDown = (e: PointerEvent): void => {
    this.m.down = 1;
    this.impact = 1;
    this.ripple(e.clientX, e.clientY);
    const n = 4 + ((Math.random() * 2) | 0);
    const a0 = Math.random() * Math.PI * 2;
    for (let i = 0; i < n; i++) {
      const a = a0 + (i / n) * Math.PI * 2 + (Math.random() - 0.5) * 0.6;
      const s = 5 + Math.random() * 4;
      this.splat.push({
        x: e.clientX,
        y: e.clientY,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s,
        r: 3.5 + Math.random() * 2.5,
        l: 1,
      });
    }
  };

  private readonly onUp = (): void => {
    this.m.down = 0;
  };

  private readonly onTouchStart = (): void => {
    this.m.hide = 0;
  };

  private readonly onTouchEnd = (): void => {
    if (this.coarse.matches) this.m.hide = 1;
  };

  private readonly onLost = (e: Event): void => {
    e.preventDefault();
    this.ctx = null;
  };

  private readonly onRestored = (): void => {
    if (this.canvas) this.initGL(this.canvas);
  };

  private readonly frame = (now: number): void => {
    this.raf = requestAnimationFrame(this.frame);
    for (const task of this.tasks) task();
    const ctx = this.ctx;
    const cv = this.canvas;
    if (!ctx || !cv) return;
    const { gl, u } = ctx;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
    const H = window.innerHeight;
    const w = (window.innerWidth * dpr) | 0;
    const h = (H * dpr) | 0;
    if (cv.width !== w || cv.height !== h) {
      cv.width = w;
      cv.height = h;
      gl.viewport(0, 0, w, h);
    }

    const m = this.m;
    m.sx += (m.x - m.sx) * 0.3;
    m.sy += (m.y - m.sy) * 0.3;
    const vx = m.x - m.sx;
    const vy = m.y - m.sy;
    const sp = Math.hypot(vx, vy);
    this.darkT += ((this.state.dark() ? 1 : 0) - this.darkT) * 0.07;

    const D = this.dropBuf;
    let dn = 0;
    this.impact *= 0.88;
    m.hideT += (m.hide - m.hideT) * 0.12;
    const base = (18 + this.impact * 9 - (m.down ? 2 : 0)) * (1 - m.hideT);
    const push = (x: number, y: number, r: number): void => {
      if (dn < 10) {
        D[dn * 3] = x * dpr;
        D[dn * 3 + 1] = y * dpr;
        D[dn * 3 + 2] = r * dpr;
        dn++;
      }
    };

    push(m.sx, m.sy, base);
    this.splat = this.splat.filter((s) => {
      s.l -= 0.022;
      if (s.l <= 0) return false;
      s.vx *= 0.86;
      s.vy *= 0.86;
      const dx = m.sx - s.x;
      const dy = m.sy - s.y;
      const pull = (1 - s.l) * 0.12;
      s.vx += dx * pull;
      s.vy += dy * pull;
      s.x += s.vx;
      s.y += s.vy;
      if (Math.hypot(dx, dy) < base * 0.6 && s.l < 0.7) return false;
      push(s.x, s.y, s.r * Math.min(1, s.l * 1.6));
      return true;
    });
    if (sp > 1) push(m.sx - vx * 0.7, m.sy - vy * 0.7, base * Math.min(0.8, 0.3 + sp / 50));
    if (sp > 7 && this.trail.length < 6 && dn < 8 && now - this.lastSpawn > 55) {
      this.trail.push({ x: m.sx - vx * 1.3, y: m.sy - vy * 1.3, l: 1 });
      this.lastSpawn = now;
    }
    this.trail = this.trail.filter((t) => (t.l -= 0.035) > 0);
    for (const t of this.trail) push(t.x, t.y, 9 * t.l);

    let inside = false;
    const ph = this.photo;
    if (ph) {
      const b = ph.el.getBoundingClientRect();
      const hw = b.width / 2;
      const hh = b.height / 2;
      gl.uniform4f(u.uPh, (b.left + hw) * dpr, (b.top + hh) * dpr, hw * dpr, hh * dpr);
      gl.uniform1f(u.uPhR, Math.min(ph.radius(), hw) * dpr);
      gl.uniform1f(u.uPhS, Math.max(0.35, Math.min(1, b.width / 300)));
      if (m.x > b.left && m.x < b.right && m.y > b.top && m.y < b.bottom) inside = true;
    }

    const R = this.rectBuf;
    const Rad = this.radBuf;
    let n = 0;
    for (const item of this.glasses) {
      if (n >= 8) break;
      const b = item.el.getBoundingClientRect();
      if (b.width < 2 || b.bottom < 0 || b.top > H) continue;
      const hw = b.width / 2;
      const hh = b.height / 2;
      R[n * 4] = (b.left + hw) * dpr;
      R[n * 4 + 1] = (b.top + hh) * dpr;
      R[n * 4 + 2] = hw * dpr;
      R[n * 4 + 3] = hh * dpr;
      Rad[n] = Math.min(item.radius(), hh, hw) * dpr;
      n++;
      if (m.x > b.left && m.x < b.right && m.y > b.top && m.y < b.bottom) inside = true;
    }

    const B = this.bubBuf;
    const BRad = this.bubRadBuf;
    let bn = 0;
    let absorbed = 0;
    for (const item of this.bubbles) {
      if (bn >= 24) break;
      const b = item.el.getBoundingClientRect();
      if (b.width < 2 || b.bottom < 0 || b.top > H) continue;
      const hw = b.width / 2;
      const hh = b.height / 2;
      const cx = b.left + hw;
      const cy = b.top + hh;
      const rad = Math.min(item.radius(), hh, hw);
      const qx = Math.abs(m.sx - cx) - hw + rad;
      const qy = Math.abs(m.sy - cy) - hh + rad;
      const sd = Math.min(Math.max(qx, qy), 0) + Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) - rad;
      const touch = sd - base < 6 ? 1 : 0;
      const sunk = Math.max(0, Math.min(1, (base - sd) / (2 * base)));
      let s = this.swell.get(item.el);
      if (!s) {
        s = { s: 0, on: 0, t: 0 };
        this.swell.set(item.el, s);
      }
      if (touch !== s.on) {
        s.on = touch;
        const k = Math.hypot(m.sx - cx, m.sy - cy) || 1;
        this.ripple(m.sx + ((cx - m.sx) / k) * base * 0.5, m.sy + ((cy - m.sy) / k) * base * 0.5);
      }
      s.s += (sunk - s.s) * 0.12;
      s.t = now;
      if (touch) absorbed = Math.max(absorbed, sunk);
      const ex = s.s * 3.5 * dpr;
      if (!item.indicator?.()) {
        item.el.style.transform = s.s > 0.003 ? `scale(${(1 + s.s * 0.02).toFixed(4)})` : '';
      }
      B[bn * 4] = cx * dpr;
      B[bn * 4 + 1] = cy * dpr;
      B[bn * 4 + 2] = hw * dpr + ex;
      B[bn * 4 + 3] = hh * dpr + ex;
      BRad[bn] = rad * dpr + ex;
      bn++;
    }

    this.shrink += (absorbed * 0.3 - this.shrink) * 0.12;
    D[2] = base * (1 - this.shrink) * dpr;
    for (const [el, s] of this.swell) if (s.t !== now) this.swell.delete(el);

    if (inside && sp > 2.5 && now - this.lastRip > 120) {
      this.ripple(m.sx, m.sy);
      this.lastRip = now;
    }
    this.rips = this.rips.filter((r) => now - r.t0 < 2000);
    const RP = this.ripBuf;
    this.rips.forEach((r, i) => {
      RP[i * 3] = r.x * dpr;
      RP[i * 3 + 1] = r.y * dpr;
      RP[i * 3 + 2] = (now - r.t0) / 1000;
    });

    gl.uniform2f(u.uRes, cv.width, cv.height);
    gl.uniform1f(u.uTime, (now - this.t0) / 1000);
    gl.uniform1f(u.uDark, this.darkT);
    gl.uniform1f(u.uStr, 1);
    gl.uniform1f(u.uGrid, 1);
    gl.uniform1f(u.uHue, 0.62);
    gl.uniform1f(u.uDpr, dpr);
    gl.uniform4fv(u.uR, R);
    gl.uniform1fv(u.uRad, Rad);
    gl.uniform1i(u.uN, n);
    gl.uniform4fv(u.uB, B);
    gl.uniform1fv(u.uBRad, BRad);
    gl.uniform1i(u.uBN, bn);
    gl.uniform3fv(u.uD, D);
    gl.uniform1i(u.uDN, dn);
    gl.uniform3fv(u.uRip, RP);
    gl.uniform1i(u.uRN, this.rips.length);
    gl.uniform1f(u.uPhA, this.phA);
    gl.uniform1f(u.uPhOn, this.phOn);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
}
