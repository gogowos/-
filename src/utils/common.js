export function setMeta(title, description, keywords, icon) {
  document.title = title;
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', description);
  }
  const metaKeywords = document.querySelector('meta[name="keywords"]');
  if (metaKeywords) {
    metaKeywords.setAttribute('content', keywords);
  }
  const webico = document.querySelector('link[rel="icon"]');
  if (webico) {
    webico.href = icon;
  }
}

export function getFormattedTime(currentDate) {
  return currentDate.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).replace(/:/g, ' : ');
}

export function getFormattedDate(currentDate) {
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const weekday = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][currentDate.getDay()];
  return `${year} 年 ${month} 月 ${day} 日 ${weekday}`;
}

export function dataConsole() {
  console.log(`%c
  🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂
  🎂  生 日 快 乐 ！        🎂
  🎂  Happy Birthday!      🎂
  🎂  愿所有美好如期而至    🎂
  🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂
`, 'color: #FFD700; font-size: 16px;');
}
