<template>
  <!-- 开场白 -->
  <IntroScreen v-if="!introDone" @done="introDone = true" />

  <v-app class="vapp-fullscreen-background" style="overflow: hidden;"
    :class="{ 'radius-before': !xs }"
    :style="xs ? { height: '100%', width: '100%', top: '0', left: '0' }
      : (sm ? { height: '98%', width: '98%', top: '1%', left: '1%' }
      : { height: '96.6%', width: '99%', top: '1.7%', left: '0.5%' })"
    v-show="introDone">

    <!-- 加载动画 -->
    <transition name="fade">
      <div class="loading" v-show="isloading">
        <loader></loader>
      </div>
    </transition>

    <!-- 视频背景 -->
    <video autoplay loop playsinline class="video-bg" id="bg-video" ref="VdPlayer"
      :style="xs ? { height: '100%', width: '100%', top: '0', left: '0' }
        : (sm ? { height: '98%', width: '98%', top: '1%', left: '1%', 'border-radius': '16px' }
        : { height: '96.6%', width: '99%', top: '1.7%', left: '0.5%', 'border-radius': '16px' })">
      <source :src="videosrc" type="video/mp4">
    </video>

    <!-- 背景切换按钮 -->
    <div class="bg-switch-btns" :style="xs ? {top:'10px',left:'10px',gap:'6px'} : {top:'20px',left:'20px',gap:'10px'}">
      <button
        class="bg-btn red-btn"
        :class="{ active: currentBg === 'red' }"
        :style="xs ? {padding:'6px 14px',fontSize:'13px'} : {}"
        @click="switchBg('red')"
      >❤️ Red</button>
      <button
        class="bg-btn pink-btn"
        :class="{ active: currentBg === 'pink' }"
        :style="xs ? {padding:'6px 14px',fontSize:'13px'} : {}"
        @click="switchBg('pink')"
      >💗 Pink</button>
    </div>

    <!-- 清屏切换开关 -->
    <div class="floating-switch-container">
      <v-switch
        v-model="isClearScreen"
        inset
        :style="xs ? { 'transform': 'scale(0.6) translateX(15%)' } : {}"
        class="floating-switch"
        @mouseover="expandSwitch"
        @mouseleave="collapseSwitch"
      ></v-switch>
    </div>

    <!-- 主内容 -->
    <div v-show="!isloading && !isClearScreen"
      :style="xs || sm ? { 'overflow-y': 'auto', 'overflow-x': 'hidden' } : { 'overflow-y': 'auto', 'overflow-x': 'hidden' }">
      <homeright :configdata="configdata"
        :formattedTime="formattedTime"
        :formattedDate="formattedDate"
        :projectcards="projectcards">
      </homeright>
    </div>

    <!-- 飘落文字层 -->
    <FallingText ref="fallingText" v-if="showFallingText" />

  </v-app>
</template>

<script src="./app.js"></script>
<style scoped>
  @import url(/css/app.less);
  @import url(/css/mobile.less);
</style>
