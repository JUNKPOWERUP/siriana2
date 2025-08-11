let level = 1;
let bgmPlaying = true;

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function startGame() {
  level = 1;
  showScreen('game');
  renderLevel();
}

function renderLevel() {
  document.getElementById('level-text').textContent = `レベル ${level}`;
  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  const { base, diff } = getColors(level);
  const correctIndex = Math.floor(Math.random() * 9);
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.style.background = (i === correctIndex) ? diff : base;
    cell.onclick = () => handleClick(i === correctIndex);
    grid.appendChild(cell);
  }
}

// 色をより多様に変化させる関数
function getColors(level) {
  // ベース色をランダムに作成
  const baseR = Math.floor(Math.random() * 256);
  const baseG = Math.floor(Math.random() * 256);
  const baseB = Math.floor(Math.random() * 256);

  // RGB→HSLに変換
  let [h, s, l] = rgbToHsl(baseR, baseG, baseB);

  // 差の大きさ（レベルが上がるほど小さく）
  const diffValue = Math.max(1, 30 - level * 0.25);

  // 色相・彩度・明度のどれを変えるかランダムで選択
  const mode = Math.floor(Math.random() * 3);
  if (mode === 0) {
    h = (h + diffValue) % 360; // 色相を変える
  } else if (mode === 1) {
    s = Math.min(100, Math.max(0, s + diffValue)); // 彩度を変える
  } else {
    l = Math.min(100, Math.max(0, l + diffValue)); // 明度を変える
  }

  // HSL→RGBに戻す
  const [diffR, diffG, diffB] = hslToRgb(h, s, l);

  return {
    base: `rgb(${baseR}, ${baseG}, ${baseB})`,
    diff: `rgb(${diffR}, ${diffG}, ${diffB})`
  };
}

// RGB→HSL変換
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)); break;
      case g: h = ((b - r) / d + 2); break;
      case b: h = ((r - g) / d + 4); break;
    }
    h *= 60;
  }
  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
}

// HSL→RGB変換
function hslToRgb(h, s, l) {
  s /= 100; l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r, g, b;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255)
  ];
}

function handleClick(correct) {
  if (correct) {
    document.getElementById('correct-sound').play();
    if (level >= 100) {
      endGame(true);
    } else {
      level++;
      renderLevel();
    }
  } else {
    document.getElementById('wrong-sound').play();
    endGame(false);
  }
}

function endGame(cleared) {
  showScreen('result');
  document.getElementById('result-message').textContent =
    cleared ? 'レベル100達成！するとは…お察しシマス！！' : `残念です…！レベル${level}で終了でした`;
}

function toggleBgm() {
  const audio = document.getElementById('bgm');
  if (bgmPlaying) {
    audio.pause();
    bgmPlaying = false;
    document.getElementById('bgm-status').textContent = 'OFF';
  } else {
    audio.play();
    bgmPlaying = true;
    document.getElementById('bgm-status').textContent = 'ON';
  }
}

window.addEventListener('load', () => {
  const audio = document.getElementById('bgm');
  audio.volume = 0.5;
  audio.play().catch(() => {
    bgmPlaying = false;
    document.getElementById('bgm-status').textContent = 'OFF';
  });
});
