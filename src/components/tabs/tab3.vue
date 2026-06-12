<template>
  <v-container>
    <v-row>
      <v-col cols="12" align="center">
        <v-card class="pa-4" variant="tonal" max-width="600">
          <template v-slot:title>🎵 生日歌单</template>
          <template v-slot:subtitle>
            <span v-if="musicinfo && musicinfo.length">共 {{ musicinfo.length }} 首歌曲</span>
            <span v-else>加载中...</span>
          </template>

          <v-list v-if="musicinfo && musicinfo.length" variant="tonal">
            <v-list-item
              v-for="(song, index) in musicinfo"
              :key="index"
              :active="currentIndex === index && isPlaying"
              @click="$emit('update:current-index', index)"
              density="compact"
              class="mb-1"
            >
              <template v-slot:prepend>
                <v-icon v-if="currentIndex === index && isPlaying" color="#FF6B9D">
                  mdi-music-circle
                </v-icon>
                <span v-else style="width: 24px; text-align: center; color: var(--leleo-vcard-color);">
                  {{ index + 1 }}
                </span>
              </template>
              <v-list-item-title style="color: var(--leleo-vcard-color);">
                {{ song.title }}
              </v-list-item-title>
              <v-list-item-subtitle>{{ song.author }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>

          <div v-if="currentSong" class="mt-4" style="color: var(--leleo-vcard-color);">
            <strong>正在播放:</strong> {{ currentSong.title }} - {{ currentSong.author }}
          </div>

          <div v-if="fromLyrics && fromLyrics.length" class="mt-3 lyrics-box">
            <p v-for="line in fromLyrics" :key="line" class="lyric-line">{{ line }}</p>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'tab3',
  emits: ['cancel', 'update:current-index', 'update:is-playing'],
  props: {
    musicinfo: Array,
    currentIndex: Number,
    isPlaying: Boolean,
    fromLyrics: Array,
    audioLoading: Boolean,
  },
  computed: {
    currentSong() {
      if (!this.musicinfo || !this.musicinfo.length) return null;
      return this.musicinfo[this.currentIndex] || null;
    }
  }
};
</script>

<style scoped>
.lyrics-box {
  max-height: 200px;
  overflow-y: auto;
  padding: 0.5rem;
  text-align: center;
}
.lyric-line {
  margin: 0.3rem 0;
  font-size: 0.9rem;
  color: #FFE4D6;
}
</style>
