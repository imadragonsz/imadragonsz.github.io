let words;
let currentWordIndex;
let currentDifficulty;
let currentFormat;
let randomWord;

const difficultySelect = document.getElementById("difficulty");
const formatSelect = document.getElementById("format");
const questionDisplay = document.getElementById("question");
const answerInput = document.getElementById("answer");
const checkBtn = document.getElementById("checkBtn");
const revealBtn = document.getElementById("revealBtn");
const skipBtn = document.getElementById("skipBtn");
const resultDisplay = document.getElementById("result");

// Load words based on difficulty and format
difficultySelect.addEventListener("change", () => {
  currentDifficulty = difficultySelect.value;
  fetchWords(currentDifficulty, currentFormat);
});

formatSelect.addEventListener("change", () => {
  currentFormat = formatSelect.value;
  displayQuestion();
});

// Fetch words from JSON file
function fetchWords(difficulty, format) {
  const url = `../words/japanese/${difficulty}.json`; // Construct URL based on difficulty
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      words = data;
      currentFormat = formatSelect.value;
      startQuiz();
    })
    .catch((error) => {
      console.error("Error fetching words:", error);
    });
}

// Start quiz
function startQuiz() {
  displayQuestion();
}

// Display current question
function displayQuestion() {
  randomWord = Math.floor(Math.random() * words.length);
  const word = words[randomWord][currentFormat];
  questionDisplay.textContent = word;
  answerInput.value = "";
  resultDisplay.textContent = "";
}

// Event listener for the answer input field
answerInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    checkAnswer();
  }
});

// Check answer
function checkAnswer() {
  const userAnswer = answerInput.value.trim().toLowerCase();
  const correctAnswer = words[randomWord].translation.toLowerCase();
  if (userAnswer === correctAnswer) {
    resultDisplay.textContent = "Correct!";
    resultDisplay.style.color = "green";
    setTimeout(nextQuestion, 3000);
  } else {
    resultDisplay.textContent = "Incorrect. Try again.";
    resultDisplay.style.color = "red";
  }
}

// Reveal correct answer
function revealAnswer() {
  answerInput.value = "";
  disableButtons();
  resultDisplay.textContent = `Correct Answer: ${words[randomWord].translation}`;
  resultDisplay.style.color = "white";
  setTimeout(() => {
    nextQuestion();
    setTimeout(enableButtons, 3000);
  }, 3000);
}

// Skip current question
function skipQuestion() {
  nextQuestion();
}

// Move to the next question
function nextQuestion() {
  displayQuestion();
}

function disableButtons() {
  document.getElementById("revealBtn").disabled = true;
  document.getElementById("checkBtn").disabled = true;
}

function enableButtons() {
  document.getElementById("revealBtn").disabled = false;
  document.getElementById("checkBtn").disabled = false;
}

// Initial load
fetchWords("easy", "romaji");
