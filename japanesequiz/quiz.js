const hiraganaEasy = [
  { hiragana: "あ", romaji: "a" },
  { hiragana: "い", romaji: "i" },
  { hiragana: "う", romaji: "u" },
  { hiragana: "え", romaji: "e" },
  { hiragana: "お", romaji: "o" },
  { hiragana: "ん", romaji: "n" },
  { hiragana: "か", romaji: "ka" },
  { hiragana: "き", romaji: "ki" },
  { hiragana: "く", romaji: "ku" },
  { hiragana: "け", romaji: "ke" },
  { hiragana: "こ", romaji: "ko" },
  { hiragana: "さ", romaji: "sa" },
  { hiragana: "し", romaji: "shi" },
  { hiragana: "す", romaji: "su" },
  { hiragana: "せ", romaji: "se" },
  { hiragana: "そ", romaji: "so" },
];

const hiraganaMedium = [
  { hiragana: "た", romaji: "ta" },
  { hiragana: "ち", romaji: "chi" },
  { hiragana: "つ", romaji: "tsu" },
  { hiragana: "て", romaji: "te" },
  { hiragana: "と", romaji: "to" },
  { hiragana: "な", romaji: "na" },
  { hiragana: "に", romaji: "ni" },
  { hiragana: "ぬ", romaji: "nu" },
  { hiragana: "ね", romaji: "ne" },
  { hiragana: "の", romaji: "no" },
  { hiragana: "は", romaji: "ha" },
  { hiragana: "ひ", romaji: "hi" },
  { hiragana: "ふ", romaji: "fu" },
  { hiragana: "へ", romaji: "he" },
  { hiragana: "ほ", romaji: "ho" },
];

const hiraganaHard = [
  { hiragana: "ま", romaji: "ma" },
  { hiragana: "み", romaji: "mi" },
  { hiragana: "む", romaji: "mu" },
  { hiragana: "め", romaji: "me" },
  { hiragana: "も", romaji: "mo" },
  { hiragana: "や", romaji: "ya" },
  { hiragana: "ゆ", romaji: "yu" },
  { hiragana: "よ", romaji: "yo" },
  { hiragana: "ら", romaji: "ra" },
  { hiragana: "り", romaji: "ri" },
  { hiragana: "る", romaji: "ru" },
  { hiragana: "れ", romaji: "re" },
  { hiragana: "ろ", romaji: "ro" },
  { hiragana: "わ", romaji: "wa" },
];

const katakanaEasy = [
  { katakana: "ア", romaji: "a" },
  { katakana: "イ", romaji: "i" },
  { katakana: "ウ", romaji: "u" },
  { katakana: "エ", romaji: "e" },
  { katakana: "オ", romaji: "o" },
  { katakana: "ン", romaji: "n" },
  { katakana: "カ", romaji: "ka" },
  { katakana: "キ", romaji: "ki" },
  { katakana: "ク", romaji: "ku" },
  { katakana: "ケ", romaji: "ke" },
  { katakana: "コ", romaji: "ko" },
  { katakana: "サ", romaji: "sa" },
  { katakana: "シ", romaji: "shi" },
  { katakana: "ス", romaji: "su" },
  { katakana: "セ", romaji: "se" },
  { katakana: "ソ", romaji: "so" },
];

const katakanaMedium = [
  { katakana: "タ", romaji: "ta" },
  { katakana: "チ", romaji: "chi" },
  { katakana: "ツ", romaji: "tsu" },
  { katakana: "テ", romaji: "te" },
  { katakana: "ト", romaji: "to" },
  { katakana: "ナ", romaji: "na" },
  { katakana: "ニ", romaji: "ni" },
  { katakana: "ヌ", romaji: "nu" },
  { katakana: "ネ", romaji: "ne" },
  { katakana: "ノ", romaji: "no" },
  { katakana: "ハ", romaji: "ha" },
  { katakana: "ヒ", romaji: "hi" },
  { katakana: "フ", romaji: "fu" },
  { katakana: "ヘ", romaji: "he" },
  { katakana: "ホ", romaji: "ho" },
];

const katakanaHard = [
  { katakana: "マ", romaji: "ma" },
  { katakana: "ミ", romaji: "mi" },
  { katakana: "ム", romaji: "mu" },
  { katakana: "メ", romaji: "me" },
  { katakana: "モ", romaji: "mo" },
  { katakana: "ヤ", romaji: "ya" },
  { katakana: "ユ", romaji: "yu" },
  { katakana: "ヨ", romaji: "yo" },
  { katakana: "ラ", romaji: "ra" },
  { katakana: "リ", romaji: "ri" },
  { katakana: "ル", romaji: "ru" },
  { katakana: "レ", romaji: "re" },
  { katakana: "ロ", romaji: "ro" },
  { katakana: "ワ", romaji: "wa" },
];

let currentCharacter = {};
let currentCharacterIndex = -1;
let characters = [];

function startQuiz() {
  const quizType = document.getElementById("quizType").value;
  const difficultyLevel = document.getElementById("difficultyLevel").value;

  // Choose characters based on the selected type
  characters =
    quizType === "hiragana"
      ? chooseDifficulty(
          hiraganaEasy,
          hiraganaMedium,
          hiraganaHard,
          difficultyLevel
        )
      : chooseDifficulty(
          katakanaEasy,
          katakanaMedium,
          katakanaHard,
          difficultyLevel
        );

  document.getElementById("quizContainer").classList.remove("hidden");
  nextCharacter();
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("quizType").addEventListener("change", startQuiz);
  document
    .getElementById("difficultyLevel")
    .addEventListener("change", startQuiz);
});

function chooseDifficulty(easyArray, mediumArray, hardArray, difficultyLevel) {
  switch (difficultyLevel) {
    case "easy":
      return easyArray.slice(); // No need to slice as we're not modifying the original array
    case "medium":
      return mediumArray.slice(); // No need to slice as we're not modifying the original array
    case "hard":
      return hardArray.slice(); // No need to slice as we're not modifying the original array
    default:
      return easyArray.slice(); // Default to easy level
  }
}

function nextCharacter() {
  const randomCharacter = Math.floor(Math.random() * characters.length);
  currentCharacter = characters[randomCharacter];
  document.getElementById("japaneseCharacter").innerText =
    currentCharacter.hiragana || currentCharacter.katakana;
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
    event.preventDefault(); // Prevents a new line from being added in the input
  }
}

function revealAnswer() {
  disableButtons();
  document.getElementById("resultMessage").innerText = currentCharacter.romaji;
  setTimeout(() => {
    nextCharacter();
    enableButtons();
  }, 3000);
}

//functions to disable and enable the buttons
function disableButtons() {
  document.getElementById("revealBtn").disabled = true;
  document.getElementById("skipBtn").disabled = true;
}

function enableButtons() {
  document.getElementById("revealBtn").disabled = false;
  document.getElementById("skipBtn").disabled = false;
}

function skipQuestion() {
  nextCharacter();
}
