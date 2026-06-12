<template>
  <canvas
    ref="canvas"
    class="firework-canvas"
    :width="width"
    :height="height"
  ></canvas>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';

export default {
  name: 'FireworkCanvas',
  setup() {
    const canvas = ref(null);
    const width = ref(window.innerWidth);
    const height = ref(window.innerHeight);
    let ctx = null;
    let animId = null;
    let rockets = [];
    let particles = [];
    let sparks = [];
    let launchTimer = null;
    let isRunning = false;

    const COLORS = [
      '#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF',
      '#FF6BCD', '#FF9F43', '#A55EEA', '#FF6348',
      '#00E5FF', '#FF4081', '#69F0AE', '#FFD740',
      '#7C4DFF', '#FF1744', '#40C4FF', '#B2FF59'
    ];

    class Rocket {
      constructor(x, y, tx, ty) {
        this.x = x;
        this.y = y;
        this.tx = tx;
        this.ty = ty;
        this.vx = (tx - x) / 35;
        this.vy = (ty - y) / 35 - 4;
        this.trail = [];
        this.alive = true;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      }
      update() {
        this.trail.push({ x: this.x, y: this.y, life: 10 });
        if (this.trail.length > 15) this.trail.shift();
        this.trail.forEach(t => t.life--);
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.05;
        if (this.vy > 0 || this.y <= this.ty) {
          this.alive = false;
          this.explode();
        }
      }
      explode() {
        const count = 80 + Math.floor(Math.random() * 60);
        for (let i = 0; i < count; i++) {
          const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
          const speed = 2 + Math.random() * 7;
          particles.push(new Particle(this.x, this.y, this.color, angle, speed));
        }
        for (let i = 0; i < 30; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 1 + Math.random() * 3;
          sparks.push(new Spark(this.x, this.y, '#FFFBE6', angle, speed));
        }
      }
      draw(ctx) {
        this.trail.forEach(t => {
          if (t.life > 0) {
            ctx.beginPath();
            ctx.arc(t.x, t.y, 2.5 * (t.life / 10), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,200,80,${t.life / 10 * 0.7})`;
            ctx.fill();
          }
        });
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#FFF';
        ctx.fill();
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    class Particle {
      constructor(x, y, color, angle, speed) {
        this.x = x;
        this.y = y;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.color = color;
        this.life = 70 + Math.random() * 50;
        this.maxLife = this.life;
        this.size = 1.5 + Math.random() * 3.5;
        this.gravity = 0.04;
        this.friction = 0.98;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.life--;
      }
      draw(ctx) {
        const alpha = this.life / this.maxLife;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * alpha, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    class Spark {
      constructor(x, y, color, angle, speed) {
        this.x = x;
        this.y = y;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.color = color;
        this.life = 20 + Math.random() * 25;
        this.maxLife = this.life;
        this.size = 1 + Math.random() * 2;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.95;
        this.vy *= 0.95;
        this.life--;
      }
      draw(ctx) {
        const alpha = this.life / this.maxLife;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width.value, height.value);

      rockets = rockets.filter(r => r.alive);
      particles = particles.filter(p => p.life > 0);
      sparks = sparks.filter(s => s.life > 0);

      rockets.forEach(r => { r.update(); r.draw(ctx); });
      particles.forEach(p => { p.update(); p.draw(ctx); });
      sparks.forEach(s => { s.update(); s.draw(ctx); });

      const hasContent = rockets.length > 0 || particles.length > 0 || sparks.length > 0;
      if (hasContent || isRunning) {
        animId = requestAnimationFrame(animate);
      } else {
        animId = null;
      }
    }

    function ensureAnimating() {
      if (!animId) {
        animId = requestAnimationFrame(animate);
      }
    }

    function fireWave() {
      if (!isRunning) return;
      const w = width.value;
      const h = height.value;
      // 每波发射 12-20 枚，从底部不同位置
      const count = 12 + Math.floor(Math.random() * 9);
      const cx = w / 2;
      for (let i = 0; i < count; i++) {
        const bx = cx + (Math.random() - 0.5) * w * 0.8;
        const tx = bx + (Math.random() - 0.5) * 200;
        const ty = 60 + Math.random() * h * 0.5;
        setTimeout(() => {
          if (!isRunning) return;
          rockets.push(new Rocket(bx, h + 10, tx, ty));
          ensureAnimating();
        }, i * 50);
      }
      // 下一波
      launchTimer = setTimeout(fireWave, 500 + Math.random() * 600);
    }

    function start() {
      if (isRunning) return;
      isRunning = true;
      ensureAnimating();
      // 立刻来一波大的
      fireWave();
      // 0.3秒后再来一波
      setTimeout(() => { if (isRunning) fireWave(); }, 300);
    }

    function stop() {
      isRunning = false;
      if (launchTimer) {
        clearTimeout(launchTimer);
        launchTimer = null;
      }
    }

    function handleResize() {
      width.value = window.innerWidth;
      height.value = window.innerHeight;
      nextTick(() => {
        if (canvas.value) {
          ctx = canvas.value.getContext('2d');
        }
      });
    }

    onMounted(() => {
      ctx = canvas.value.getContext('2d');
      window.addEventListener('resize', handleResize);
    });

    onBeforeUnmount(() => {
      stop();
      window.removeEventListener('resize', handleResize);
      if (animId) cancelAnimationFrame(animId);
    });

    return { canvas, width, height, start, stop };
  }
};
</script>

<style scoped>
.firework-canvas {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 200;
  pointer-events: none;
}
</style>
