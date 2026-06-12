const config = {
	// 网页元数据
	metaData: {
		title: '🎂 生日快乐 🎂',
		description: '一份特别的生日祝福，愿所有美好如期而至',
		keywords: '生日,祝福,生日快乐,生日网站,birthday',
		icon: '/favicon.ico'
	},

	avatar: "/img/avatar.svg", // 头像（可替换为寿星照片，放入 public/img/ 目录）
	welcometitle: "欢迎来到三帝网",

	// 颜色配置 - 生日暖色系
	color: {
		themecolor: "#FFE4D6",      // 主题色 - 暖粉白
		welcometitlecolor: "#FFD700", // 标题金色
		turntablecolor1: "#FF6B6B",   // 转盘色1 - 珊瑚红
		turntablecolor2: "#FFD93D"    // 转盘色2 - 金黄
	},

	brightness: 75,  // 背景亮度
	blur: 8,          // 毛玻璃模糊

	// 寿星标签
	tags: ['🎂 生日快乐', '🌟 万事如意', '💖 健康平安', '🎉 笑口常开', '🌈 前程似锦', '🎁 心想事成', '🌸 永远年轻', '✨ 幸福美满'],

	// 默认背景 - 使用用户的视频
	background: {
		"pc": {
			"type": "video",
			"datainfo": {
				"title": "生日视频背景",
				"preview": "",
				"url": "/69896b3a-21bb-45be-9649-355989c96231.mp4"
			},
		},
		"mobile": {
			"type": "video",
			"datainfo": {
				"title": "生日视频背景",
				"preview": "",
				"url": "/69896b3a-21bb-45be-9649-355989c96231.mp4"
			}
		}
	},

	// 幸福指数雷达图
	polarChart: {
		skills: ['快乐', '健康', '幸运', '爱情', '友情', '事业', '财富', '梦想'],
		skillPoints: [99, 95, 88, 92, 90, 85, 80, 96],
	},

	// 祝福分享按钮
	socialPlatformIcons: [
		{ icon: "mdi-heart", link: "#" },
		{ icon: "mdi-gift", link: "#" },
		{ icon: "mdi-cake-variant", link: "#" },
		{ icon: "mdi-party-popper", link: "#" },
		{ icon: "mdi-star", link: "#" },
		{ icon: "mdi-balloon", link: "#" }
	],

	// 打字机祝福语
	typeWriterStrings: [
		"🎂 生日快乐！愿你每一天都充满阳光与欢笑~",
		"🌟 愿所有的美好都如期而至，所有的幸运都不期而遇。",
		"💖 在这个特别的日子里，把最真挚的祝福送给你。",
		"🎉 愿你的生活如蛋糕般甜蜜，如烛光般温暖。",
		"🌸 岁月是一场有去无回的旅行，愿沿途的风景都美丽。",
		"✨ 愿你眼中有光，心中有爱，所到之处皆是温暖。"
	],

	// 生日歌单 - 网易云音乐
	musicPlayer: {
		server: 'netease',
		type: 'playlist',
		id: '7137638200'  // 生日快乐的歌单
	},

	// 备用壁纸数据
	wallpaper: {
		pic: [
			{ "title": "生日祝福1", "preview": "", "url": "/img/cards/e3a850b881313116bd6cb84816ae57fc.jpg" },
		],
		picMobile: [
			{ "title": "生日祝福", "preview": "", "url": "/img/cards/0376212bc45a1e612b6cfee0e8179178_720.jpg" },
		],
		video: [
			{
				"title": "生日视频背景",
				"preview": "",
				"url": "/69896b3a-21bb-45be-9649-355989c96231.mp4"
			},
		],
		videoMobile: [
			{
				"title": "生日视频背景",
				"preview": "",
				"url": "/69896b3a-21bb-45be-9649-355989c96231.mp4"
			},
		],
	},

	// 祝福卡片
	projectcards: [
		{ go: "🎁 打开", img: "/img/cards/30506b53445adcada83d0afe6af4a2c6_720.jpg", title: "生日祝福", subtitle: "最温暖的祝愿送给你", text: "愿你的每一天都像今天一样特别，充满惊喜和快乐。生日快乐！", url: "#", show: false },
		{ go: "🌸 打开", img: "/img/cards/37d0405b99ce318efc6791b2ea0ff89f_720.jpg", title: "美好祝愿", subtitle: "愿你被世界温柔以待", text: "希望你永远保持那颗纯真的心，勇敢追求自己的梦想。", url: "#", show: false },
		{ go: "✨ 打开", img: "/img/cards/66617823715dfe02a20116167ffddb39_720.jpg", title: "星光璀璨", subtitle: "你是最闪亮的那颗星", text: "在人生的舞台上，愿你永远是主角，闪闪发光，璀璨夺目。", url: "#", show: false },
		{ go: "💖 打开", img: "/img/cards/697eb877554189bb2ed56c3fabb77ccb.jpg", title: "甜蜜时光", subtitle: "珍藏每一刻美好", text: "时光匆匆，但美好的瞬间永远定格在心间。愿你岁岁平安。", url: "#", show: false },
		{ go: "🎂 打开", img: "/img/cards/717d5fff72b964ed5ebb2b9be904656f_720.jpg", title: "生日蛋糕", subtitle: "甜蜜的味道与你分享", text: "每一根蜡烛都代表一个心愿，愿它们都能一一实现。", url: "#", show: false },
		{ go: "🎉 打开", img: "/img/cards/bd5a9b45c2683cea4069cf3eb2c41424.jpg", title: "欢乐派对", subtitle: "今天只属于你", text: "放下所有烦恼，尽情享受属于你的这一天吧！你是最棒的！", url: "#", show: false },
		{ go: "🌈 打开", img: "https://api.ixiaowai.cn/gqapi/gqapi.php", title: "彩虹之约", subtitle: "风雨过后总有彩虹", text: "愿你的人生如彩虹般绚丽多彩，每一天都充满希望。", url: "#", show: false },
		{ go: "🎀 打开", img: "https://api.ixiaowai.cn/gqapi/gqapi.php", title: "礼物盒子", subtitle: "装满惊喜与感动", text: "最好的礼物不是物质的馈赠，而是此刻真心的祝福。", url: "#", show: false },
	],

	statement: ["Made with ❤️ for a special person", "Copyright © 2025 Birthday Wishes"],
}

export default config
