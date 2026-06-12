<template>
  <transition name="intro-fade">
    <div v-if="visible" class="intro-overlay" @click="skip">
      <div class="intro-box">
        <div class="intro-text" ref="textEl">{{ displayedText }}<span class="cursor">|</span></div>
        <div v-if="done" class="intro-enter" @click.stop="dismiss">✨ 点击进入 ✨</div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'IntroScreen',
  emits: ['done'],
  data() {
    return {
      visible: true,
      displayedText: '',
      done: false,
      fullText: 'Hi，这里是三帝网。\n\n我不是李峋，我是DeepSeek搬运工。\n\n首先祝你们两个生日快乐🎂\n虽然另一个帝生日过好久了，我有点抱歉。\n\n但如果当时只是小小的祝福，就太不要脸了。\n\n然后我就构思一个网站，可以来表达对你们的祝福，希望你们天天开心，忘记所有烦恼。\n\n网站内容有点尬，有些没补全，别介意💝',
      timer: null,
    };
  },
  mounted() {
    this.startTyping();
  },
  methods: {
    startTyping() {
      let idx = 0;
      const speed = 60; // 每字速度
      this.timer = setInterval(() => {
        if (idx < this.fullText.length) {
          this.displayedText += this.fullText[idx];
          idx++;
          // 滚动到底部
          this.$nextTick(() => {
            const el = this.$refs.textEl;
            if (el) el.scrollTop = el.scrollHeight;
          });
        } else {
          clearInterval(this.timer);
          this.done = true;
        }
      }, speed);
    },
    skip() {
      if (!this.done) {
        clearInterval(this.timer);
        this.displayedText = this.fullText;
        this.done = true;
      }
    },
    dismiss() {
      this.visible = false;
      setTimeout(() => this.$emit('done'), 600);
    },
  },
};
</script>

<style scoped>
.intro-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: radial-gradient(ellipse at center, #1a0a2e 0%, #0a0a0f 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
}
.intro-box {
  max-width: 620px;
  width: 90%;
  text-align: center;
}
.intro-text {
  color: #e8d5f5;
  font-size: clamp(16px, 2.5vw, 20px);
  line-height: 2.2;
  letter-spacing: 0.06em;
  text-align: left;
  white-space: pre-wrap;
  max-height: 70vh;
  overflow-y: auto;
  padding: 20px;
}
.intro-text::-webkit-scrollbar { width: 0; }
.cursor {
  display: inline-block;
  color: #FFD700;
  animation: blink 0.8s infinite;
  font-weight: 100;
}
@keyframes blink {
  0%,100% { opacity: 1; }
  50% { opacity: 0; }
}
.intro-enter {
  margin-top: 30px;
  color: #FFD700;
  font-size: 18px;
  letter-spacing: 0.15em;
  animation: enterPulse 1.5s ease-in-out infinite;
  cursor: pointer;
}
@keyframes enterPulse {
  0%,100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.08); }
}
.intro-enter:hover { opacity: 1; }

/* 过渡 */
.intro-fade-leave-active { transition: opacity 0.6s ease; }
.intro-fade-leave-to { opacity: 0; }
</style>
