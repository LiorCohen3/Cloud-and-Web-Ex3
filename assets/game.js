// Get the relevant elements from the HTML document
const sideBox = document.querySelector('.side_box');
const leftBar = document.querySelector('.left_bar');
const rightBar = document.querySelector('.right_bar');
const contentWrap = document.querySelector('.content_wrap');
const restartButton = document.querySelector('.restart');
const playButton = document.querySelector('.play');
const minWidthForDesktop = 768;

// Initialize the width of the first box to be added
let boxSize = 80;
let clicked = 0;
let play = false;

// Define an array of letters to use for the game
const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

// Shuffle the letters array
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Add an event listener to the restart button
restartButton.addEventListener('click', reset);
function reset() {
  // Remove all boxes from the content wrap
  while (contentWrap.firstChild) {
    contentWrap.removeChild(contentWrap.firstChild);
  }

  // Reset the box size and update the bar heights
  boxSize = 80;
  if (window.innerWidth >= minWidthForDesktop) {
    rightBar.style.height = `${contentWrap.offsetHeight}px`;
    leftBar.style.height = `${contentWrap.offsetHeight}px`;
  }
  clicked = 0;
  play = false;
};

// Add an event listener to the play button
playButton.addEventListener('click', () => {
  if (play == false && clicked == 0)
  {
    // Display a bubble message on top of the side box
    const bubbleMessage = document.createElement('div');
    bubbleMessage.classList.add('bubble_message');
    bubbleMessage.innerText = 'To start playing first add some boxes';
    sideBox.appendChild(bubbleMessage);

    // Hide the bubble message after 3 seconds
    setTimeout(() => {
      sideBox.removeChild(bubbleMessage);
    }, 3000);
    return;
  }

  if (play == false && clicked != 0)
  {
    play = true;
    // Shuffle the letters array
    shuffle(letters);
    let usedLettersTemp = [];
    for (let i = 0; i < clicked; i++)
    {
      usedLettersTemp.push(letters[i]);
    }
    usedLetters = [...usedLettersTemp,...usedLettersTemp];
    shuffle(usedLetters);

    // Loop over each box in the content wrap and add an event listener and a letter
    const boxes = document.querySelectorAll('.content_wrap > div');
    for (let i = 0; i < boxes.length; i++) {
      boxes[i].innerHTML = '<span class="letter" style="display: none">' + usedLetters[i] + '</span>';      boxes[i].style.fontSize = '40px';
      boxes[i].style.color = 'white';
      boxes[i].style.display = 'flex';
      boxes[i].style.alignItems = 'center';
      boxes[i].style.justifyContent = 'center';
      boxes[i].style.cursor = 'pointer';
      boxes[i].addEventListener('click', boxClick);
    }
  }
});

// Handle box clicks
let firstBox = null;
let secondBox = null;

function boxClick(event) {
  // Only respond to clicks on boxes that haven't already been revealed
  if (event.target.classList.contains('revealed')) {
    return;
  }

  // Reveal the letter in the clicked box
  event.target.querySelector('.letter').style.display = 'flex';
  event.target.classList.add('revealed');

  // If this is the first box clicked, save it and return
  if (!firstBox) {
    firstBox = event.target;
    return;
  }

  // Otherwise, save the second box clicked and check for a match
  secondBox = event.target;
  if (firstBox.innerHTML === secondBox.innerHTML) {
    // If the boxes match, change their color and mark them as revealed
    firstBox.style.backgroundColor = 'teal';
    secondBox.style.backgroundColor = 'teal';
    firstBox = null;
    secondBox = null;
    checkWin();
  } else {
    // If the boxes don't match, hide their letters after a short delay
    setTimeout(() => {
      firstBox.querySelector('.letter').style.display = 'none';
      secondBox.querySelector('.letter').style.display = 'none';
      firstBox.classList.remove('revealed');
      secondBox.classList.remove('revealed');
      firstBox = null;
      secondBox = null;
    }, 1000);
  }
}

function checkWin() {
  const boxes = document.querySelectorAll('.content_wrap > div');
  let allTeal = true;
  boxes.forEach(box => {
    if (box.style.backgroundColor !== 'teal') {
      allTeal = false;
    }
  });
  if (allTeal) {
    // Display "You Win!" lightbox
    const lightbox = document.createElement('div');
    lightbox.classList.add('lightbox');
    const message = document.createElement('div');
    message.innerText = 'You Win!';
    message.style.display = 'flex';
    message.style.flexDirection = 'column'
    message.style.alignItems = 'center'
    const restart2 = restartButton.cloneNode(true);
    restart2.style.padding = '0px 0px';
    restart2.style.backgroundColor = 'transparent';
    restart2.addEventListener('click', resetLightBox)
    lightbox.appendChild(message);
    message.appendChild(restart2);
    document.body.appendChild(lightbox);
  }
}

function resetLightBox() {
  reset();
  const lightbox = document.querySelector('.lightbox');
  document.body.removeChild(lightbox);
}

// Add an event listener to the side box element
sideBox.addEventListener('click', () => {
  if (play == false)
  {
    // Create two new div elements to represent the black boxes
      const box1 = document.createElement('div');
      const box2 = document.createElement('div');

    // Set the background color and dimensions of the boxes
      box1.style.backgroundColor = 'black';
      box2.style.backgroundColor = 'black';
      box1.style.width = `${boxSize}px`;
      box1.style.height = `${boxSize}px`;

    // Increase the width for the next box to be added
      boxSize += 20;

      box2.style.width = `${boxSize}px`;
      box2.style.height = `${boxSize}px`;

    // Add the boxes to the content wrap element
      contentWrap.appendChild(box1);
      contentWrap.appendChild(box2);

    // Increase the width for the next box to be added
      boxSize += 20;
      if (window.innerWidth >= minWidthForDesktop) {
        rightBar.style.height = `${contentWrap.offsetHeight}px`;
        leftBar.style.height = `${contentWrap.offsetHeight}px`;
      }
      clicked += 1;
  }
});
