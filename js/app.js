const texts = {
  labels: {
    score: 'უქლა',
    time: 'დრო',
    goal: 'მიზანი',
  },
  headings: {
    main: 'დაიჭირე ჩემი გული',
    resultWon: 'შენ გეკუთვნის ჩემი გული!',
    resultLost: 'ცოტაც ცუცქნი!',
  },
  buttons: {
    start: 'დაიწყე',
    reset: 'დარესეტება',
    playAgain: 'თავიდან, მიდი გოგოო!!',
  },
  messages: {
    initial: 'როცა მზად იქნები შებერე',
    go: 'მიდი! დააჭირე ყველა გულს რასაც ხედავ 💕',
    nice: 'კაია გააგრძელე 👹',
    goalReached: 'ოპააა!',
    missionComplete: 'მისია შესრულებულია 💖✨✨✨',
    soClose: 'ცოტაც არ დანებდე !! 💞',
  },
  description: 'დრეზე მიაჭირე',
  hint: '',
  emojis: {
    result: '💘',
    win: '💌',
    lose: '🥹',
    heart: '💖',
    heartAlt: '💝',
  },
  fun: [
    { text: 'ოპაა' },
    { text: 'მოდი აბა' },
    { text: 'ჰიჰიიი' },
    { text: 'ლალალა' },
    { text: 'აბა დამიჭირე' },
    { text: 'პუსი ეს' },
    { text: 'სუსტი ხარ' },
    { text: '🤪' },
    { text: 'მოზლოზინი' },
  ],
  resultText: {
    won: 'სწრაფი თითები გქონია 😏🌹',
    lost: 'კიდე აცაცუნე თითები',
  },
};

function setText(element, text) {
  if (element) {
    element.textContent = text;
    element.innerText = text;
  }
}

function initTexts() {
  setText(document.getElementById('scoreLabel'), texts.labels.score);
  setText(document.getElementById('timeLabel'), texts.labels.time);
  setText(document.getElementById('goalLabel'), texts.labels.goal);
  setText(document.getElementById('mainHeading'), texts.headings.main);
  setText(document.getElementById('gameDescription'), texts.description);
  setText(document.getElementById('startBtn'), texts.buttons.start);
  setText(document.getElementById('resetBtn'), texts.buttons.reset);
  setText(document.getElementById('playAgainBtn'), texts.buttons.playAgain);
  setText(document.getElementById('message'), texts.messages.initial);
  setText(document.getElementById('hintText'), texts.hint);
  setText(document.getElementById('resultEmoji'), texts.emojis.result);
  setText(document.getElementById('resultTitle'), texts.headings.resultWon);
  setText(document.getElementById('resultText'), texts.resultText.won);
}

const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('time');
const goalEl = document.getElementById('goal');
const gameArea = document.getElementById('gameArea');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const messageEl = document.getElementById('message');
const overlay = document.getElementById('overlay');
const resultTitle = document.getElementById('resultTitle');
const resultText = document.getElementById('resultText');
const resultEmoji = document.getElementById('resultEmoji');
const playAgainBtn = document.getElementById('playAgainBtn');
const goal = 15;
const duration = 20;
goalEl.textContent = goal;
let score = 0;
let timeLeft = duration;
let gameRunning = false;
let timerId = null;
let spawnId = null;
let activeHeart = null;
let activeTooltip = null;

function updateStats() {
  setText(scoreEl, score);
  setText(timeEl, timeLeft);
}

