<template>
  <div ref="typewriterElement" class="typewriter-container"></div>
</template>

<script>
import TypeIt from "typeit";
import config from '../config.js';

export default {
  name: 'typewriter',
  mounted() {
    const strings = config.typeWriterStrings;
    const instance = new TypeIt(this.$refs.typewriterElement, {
      speed: 80,
      deleteSpeed: 40,
      lifeLike: true,
      cursor: true,
      cursorChar: '✨',
      breakLines: true,
      waitUntilVisible: true,
    });

    strings.forEach((str, index) => {
      instance.type(str);
      if (index < strings.length - 1) {
        instance.pause(2000).delete(str.length);
      }
    });

    instance.go();
  }
};
</script>

<style scoped>
.typewriter-container {
  font-size: clamp(1rem, 2vw, 1.3rem);
  color: #FFE4D6;
  min-height: 80px;
  line-height: 2;
  text-shadow: 0 2px 10px rgba(0,0,0,0.5);
  padding: 1rem;
}
</style>
