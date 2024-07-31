document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const restartBtn = document.getElementById('restart-btn');
    const hintBtn = document.getElementById('hint-btn');
    const difficultySelect = document.getElementById('difficulty-level');
    const flipSound = document.getElementById('flip-sound');
    const matchSound = document.getElementById('match-sound');
    const winSound = document.getElementById('win-sound');
    const icons = ['🍎', '🍌', '🍇', '🍉', '🍒', '🍓', '🍍', '🥝'];
    let cards = [];
    let flippedCards = [];
    let matchedCards = 0;
    let moves = 0;
    let timer;
    let timeElapsed = 0;
    let difficulty = 4;
    let hints = 3;
    let bestTime = localStorage.getItem('bestTime') || Infinity;
    let bestMoves = localStorage.getItem('bestMoves') || Infinity;

    const shuffle = (array) => {
      array.sort(() => Math.random() - 0.5);
    };

    const createCard = (icon) => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.innerHTML = `<div class="front">${icon}</div><div class="back"></div>`;
      card.addEventListener('click', () => flipCard(card, icon));
      return card;
    };

    const initializeGame = () => {
      gameBoard.innerHTML = '';
      cards = [];
      for (let i = 0; i < (difficulty * difficulty) / 2; i++) {
        cards.push(icons[i % icons.length]);
      }
      cards = [...cards, ...cards];
      shuffle(cards);
      cards.forEach(icon => gameBoard.appendChild(createCard(icon)));
      moves = 0;
      matchedCards = 0;
      timeElapsed = 0;
      hints = 3;
      document.getElementById('moves-count').textContent = `Moves: ${moves}`;
      document.getElementById('timer').textContent = `Time: 0s`;
      document.getElementById('hint-btn').textContent = `Hint (${hints})`;
      clearInterval(timer);
      startTimer();
    };

    const startTimer = () => {
      timer = setInterval(() => {
        timeElapsed++;
        document.getElementById('timer').textContent = `Time: ${timeElapsed}s`;
      }, 1000);
    };

    const stopTimer = () => {
      clearInterval(timer);
    };

    const playSound = (sound) => {
      sound.currentTime = 0;
      sound.play();
    };

    const flipCard = (card, icon) => {
      if (flippedCards.length < 2 && !card.classList.contains('flip') && !card.classList.contains('matched')) {
        card.classList.add('flip');
        flippedCards.push({ card, icon });
        playSound(flipSound);

        if (flippedCards.length === 2) {
          moves++;
          document.getElementById('moves-count').textContent = `Moves: ${moves}`;
          setTimeout(checkMatch, 1000);
        }
      }
    };

    const checkMatch = () => {
      const [firstCard, secondCard] = flippedCards;
      if (firstCard.icon === secondCard.icon) {
        firstCard.card.classList.add('matched');
        secondCard.card.classList.add('matched');
        matchedCards += 2;
        playSound(matchSound);
        if (matchedCards === cards.length) {
          stopTimer();
          setTimeout(() => {
            playSound(winSound);
            alert(`You win! Time: ${timeElapsed}s, Moves: ${moves}`);
            if (timeElapsed < bestTime) {
              bestTime = timeElapsed;
              localStorage.setItem('bestTime', bestTime);
            }
            if (moves < bestMoves) {
              bestMoves = moves;
              localStorage.setItem('bestMoves', bestMoves);
            }
          }, 500);
        }
      } else {
        firstCard.card.classList.remove('flip');
        secondCard.card.classList.remove('flip');
      }
      flippedCards = [];
    };

    const showHint = () => {
      if (hints > 0) {
        hints--;
        document.getElementById('hint-btn').textContent = `Hint (${hints})`;
        const unmatchedCards = Array.from(document.querySelectorAll('.card:not(.matched)'));
        unmatchedCards.forEach(card => card.classList.add('flip'));
        setTimeout(() => unmatchedCards.forEach(card => card.classList.remove('flip')), 1000);
      }
    };

    difficultySelect.addEventListener('change', (e) => {
      difficulty = parseInt(e.target.value, 10);
      initializeGame();
    });

    restartBtn.addEventListener('click', initializeGame);
    hintBtn.addEventListener('click', showHint);

    initializeGame();
  });