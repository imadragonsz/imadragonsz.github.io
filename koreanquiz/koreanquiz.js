let currentCharacter = {};
let characters = [];

document.addEventListener("DOMContentLoaded", function () {
  fetch("../words/hangul.json")
    .then((response) => response.json())
    .then((data) => {
      document
        .getElementById("difficultyLevel")
        .addEventListener("change", () => startQuiz(data));
      startQuiz(data); // Initialize quiz on page load with default difficulty level
    });
});

function startQuiz(data) {
  const difficultyLevel = document.getElementById("difficultyLevel").value;
  characters = chooseDifficulty(data, difficultyLevel);
  document.getElementById("quizContainer").classList.remove("hidden");
  nextCharacter();
}

function chooseDifficulty(data, difficultyLevel) {
  switch (difficultyLevel) {
    case "easy":
      return data.easy.slice();
    case "medium":
      return data.medium.slice();
    case "hard":
      return data.hard.slice();
    default:
      return data.easy.slice();
  }
}

function nextCharacter() {
  const randomCharacter = Math.floor(Math.random() * characters.length);
  currentCharacter = characters[randomCharacter];
  document.getElementById("koreanCharacter").innerText =
    currentCharacter.hangul;
  document.getElementById("romajiInput").value = "";
  document.getElementById("resultMessage").innerText = "";
}

function checkAnswer(event) {
  if (event.key === "Enter") {
    const userInput = document
      .getElementById("romajiInput")
      .value.trim()
      .toLowerCase();
    if (userInput === currentCharacter.romaji) {
      document.getElementById("resultMessage").innerText = "Correct!";
      document.getElementById("resultMessage").classList.add("correct");
      setTimeout(nextCharacter, 3000);
    } else {
      document.getElementById("resultMessage").innerText = "Try again!";
      document.getElementById("resultMessage").classList.remove("correct");
    }
    event.preventDefault();
  }
}

function revealAnswer() {
  document.getElementById("resultMessage").innerText = currentCharacter.romaji;
  setTimeout(nextCharacter, 3000);
}

function skipQuestion() {
  nextCharacter();
}

document.getElementById("romajiInput").addEventListener("keydown", checkAnswer);
