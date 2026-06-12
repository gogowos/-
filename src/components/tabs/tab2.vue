<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="pa-3 mb-4" variant="tonal">
          <template v-slot:title>🖼️ 当前背景</template>
          <template v-slot:subtitle>
            PC端: {{ currentPcTitle }} | 移动端: {{ currentMobileTitle }}
          </template>
        </v-card>
      </v-col>
    </v-row>

    <!-- 静态壁纸 -->
    <v-card class="pa-3 mb-4" variant="tonal">
      <template v-slot:title>🖼️ 静态壁纸</template>
      <v-row>
        <v-col v-for="(item, i) in wallpaper.pic" cols="6" md="3" :key="'pic'+i">
          <v-card class="pa-1" :class="{'border-highlight': selectedPcPic === i}" @click="applyPic('pc', i)" hover>
            <v-img :src="item.preview || item.url" aspect-ratio="1.7778" cover></v-img>
            <v-card-text class="pa-1 text-caption">{{ item.title }}</v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card>

    <!-- 动态壁纸 -->
    <v-card class="pa-3" variant="tonal">
      <template v-slot:title>🎬 动态壁纸</template>
      <v-row>
        <v-col v-for="(item, i) in wallpaper.video" cols="6" md="3" :key="'vid'+i">
          <v-card class="pa-1" :class="{'border-highlight': selectedPcVideo === i}" @click="applyVideo('pc', i)" hover>
            <v-icon size="48" class="d-block text-center">mdi-play-circle</v-icon>
            <v-card-text class="pa-1 text-caption">{{ item.title }}</v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import { useDisplay } from 'vuetify';
import { getCookie, setCookie } from '../../utils/cookieUtils.js';
import config from '../../config.js';

export default {
  name: 'tab2',
  emits: ['cancel'],
  setup() {
    const { xs } = useDisplay();
    return { xs };
  },
  data() {
    const saved = getCookie('leleodatabackground');
    return {
      wallpaper: config.wallpaper,
      selectedPcPic: null,
      selectedPcVideo: null,
    };
  },
  computed: {
    currentPcTitle() {
      const saved = getCookie('leleodatabackground');
      if (saved) return JSON.parse(saved).pc.datainfo.title;
      return config.background.pc.datainfo.title;
    },
    currentMobileTitle() {
      const saved = getCookie('leleodatabackground');
      if (saved) return JSON.parse(saved).mobile.datainfo.title;
      return config.background.mobile.datainfo.title;
    },
  },
  methods: {
    applyPic(device, index) {
      const data = {
        pc: { type: 'pic', datainfo: this.wallpaper.pic[index] },
        mobile: { type: 'pic', datainfo: this.wallpaper.pic[0] },
      };
      setCookie('leleodatabackground', JSON.stringify(data));
      this.selectedPcPic = index;
      this.$emit('cancel');
      setTimeout(() => location.reload(), 300);
    },
    applyVideo(device, index) {
      const data = {
        pc: { type: 'video', datainfo: this.wallpaper.video[index] },
        mobile: { type: 'video', datainfo: this.wallpaper.videoMobile?.[index] || this.wallpaper.video[index] },
      };
      setCookie('leleodatabackground', JSON.stringify(data));
      this.selectedPcVideo = index;
      this.$emit('cancel');
      setTimeout(() => location.reload(), 300);
    },
  }
};
</script>

<style scoped>
.border-highlight {
  border: 2px solid #FFD700 !important;
}
</style>
