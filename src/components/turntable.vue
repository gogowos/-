<template>
  <div class="turntable-wrap">
    <!-- 外圈霓虹发光环 -->
    <div class="turntable-glow"></div>

    <!-- 转盘 Canvas -->
    <canvas ref="canvas" class="turntable-canvas" @click="spin"></canvas>

    <!-- 指针（固定在顶部） -->
    <div class="turntable-pointer">
      <svg width="28" height="36" viewBox="0 0 28 36">
        <defs>
          <filter id="pointerShadow">
            <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#B8860B" flood-opacity="0.6"/>
          </filter>
        </defs>
        <polygon points="14,36 0,0 28,0" fill="#FFD700" filter="url(#pointerShadow)" stroke="#B8860B" stroke-width="1"/>
      </svg>
    </div>

    <!-- 中心按钮 -->
    <div class="turntable-center" @click="spin">
      <div class="center-ring"></div>
      <v-icon color="#4a3728" size="30">mdi-gift-outline</v-icon>
    </div>

    <!-- 底部提示 -->
    <div class="turntable-hint">✨ 点击转盘 · 抽取生日祝福 ✨</div>

    <!-- 结果弹窗 - 磨砂玻璃态 -->
    <transition name="modal">
      <div v-if="result" class="result-overlay" @click="result=''">
        <div class="result-card" @click.stop>
          <div class="result-icon">
            <v-icon size="48">mdi-party-popper</v-icon>
          </div>
          <div class="result-text">{{ result }}</div>
          <div class="result-sub">愿这份祝福伴你度过美好的一天 💫</div>
          <button class="result-close" @click="result=''">
            <v-icon size="18">mdi-close</v-icon>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'turntable',
  props: {
    color1: { type: String, default: '#E8C46A' },
    color2: { type: String, default: '#F0A8B8' }
  },
  data() {
    return {
      // 8 个分区：图标 + 祝福语
      segments: [
        { icon: 'mdi-cake-variant',  text: '生日快乐' },
        { icon: 'mdi-star-four-point', text: '万事如意' },
        { icon: 'mdi-heart-circle',  text: '幸福美满' },
        { icon: 'mdi-emoticon-happy',text: '天天开心' },
        { icon: 'mdi-rocket-launch', text: '前程似锦' },
        { icon: 'mdi-weather-night', text: '美梦成真' },
        { icon: 'mdi-clover',        text: '好运连连' },
        { icon: 'mdi-shimmer',       text: '青春永驻' },
      ],
      rotation: 0,
      spinning: false,
      result: '',
      canvasSize: 280,
    };
  },
  mounted() {
    this.draw();
    window.addEventListener('resize', this.handleResize);
    this.$nextTick(() => this.handleResize());
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      const el = this.$el;
      if (el) {
        this.canvasSize = Math.min(el.clientWidth - 20, 320);
        this.$nextTick(() => this.draw());
      }
    },

    // ===== 绘制转盘 =====
    draw() {
      const canvas = this.$refs.canvas;
      if (!canvas) return;
      const size = this.canvasSize;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      canvas.style.width = size + 'px';
      canvas.style.height = size + 'px';

      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
      const cx = size / 2, cy = size / 2;
      const outerR = size / 2 - 4;
      const innerR = outerR * 0.22;
      const segAngle = (Math.PI * 2) / this.segments.length;

      ctx.clearRect(0, 0, size, size);
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(this.rotation);

      // 底色圆盘
      const baseGrad = ctx.createRadialGradient(0, 0, innerR, 0, 0, outerR);
      baseGrad.addColorStop(0, '#FFF8E7');
      baseGrad.addColorStop(0.5, '#F5D5C8');
      baseGrad.addColorStop(1, '#E8C49A');
      ctx.beginPath();
      ctx.arc(0, 0, outerR, 0, Math.PI * 2);
      ctx.fillStyle = baseGrad;
      ctx.fill();

      // 分区（哑光金-蜜桃粉交替）
      const colors = [
        ['#FDF2E3', '#F7E0C8'],  // 奶油金
        ['#FCE4EC', '#F8D0DA'],  // 蜜桃粉
        ['#FDF2E3', '#F7E0C8'],
        ['#FCE4EC', '#F8D0DA'],
        ['#FDF2E3', '#F7E0C8'],
        ['#FCE4EC', '#F8D0DA'],
        ['#FDF2E3', '#F7E0C8'],
        ['#FCE4EC', '#F8D0DA'],
      ];

      this.segments.forEach((seg, i) => {
        const start = i * segAngle - Math.PI / 2;
        const end = (i + 1) * segAngle - Math.PI / 2;

        // 分区填充
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, outerR - 1, start, end);
        ctx.closePath();
        const grad = ctx.createLinearGradient(
          Math.cos(start) * outerR, Math.sin(start) * outerR,
          Math.cos(end) * outerR, Math.sin(end) * outerR
        );
        grad.addColorStop(0, colors[i][0]);
        grad.addColorStop(1, colors[i][1]);
        ctx.fillStyle = grad;
        ctx.fill();

        // 金属细边框
        ctx.strokeStyle = 'rgba(184,134,11,0.25)';
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // 图标（用 Canvas 绘制文字替代 emoji）
        const mid = start + segAngle / 2;
        const iconR = outerR * 0.62;
        ctx.save();
        ctx.rotate(mid);

        // 图标占位圆形
        ctx.beginPath();
        ctx.arc(iconR, 0, 16, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.35)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(184,134,11,0.2)';
        ctx.lineWidth = 0.6;
        ctx.stroke();

        // 图标字体（用 Unicode 符号）
        ctx.fillStyle = '#5D4037';
        ctx.font = 'bold 18px "Microsoft YaHei"';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const icons = ['🎂','⭐','💖','😊','🚀','🌙','🍀','✨'];
        ctx.fillText(icons[i], iconR, 0);

        // 文字
        ctx.fillStyle = '#4E342E';
        ctx.font = 'bold 11px "Microsoft YaHei"';
        ctx.fillText(seg.text, outerR * 0.82, 0);

        ctx.restore();
      });

      // 内圈装饰环
      ctx.beginPath();
      ctx.arc(0, 0, innerR + 6, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(184,134,11,0.35)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // 内圈底色
      ctx.beginPath();
      ctx.arc(0, 0, innerR, 0, Math.PI * 2);
      ctx.fillStyle = '#FFF8F0';
      ctx.fill();

      ctx.restore();

      // 外圈霓虹发光环（CSS 处理更简单）
    },

    // ===== 旋转 =====
    spin() {
      if (this.spinning) return;
      this.spinning = true;
      this.result = '';

      const segAngle = (Math.PI * 2) / this.segments.length;
      // 随机目标：8~12 圈 + 随机偏移
      const totalSpin = (8 + Math.random() * 5) * Math.PI * 2;
      const targetSeg = Math.floor(Math.random() * this.segments.length);
      const targetOffset = targetSeg * segAngle + segAngle / 2;
      const targetAngle = this.rotation + totalSpin + (Math.PI * 2 - (this.rotation % (Math.PI * 2))) + targetOffset;

      const duration = 3500 + Math.random() * 1500;
      const startTime = performance.now();
      const startRot = this.rotation;

      const animate = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // easeOutQuart 强缓出
        const ease = 1 - Math.pow(1 - progress, 4);
        this.rotation = startRot + (targetAngle - startRot) * ease;
        this.draw();

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          this.spinning = false;
          // 判断停在哪个分区
          const normalized = ((this.rotation % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
          const pointerAngle = -Math.PI / 2; // 指针在顶部
          let idx = Math.floor(((pointerAngle - normalized + Math.PI * 2) % (Math.PI * 2)) / segAngle);
          idx = (this.segments.length - idx) % this.segments.length;
          this.result = this.segments[idx].text + '！';
        }
      };
      requestAnimationFrame(animate);
    },
  }
};
</script>

