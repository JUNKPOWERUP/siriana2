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

function getColors(level) {
  const baseR = Math.floor(Math.random() * 256);
  const baseG = Math.floor(Math.random() * 256);
  const baseB = Math.floor(Math.random() * 256);
  const diffValue = Math.max(5, 80 - level);
  const diffR = Math.min(255, baseR + diffValue);
  const diffG = Math.min(255, baseG + diffValue);
  const diffB = Math.min(255, baseB + diffValue);
  return {
    base: `rgb(${baseR}, ${baseG}, ${baseB})`,
    diff: `rgb(${diffR}, ${diffG}, ${diffB})`
  };
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
