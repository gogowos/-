import homeright from '../src/components/hoemright.vue';
import typewriter from './components/typewriter.vue';
import tab1 from './components/tabs/tab1.vue';
import tab2 from './components/tabs/tab2.vue';
import tab3 from './components/tabs/tab3.vue';
import loader from './components/loader.vue';
import polarchart from './components/polarchart.vue';
import FallingText from './components/FallingText.vue';
import IntroScreen from './components/IntroScreen.vue';
import config from './config.js';
import { getCookie } from './utils/cookieUtils.js';
import { setMeta, getFormattedTime, getFormattedDate, dataConsole } from './utils/common.js';
import { useDisplay } from 'vuetify';

export default {
  components: {
    tab1, tab2, tab3, loader, homeright, typewriter, polarchart, FallingText, IntroScreen
  },
  setup() {
    const { xs, sm, md } = useDisplay();
    return { xs, sm, md };
  },
  data() {
    return {
      introDone: false,
      isloading: false,
      isClearScreen: false,
      formattedTime: "",
      formattedDate: "",
      configdata: config,
      dialog1: false,
      dialog2: false,
      personalizedtags: null,
      videosrc: '',
      ismusicplayer: false,
      isPlaying: false,
      playlistIndex: 0,
      audioLoading: false,
      musicinfo: null,
      musicinfoLoading: false,
      lyrics: {},
      socialPlatformIcons: null,
      isExpanded: false,
      stackicons: [
        { icon: "mdi-vuejs", color: "green", model: false, tip: 'vue' },
        { icon: "mdi-language-javascript", color: "#CAD300", model: false, tip: 'javascript' },
        { icon: "mdi-language-css3", color: "blue", model: false, tip: 'css' },
        { icon: "mdi-language-html5", color: "red", model: false, tip: 'html' },
        { icon: "$vuetify", color: "#1697F6", model: false, tip: 'vuetify' },
      ],
      projectcards: null,
      showFallingText: false,
      currentBg: 'pink',
      tab: null,
      tabs: [
        {
          icon: 'mdi-palette',
          text: '样式设置',
          value: 'tab-1',
          component: "tab1",
        },
        {
          icon: 'mdi-wallpaper',
          text: '背景切换',
          value: 'tab-2',
          component: "tab2",
        },
        {
          icon: 'mdi-music-circle-outline',
          text: '生日歌单',
          value: 'tab-3',
          component: "tab3",
        },
      ],
    };
  },
  async mounted() {
    // Vercel环境变量配置支持
    if (import.meta.env.VITE_CONFIG) {
      this.configdata = JSON.parse(import.meta.env.VITE_CONFIG);
    }
    this.projectcards = this.configdata.projectcards;
    this.socialPlatformIcons = this.configdata.socialPlatformIcons;
    this.personalizedtags = this.configdata.tags;
    this.isloading = true;
    let imageurl = "";
    this.dataConsole();
    this.setMeta(
      this.configdata.metaData.title,
      this.configdata.metaData.description,
      this.configdata.metaData.keywords,
      this.configdata.metaData.icon
    );

    imageurl = this.setMainProperty(imageurl);

    // 快速加载：仅等视频/背景就绪，外部图片懒加载
    const initPage = () => {
      return new Promise((resolve) => {
        // 超时兜底：800ms 后强制显示
        const timeout = setTimeout(() => resolve(), 800);

        if (imageurl) {
          // 静态图片背景：快速加载
          const img = new Image();
          img.src = imageurl;
          img.onload = () => { clearTimeout(timeout); resolve(); };
          img.onerror = () => { clearTimeout(timeout); resolve(); };
        } else {
          // 视频背景：等元数据就绪
          const video = this.$refs.VdPlayer;
          if (video) {
            if (video.readyState >= 2) {
              // 已有足够数据，直接显示
              clearTimeout(timeout);
              resolve();
            } else {
              video.onloadedmetadata = () => { clearTimeout(timeout); resolve(); };
              video.onerror = () => { clearTimeout(timeout); resolve(); };
            }
          } else {
            clearTimeout(timeout);
            resolve();
          }
        }
      });
    };

    initPage().then(() => {
      this.formattedTime = this.getFormattedTime(new Date());
      this.formattedDate = this.getFormattedDate(new Date());
      this.isloading = false;
    });

    setInterval(() => {
      this.formattedTime = this.getFormattedTime(new Date());
    }, 1000);

    await this.getMusicInfo();
    this.setupAudioListener();

    // 自动飘落彩纸效果
    this.startConfetti();

    // 监听飘落文字切换事件
    window.addEventListener('toggle-falling-text', () => {
      this.showFallingText = !this.showFallingText;
    });

    // 视频声音：浏览器禁止自动播放有声视频，首次点击页面时取消静音
    this.$nextTick(() => {
      const video = this.$refs.VdPlayer;
      if (video) {
        // 先尝试取消静音（可能被浏览器拒绝）
        video.muted = false;
        video.play().catch(() => {
          // 自动播放被拒，等用户点击后取消静音
          video.muted = true;
          const unmuteHandler = () => {
            video.muted = false;
            video.play();
            document.removeEventListener('click', unmuteHandler);
          };
          document.addEventListener('click', unmuteHandler, { once: true });
        });
      }
    });
  },

  beforeDestroy() {
    this.$refs.audioPlayer?.removeEventListener('ended', this.nextTrack);
    if (this.confettiInterval) clearInterval(this.confettiInterval);
  },

  watch: {
    isClearScreen(val) {
      if (!this.videosrc) return;
      if (val) {
        this.$refs.VdPlayer.style.zIndex = 0;
        this.$refs.VdPlayer.controls = true;
      } else {
        this.$refs.VdPlayer.style.zIndex = -100;
        this.$refs.VdPlayer.controls = false;
      }
    },
    audioLoading(val) {
      this.isPlaying = !val;
    }
  },

  computed: {
    currentSong() {
      return this.musicinfo?.[this.playlistIndex];
    },
    audioPlayer() {
      return this.$refs.audioPlayer;
    }
  },

  methods: {
    getCookie, setMeta, getFormattedTime, getFormattedDate, dataConsole,

    setMainProperty(imageurl) {
      const root = document.documentElement;
      let leleodata = this.getCookie("leleodata");
      if (leleodata) {
        root.style.setProperty('--leleo-welcomtitle-color', `${leleodata.color.welcometitlecolor}`);
        root.style.setProperty('--leleo-vcard-color', `${leleodata.color.themecolor}`);
        root.style.setProperty('--leleo-brightness', `${leleodata.brightness}%`);
        root.style.setProperty('--leleo-blur', `${leleodata.blur}px`);
      } else {
        root.style.setProperty('--leleo-welcomtitle-color', `${this.configdata.color.welcometitlecolor}`);
        root.style.setProperty('--leleo-vcard-color', `${this.configdata.color.themecolor}`);
        root.style.setProperty('--leleo-brightness', `${this.configdata.brightness}%`);
        root.style.setProperty('--leleo-blur', `${this.configdata.blur}px`);
      }

      let leleodatabackground = this.getCookie("leleodatabackground");
      const { xs } = useDisplay();
      if (leleodatabackground) {
        if (xs.value) {
          if (leleodatabackground.mobile.type == "pic") {
            root.style.setProperty('--leleo-background-image-url', `url('${leleodatabackground.mobile.datainfo.url}')`);
            imageurl = leleodatabackground.mobile.datainfo.url;
            return imageurl;
          } else {
            this.videosrc = leleodatabackground.mobile.datainfo.url;
          }
        } else {
          if (leleodatabackground.pc.type == "pic") {
            root.style.setProperty('--leleo-background-image-url', `url('${leleodatabackground.pc.datainfo.url}')`);
            imageurl = leleodatabackground.pc.datainfo.url;
            return imageurl;
          } else {
            this.videosrc = leleodatabackground.pc.datainfo.url;
          }
        }
      } else {
        if (xs.value) {
          if (this.configdata.background.mobile.type == "pic") {
            root.style.setProperty('--leleo-background-image-url', `url('${this.configdata.background.mobile.datainfo.url}')`);
            imageurl = this.configdata.background.mobile.datainfo.url;
            return imageurl;
          } else {
            this.videosrc = this.configdata.background.mobile.datainfo.url;
          }
        } else {
          if (this.configdata.background.pc.type == "pic") {
            root.style.setProperty('--leleo-background-image-url', `url('${this.configdata.background.pc.datainfo.url}')`);
            imageurl = this.configdata.background.pc.datainfo.url;
            return imageurl;
          } else {
            this.videosrc = this.configdata.background.pc.datainfo.url;
          }
        }
      }
    },

    projectcardsShow(key) {
      this.projectcards.forEach((item, index) => {
        if (index != key) {
          item.show = false;
        }
      });
    },
    handleCancel() {
      this.dialog1 = false;
    },
    jump(url) {
      window.open(url, '_blank').focus();
    },

    async getMusicInfo() {
      this.musicinfoLoading = true;
      try {
        const response = await fetch(
          `https://api.i-meto.com/meting/api?server=${this.configdata.musicPlayer.server}&type=${this.configdata.musicPlayer.type}&id=${this.configdata.musicPlayer.id}`
        );
        if (!response.ok) throw new Error('网络请求失败');
        this.musicinfo = await response.json();
        this.musicinfoLoading = false;
      } catch (error) {
        console.error('请求失败:', error);
        this.musicinfoLoading = false;
      }
    },
    musicplayershow(val) {
      this.ismusicplayer = val;
    },

    setupAudioListener() {
      this.$refs.audioPlayer?.addEventListener('ended', this.nextTrack);
    },

    togglePlay() {
      if (!this.isPlaying) {
        this.audioPlayer?.play();
      } else {
        this.audioPlayer?.pause();
      }
      this.isPlaying = !this.musicinfoLoading && !this.isPlaying;
    },
    previousTrack() {
      this.playlistIndex = this.playlistIndex > 0 ? this.playlistIndex - 1 : (this.musicinfo?.length || 1) - 1;
      this.updateAudio();
    },
    nextTrack() {
      this.playlistIndex = this.playlistIndex < (this.musicinfo?.length || 1) - 1 ? this.playlistIndex + 1 : 0;
      this.updateAudio();
    },
    updateAudio() {
      if (!this.audioPlayer || !this.currentSong) return;
      this.audioPlayer.src = this.currentSong.url;
      this.$refs.audiotitle.innerText = this.currentSong.title;
      this.$refs.audioauthor.innerText = this.currentSong.author;
      this.isPlaying = true;
      this.audioPlayer.play();
    },
    updateCurrentIndex(index) {
      this.playlistIndex = index;
      this.updateAudio();
    },
    updateIsPlaying(isPlaying) {
      this.isPlaying = isPlaying;
    },
    updateLyrics(lyrics) {
      this.lyrics = lyrics;
    },
    onWaiting() {
      this.audioLoading = true;
    },
    onCanPlay() {
      this.audioLoading = false;
    },
    switchBg(type) {
      this.currentBg = type;
      this.videosrc = type === 'red' ? '/red.mp4' : '/pink.mp4';
      // 切换后重新播放
      this.$nextTick(() => {
        const video = this.$refs.VdPlayer;
        if (video) {
          video.load();
          video.play();
          // 尝试取消静音
          video.muted = false;
          video.play().catch(() => {
            video.muted = true;
            const unmute = () => {
              video.muted = false;
              video.play();
              document.removeEventListener('click', unmute);
            };
            document.addEventListener('click', unmute, { once: true });
          });
        }
      });
    },
    expandSwitch() {
      this.isExpanded = true;
    },
    collapseSwitch() {
      this.isExpanded = false;
    },

    // 五彩纸屑效果
    startConfetti() {
      const colors = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#FF6BCD', '#FF9F43', '#A55EEA', '#FF6348'];
      const createPiece = () => {
        if (!document.querySelector('.vapp-fullscreen-background')) return;
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = Math.random() * 100 + '%';
        piece.style.top = '-20px';
        piece.style.width = (6 + Math.random() * 10) + 'px';
        piece.style.height = (6 + Math.random() * 10) + 'px';
        piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        piece.style.animationDuration = (3 + Math.random() * 5) + 's';
        piece.style.animationDelay = Math.random() * 0.5 + 's';
        document.body.appendChild(piece);
        setTimeout(() => piece.remove(), 6000);
      };
      this.confettiInterval = setInterval(() => {
        if (Math.random() < 0.3) createPiece();
      }, 800);
    },
  }
};
