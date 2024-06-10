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

// Event listeners
checkBtn.addEventListener("click", checkAnswer);
revealBtn.addEventListener("click", revealAnswer);
skipBtn.addEventListener("click", skipQuestion);

// Fetch words from JSON file
function fetchWords(difficulty, format) {
  const url = `../words/${difficulty}.json`; // Construct URL based on difficulty
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

// Event listeners
checkBtn.addEventListener("click", checkAnswer);
revealBtn.addEventListener("click", revealAnswer);
skipBtn.addEventListener("click", skipQuestion);

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
  resultDisplay.textContent = `Correct Answer: ${words[randomWord].translation}`;
  resultDisplay.style.color = "blue";
  setTimeout(nextQuestion, 3000);
}

// Skip current question
function skipQuestion() {
  nextQuestion();
}

// Move to the next question
function nextQuestion() {
  displayQuestion();
}

// Initial load
fetchWords("easy", "romaji");
