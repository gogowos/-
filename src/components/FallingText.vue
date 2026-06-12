<template>
  <canvas ref="canvas" class="falling-text-canvas"></canvas>
</template>

<script>
export default {
  name: 'FallingText',
  data() {
    return {
      // ========== 配置区 ==========
      texts: [
        '🎂 生日快乐', '🌟 万事如意', '💖 永远幸福', '🎉 天天开心',
        '🌸 青春永驻', '✨ 前程似锦', '🎁 美梦成真', '🌈 好运连连',
        '💫 平安喜乐', '🍀 心想事成', '🎀 笑口常开', '💝 幸福美满',
        '⭐ 光芒万丈', '🕊️ 自由自在', '🌺 美丽动人', '🎵 岁月静好',
      ],
      fontSize: 22,          // 字号
      fontFamily: "'Microsoft YaHei','PingFang SC',sans-serif",
      count: 35,             // 同时显示的文字数量
      minSpeed: 0.3,         // 最小下落速度 (px/frame)
      maxSpeed: 1.2,         // 最大下落速度
      colors: [              // 颜色池
        '#FF6B9D', '#FFD93D', '#6BCB77', '#4D96FF',
        '#FF9F43', '#A55EEA', '#FF6348', '#00E5FF',
        '#FF4081', '#69F0AE', '#FFD740', '#7C4DFF',
        '#FFAB91', '#80DEEA', '#F48FB1', '#B2FF59',
      ],
      // ==========================
      items: [],
      animId: null,
      hoveredIdx: -1,
    };
  },
  methods: {
    init() {
      const canvas = this.$refs.canvas;
      this.ctx = canvas.getContext('2d');
      this.resize();
      this.items = [];
      for (let i = 0; i < this.count; i++) {
        this.items.push(this.createItem(true));
      }
      this.loop();
    },
    resize() {
      const canvas = this.$refs.canvas;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    },
    createItem(initAbove) {
      const text = this.texts[Math.random() * this.texts.length | 0];
      const color = this.colors[Math.random() * this.colors.length | 0];
      this.ctx.font = `${this.fontSize}px ${this.fontFamily}`;
      const m = this.ctx.measureText(text);
      return {
        text,
        color,
        x: Math.random() * (window.innerWidth + 100) - 50,
        y: initAbove ? -(Math.random() * window.innerHeight) : -(Math.random() * 60),
        speed: this.minSpeed + Math.random() * (this.maxSpeed - this.minSpeed),
        alpha: 0.4 + Math.random() * 0.5,
        alphaDir: Math.random() > 0.5 ? 0.003 : -0.003,
        width: m.width,
        height: this.fontSize,
      };
    },
    loop() {
      const { ctx } = this;
      const W = this.$refs.canvas.width;
      const H = this.$refs.canvas.height;
      ctx.clearRect(0, 0, W, H);

      ctx.font = `${this.fontSize}px ${this.fontFamily}`;
      ctx.textBaseline = 'middle';

      for (let i = 0; i < this.items.length; i++) {
        const item = this.items[i];

        // 悬浮暂停
        if (i !== this.hoveredIdx) {
          item.y += item.speed;
        }

        // 透明度呼吸
        item.alpha += item.alphaDir;
        if (item.alpha > 0.85) item.alphaDir = -0.002;
        if (item.alpha < 0.35) item.alphaDir = 0.002;

        // 超出屏幕则回收
        if (item.y > H + 60) {
          this.items[i] = this.createItem(false);
          continue;
        }

        ctx.globalAlpha = item.alpha;
        ctx.fillStyle = item.color;
        ctx.shadowColor = item.color;
        ctx.shadowBlur = 6;
        ctx.fillText(item.text, item.x, item.y);
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      this.animId = requestAnimationFrame(this.loop);
    },
    handleMouseMove(e) {
      if (!this.items.length) return;
      const mx = e.clientX, my = e.clientY;
      let found = -1;
      for (let i = this.items.length - 1; i >= 0; i--) {
        const item = this.items[i];
        const left = item.x - item.width / 2;
        const right = item.x + item.width / 2;
        const top = item.y - item.height / 2;
        const bottom = item.y + item.height / 2;
        if (mx >= left && mx <= right && my >= top && my <= bottom) {
          found = i;
          break;
        }
      }
      this.hoveredIdx = found;
    },
  },
  mounted() {
    this.init();
    window.addEventListener('resize', this.resize);
    window.addEventListener('mousemove', this.handleMouseMove);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.resize);
    window.removeEventListener('mousemove', this.handleMouseMove);
    if (this.animId) cancelAnimationFrame(this.animId);
  },
};
</script>

<style scoped>
.falling-text-canvas {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  z-index: 3;
  pointer-events: none;
}
</style>
