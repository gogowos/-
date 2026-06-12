<template>
  <div class="main-layout" @click="showCards = !showCards">
    <!-- 大标题 -->
    <div class="main-title">{{ configdata.welcometitle }}</div>

    <!-- 点击提示 -->
    <div v-if="!showCards" class="click-hint">👆 点击屏幕任意位置显示卡片</div>

    <!-- 祝福卡片 -->
    <transition name="cards-fade">
      <v-container v-if="showCards" class="cards-container" @click.stop>
      <v-row>
        <v-col
          v-for="(item, key) in projectcards"
          cols="6"
          md="4"
          lg="3"
          :style="xs?{'padding': '6px'}:{}"
        >
          <v-card class="birthday-card" variant="tonal">
            <v-img
              aspect-ratio="1.7778"
              :src="item.img"
              cover
              :style="{ opacity: 0.75 }"
            ></v-img>
            <v-card-title :style="xs?{'font-size': '0.9rem','padding': '0.15rem 0.5rem'}:{'font-size': '1.1rem','padding':'0.2rem 0.8rem'}">
              {{ item.title }}
            </v-card-title>
            <v-card-subtitle :style="xs?{'font-size': '0.6rem','padding': '0.1rem 0.5rem'}:{'font-size': '0.8rem','padding':'0.15rem 0.6rem'}">
              {{ item.subtitle }}
            </v-card-subtitle>

            <v-card-actions :style="xs||sm||md?{'padding': '0','min-height': '0','height':'2.5rem'}:{'min-height': '0','height':'2.8rem'}">
              <v-btn
                variant="text"
                :text="item.go"
                :style="key === 2 ? {color: '#FFD700', animation: 'pulse 0.8s infinite'} : key === 1 ? {color: '#FF6B9D', animation: 'pulse 0.8s infinite'} : key === 5 ? {color: '#69F0AE', animation: 'pulse 0.8s infinite'} : key === 6 ? {color: '#7C4DFF', animation: 'pulse 0.8s infinite'} : {color: '#FFD700'}"
                @click.stop="handleCardAction(key, $event)"
              ></v-btn>
              <v-spacer></v-spacer>
              <v-btn
                :icon="item.show ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                @click.stop="handleCardAction(key, $event)"
                variant="text"
              ></v-btn>
            </v-card-actions>
            <v-expand-transition>
              <div v-show="item.show">
                <v-divider></v-divider>
                <v-card-text :style="xs?{'font-size': '0.7rem'}:{}">
                  {{ item.text }}
                </v-card-text>
              </div>
            </v-expand-transition>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    </transition>
  </div>
</template>

<script>
import { useDisplay } from 'vuetify';

export default {
  props: ['configdata', 'formattedTime', 'formattedDate', 'projectcards'],
  data() {
    return { showCards: false };
  },
  setup() {
    const { xs, sm, md } = useDisplay();
    return { xs, sm, md };
  },
  methods: {
    projectcardsShow(key) {
      for (let i = 0; i < this.projectcards.length; i++) {
        if (i != key) this.projectcards[i].show = false;
      }
    },
    handleCardAction(key, event) {
      if (key === 0) { location.href = '/blessing.html'; return; }
      if (key === 1) {
        window.dispatchEvent(new CustomEvent('toggle-falling-text'));
        this.projectcards[key].show = !this.projectcards[key].show;
        this.projectcardsShow(key);
        return;
      }
      if (key === 2) { location.href = '/firework.html'; return; }
      if (key === 5) { location.href = '/pvz.html'; return; }
      if (key === 6) { location.href = '/books.html'; return; }
      this.projectcards[key].show = !this.projectcards[key].show;
      this.projectcardsShow(key);
    }
  }
};
</script>

<style scoped>
.main-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 16px 40px;
  min-height: 100vh;
}
.main-title {
  font-family: "myfont";
  font-size: clamp(2.5rem, 7vw, 5rem);
  color: var(--leleo-welcomtitle-color);
  text-shadow: 0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.25);
  text-align: center;
  padding: 20px 0 10px;
  letter-spacing: 0.15em;
}
.cards-container {
  max-width: 1200px;
  width: 100%;
  margin-top: 16px;
}
.birthday-card {
  transition: all 0.3s ease;
}
.birthday-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(255, 107, 157, 0.3);
}

.click-hint {
  color: rgba(255,255,255,0.7);
  font-size: 1.2rem;
  margin: 40px 0;
  animation: hintPulse 2s ease-in-out infinite;
  cursor: pointer;
}
@keyframes hintPulse {
  0%,100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
}

/* 卡片渐入渐出过渡 */
.cards-fade-enter-active { transition: all 0.6s ease; }
.cards-fade-leave-active { transition: all 0.3s ease; }
.cards-fade-enter-from { opacity: 0; transform: translateY(30px); }
.cards-fade-leave-to { opacity: 0; transform: translateY(-20px); }

@import url(/css/app.less);
@import url(/css/mobile.less);
</style>