<style scoped>
/* ===== 容器 ===== */
.turntable-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 4px 0 0;
}

/* ===== 外圈霓虹发光环 ===== */
.turntable-glow {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: calc(100% - 16px);
  max-width: 304px;
  aspect-ratio: 1;
  border-radius: 50%;
  background: transparent;
  box-shadow:
    0 0 20px rgba(232,196,106,0.5),
    0 0 50px rgba(232,196,106,0.25),
    0 0 80px rgba(240,168,184,0.2),
    inset 0 0 30px rgba(232,196,106,0.1);
  pointer-events: none;
  animation: glowPulse 3s ease-in-out infinite;
}
@keyframes glowPulse {
  0%, 100% { box-shadow: 0 0 20px rgba(232,196,106,0.5), 0 0 50px rgba(232,196,106,0.25), 0 0 80px rgba(240,168,184,0.2); }
  50%      { box-shadow: 0 0 30px rgba(232,196,106,0.7), 0 0 70px rgba(232,196,106,0.4), 0 0 100px rgba(240,168,184,0.35); }
}

/* ===== Canvas ===== */
.turntable-canvas {
  position: relative;
  z-index: 2;
  cursor: pointer;
  filter: drop-shadow(0 4px 12px rgba(0,0,0,0.15));
  transition: filter 0.3s;
}
.turntable-canvas:hover {
  filter: drop-shadow(0 6px 20px rgba(0,0,0,0.22));
}

