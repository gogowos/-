<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
        <v-card class="pa-4" variant="tonal">
          <template v-slot:title>🎨 主题颜色</template>
          <v-color-picker v-model="themecolor" mode="hex" width="280"></v-color-picker>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="pa-4" variant="tonal">
          <template v-slot:title>💡 背景亮度</template>
          <v-slider v-model="brightness" min="30" max="150" step="1" color="#FFD700" thumb-label>
            <template v-slot:prepend>
              <v-icon color="#FFD700">mdi-brightness-5</v-icon>
            </template>
          </v-slider>
          <template v-slot:subtitle>当前: {{ brightness }}%</template>
        </v-card>
        <v-card class="pa-4 mt-4" variant="tonal">
          <template v-slot:title>🔮 模糊效果</template>
          <v-slider v-model="blur" min="0" max="20" step="1" color="#FF6B9D" thumb-label>
            <template v-slot:prepend>
              <v-icon color="#FF6B9D">mdi-blur</v-icon>
            </template>
          </v-slider>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="mt-4">
      <v-col align="center">
        <v-btn color="#FFD700" variant="tonal" @click="applyStyle" size="large" prepend-icon="mdi-check">
          应用样式
        </v-btn>
        <v-btn class="ml-3" variant="tonal" @click="resetStyle" prepend-icon="mdi-refresh">
          恢复默认
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { getCookie, setCookie, deleteCookie } from '../../utils/cookieUtils.js';
import config from '../../config.js';

export default {
  name: 'tab1',
  emits: ['cancel'],
  data() {
    const saved = getCookie('leleodata');
    const data = saved ? JSON.parse(saved) : config;
    return {
      themecolor: data.color?.themecolor || '#FFE4D6',
      brightness: data.brightness || 75,
      blur: data.blur || 8,
    };
  },
  methods: {
    applyStyle() {
      const data = {
        color: { themecolor: this.themecolor, welcometitlecolor: config.color.welcometitlecolor },
        brightness: this.brightness,
        blur: this.blur,
      };
      setCookie('leleodata', JSON.stringify(data));
      const root = document.documentElement;
      root.style.setProperty('--leleo-vcard-color', this.themecolor);
      root.style.setProperty('--leleo-brightness', `${this.brightness}%`);
      root.style.setProperty('--leleo-blur', `${this.blur}px`);
      this.$emit('cancel');
    },
    resetStyle() {
      deleteCookie('leleodata');
      const root = document.documentElement;
      root.style.setProperty('--leleo-vcard-color', config.color.themecolor);
      root.style.setProperty('--leleo-brightness', `${config.brightness}%`);
      root.style.setProperty('--leleo-blur', `${config.blur}px`);
      this.themecolor = config.color.themecolor;
      this.brightness = config.brightness;
      this.blur = config.blur;
    }
  }
};
</script>
