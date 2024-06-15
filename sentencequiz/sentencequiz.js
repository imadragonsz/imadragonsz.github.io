let sentences;
let currentSentenceIndex;
let currentFormat;
let randomSentence;

const formatSelect = document.getElementById("format");
const questionDisplay = document.getElementById("question");
const answerInput = document.getElementById("answer");
const checkBtn = document.getElementById("checkBtn");
const revealBtn = document.getElementById("revealBtn");
const skipBtn = document.getElementById("skipBtn");
const resultDisplay = document.getElementById("result");

// Load sentences based on format
formatSelect.addEventListener("change", () => {
  currentFormat = formatSelect.value;
  displayQuestion();
});

// Fetch sentences from JSON file
function fetchSentences(format) {
  const url = "../words/japanese/sentences.json"; // Adjust the path accordingly
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      sentences = data;
      currentFormat = formatSelect.value;
      startQuiz();
    })
    .catch((error) => {
      console.error("Error fetching sentences:", error);
    });
}

// Start quiz
function startQuiz() {
  displayQuestion();
}

// Display current question
function displayQuestion() {
  randomSentence = Math.floor(Math.random() * sentences.length);
  const sentence = sentences[randomSentence][currentFormat];
  questionDisplay.textContent = sentence;
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
  const correctAnswer = sentences[randomSentence].translation.toLowerCase();
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
  disableButtons();
  resultDisplay.textContent = `Correct Answer: ${sentences[randomSentence].translation}`;
  resultDisplay.style.color = "white";
  setTimeout(() => {
    nextQuestion();
    enableButtons();
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

//functions to disable and enable the buttons
function disableButtons() {
  document.getElementById("revealBtn").disabled = true;
  document.getElementById("checkBtn").disabled = true;
}

function enableButtons() {
  document.getElementById("revealBtn").disabled = false;
  document.getElementById("checkBtn").disabled = false;
}

// Initial load
fetchSentences("romanji");