function clearHeart() {
  if (activeHeart) {
    activeHeart.remove();
    activeHeart = null;
  }
  if (activeTooltip) {
    activeTooltip.remove();
    activeTooltip = null;
  }
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomFunText() {
  const index = Math.floor(Math.random() * texts.fun.length);
  return texts.fun[index].text;
}

function spawnHeart() {
  clearHeart();
  if (!gameRunning) return;
  const heart = document.createElement('button');
  heart.className = 'heart';
  heart.type = 'button';
  heart.setAttribute('aria-label', 'Heart to click');
  heart.textContent = Math.random() > 0.18 ? texts.emojis.heart : texts.emojis.heartAlt;
  const areaRect = gameArea.getBoundingClientRect();
  const size = 58;
  const left = randomBetween(8, Math.max(9, areaRect.width - size - 8));
  const top = randomBetween(8, Math.max(9, areaRect.height - size - 8));
  heart.style.left = left + 'px';
  heart.style.top = top + 'px';
  // Show heart in UI immediately after positioning
  gameArea.appendChild(heart);

  // Create and show tooltip using helper
  activeTooltip = createTooltip(left, top);

  heart.addEventListener('click', (e) => {
    if (!gameRunning) return;
    clearHeart();
    score += 1;
    updateStats();
    setText(messageEl, score < goal ? texts.messages.nice : texts.messages.goalReached);
    createFloatingScore(e.clientX, e.clientY, '+1');
    createSparkles(left + 28, top + 28);
    if (score >= goal) {
      endGame(true);
      return;
    }
    spawnHeart();
  });
  activeHeart = heart;
}

function createTooltip(left, top) {
  // Create tooltip element
  const tooltip = document.createElement('div');
  tooltip.className = 'heart-tooltip';
  tooltip.textContent = getRandomFunText();
  // Append to measure size
  gameArea.appendChild(tooltip);
  const tooltipWidth = tooltip.offsetWidth;
  const tooltipHeight = tooltip.offsetHeight;
  const areaWidth = gameArea.clientWidth;
  const areaHeight = gameArea.clientHeight;
  let tooltipLeft = left + 20;
  let tooltipTop = top - 10;
  // Adjust to stay within game area bounds
  if (tooltipLeft + tooltipWidth > areaWidth) {
    tooltipLeft = areaWidth - tooltipWidth - 8;
  }
  if (tooltipLeft < 8) {
    tooltipLeft = 8;
  }
  if (tooltipTop < 8) {
    tooltipTop = top + 58 + 8;
  }
  if (tooltipTop + tooltipHeight > areaHeight) {
    tooltipTop = areaHeight - tooltipHeight - 8;
  }
  tooltip.style.left = tooltipLeft + 'px';
  tooltip.style.top = tooltipTop + 'px';
  return tooltip;
}

function createFloatingScore(x, y, text) {
  const node = document.createElement('div');
  node.className = 'floating';
  node.textContent = text;
  node.style.left = x - 10 + 'px';
  node.style.top = y - 12 + 'px';
  document.body.appendChild(node);
  setTimeout(() => node.remove(), 700);
}

function createSparkles(x, y) {
  for (let i = 0; i < 6; i++) {
    const s = document.createElement('div');
    s.className = 'sparkle';
    s.style.left = x + 'px';
    s.style.top = y + 'px';
    s.style.setProperty('--x', randomBetween(-40, 40) + 'px');
    s.style.setProperty('--y', randomBetween(-40, 18) + 'px');
    gameArea.appendChild(s);
    setTimeout(() => s.remove(), 600);
  }
}

function tick() {
  timeLeft -= 1;
  updateStats();
  if (timeLeft <= 0) {
    endGame(score >= goal);
  }
}

function startGame() {
  score = 0;
  timeLeft = duration;
  gameRunning = true;
  overlay.classList.remove('show');
  updateStats();
  setText(messageEl, texts.messages.go);
  clearInterval(timerId);
  clearInterval(spawnId);
  clearHeart();
  spawnHeart();
  timerId = setInterval(tick, 1000);
  spawnId = setInterval(() => {
    if (gameRunning) spawnHeart();
  }, 900);
}

function endGame(won) {
  gameRunning = false;
  clearInterval(timerId);
  clearInterval(spawnId);
  clearHeart();
  if (won) {
    setText(resultEmoji, texts.emojis.win);
    setText(resultTitle, texts.headings.resultWon);
    setText(resultText, texts.resultText.won);
    setText(messageEl, texts.messages.missionComplete);
  } else {
    setText(resultEmoji, texts.emojis.lose);
    setText(resultTitle, texts.headings.resultLost);
    setText(resultText, texts.resultText.lost.replace('{score}', score));
    setText(messageEl, texts.messages.soClose);
  }
  overlay.classList.add('show');
}

function resetGame() {
  gameRunning = false;
  clearInterval(timerId);
  clearInterval(spawnId);
  clearHeart();
  score = 0;
  timeLeft = duration;
  updateStats();
  overlay.classList.remove('show');
  setText(messageEl, texts.messages.initial);
  Array.from(document.querySelectorAll('.sparkle, .floating')).forEach((el) => el.remove());
}

document.addEventListener('DOMContentLoaded', () => {
  initTexts();
  updateStats();
});

startBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', resetGame);
playAgainBtn.addEventListener('click', startGame);