/* ===== 顶部指针 ===== */
.turntable-pointer {
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
}

/* ===== 中心按钮 ===== */
.turntable-center {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 60px; height: 60px;
  border-radius: 50%;
  background: radial-gradient(circle at 45% 40%, #FFF8E1, #E8C46A);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 5;
  box-shadow:
    0 4px 16px rgba(184,134,11,0.35),
    inset 0 1px 0 rgba(255,255,255,0.6);
  transition: transform 0.2s;
}
.turntable-center:hover {
  transform: translate(-50%, -50%) scale(1.08);
}
.turntable-center:active {
  transform: translate(-50%, -50%) scale(0.94);
}

/* 呼吸光环 */
.center-ring {
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 2px solid rgba(232,196,106,0.5);
  animation: breathe 2s ease-in-out infinite;
}
@keyframes breathe {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50%      { transform: scale(1.18); opacity: 1; }
}

/* ===== 底部提示 ===== */
.turntable-hint {
  color: rgba(255,228,214,0.8);
  font-size: 0.82rem;
  margin-top: 12px;
  letter-spacing: 0.1em;
}

/* ===== 结果弹窗（磨砂玻璃态）===== */
.result-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0,0,0,0.35);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
}
.result-card {
  position: relative;
  background: rgba(255,255,255,0.18);
  backdrop-filter: blur(24px);
  border-radius: 24px;
  border: 1px solid rgba(255,255,255,0.3);
  padding: 40px 36px 36px;
  text-align: center;
  max-width: 340px; width: 88%;
  box-shadow:
    0 20px 60px rgba(0,0,0,0.15),
    0 0 0 1px rgba(255,255,255,0.2),
    inset 0 1px 0 rgba(255,255,255,0.25);
}
.result-icon {
  margin-bottom: 16px;
  color: #FFD700;
  filter: drop-shadow(0 0 12px rgba(255,215,0,0.5));
}
.result-text {
  font-size: 28px;
  font-weight: 900;
  background: linear-gradient(135deg, #FFD700, #FF6B6B);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 10px;
  letter-spacing: 0.08em;
}
.result-sub {
  font-size: 14px;
  color: rgba(255,255,255,0.7);
  letter-spacing: 0.05em;
}
.result-close {
  position: absolute;
  top: 10px; right: 10px;
  width: 32px; height: 32px;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.3);
  background: rgba(255,255,255,0.15);
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.result-close:hover {
  background: rgba(255,80,80,0.5);
  border-color: rgba(255,255,255,0.5);
}

/* 弹窗过渡 */
.modal-enter-active { transition: all 0.35s cubic-bezier(0.18,0.89,0.32,1.28); }
.modal-leave-active { transition: all 0.25s ease-in; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .result-card { transform: scale(0.7); }
.modal-leave-to .result-card { transform: scale(0.9); }
</style>
