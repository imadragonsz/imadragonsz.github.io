const answerInput = document.getElementById("answer");

document.addEventListener("DOMContentLoaded", function () {
  let currentQuestionIndex;
  let useHangul = true; // Default to Hangul

  let wordsArray = []; // To store the selected words array

  const commonWords = [];
  const kpopWords = []; // Assuming kpopWords array exists in the JSON data

  // Fetch the JSON data
  fetch("../words/korean/hangul explanation.json") // Adjusted the file name
    .then((response) => response.json())
    .then((data) => {
      // Extract commonWords and kpopWords from the JSON
      commonWords.push(...data.commonWords);
      kpopWords.push(...data.kpopWords); // Assuming kpopWords array exists in the JSON data
      startQuiz();
    })
    .catch((error) => console.error("Error fetching data:", error));

  function startQuiz() {
    setRandomQuestionIndex();
    showQuestion();
    document.getElementById("checkBtn").addEventListener("click", checkAnswer);
    document
      .getElementById("revealBtn")
      .addEventListener("click", revealAnswer);
    document.getElementById("skipBtn").addEventListener("click", skipQuestion);
    document.getElementById("format").addEventListener("change", startQuiz); // Start quiz when format changes
    document
      .getElementById("displayType")
      .addEventListener("change", toggleDisplay); // Change event listener for display type
    answerInput.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        checkAnswer();
      }
    });
  }

  function setRandomQuestionIndex() {
    // Select words array based on the selected option
    wordsArray =
      document.getElementById("format").value === "kpopWords"
        ? kpopWords
        : commonWords;
    currentQuestionIndex = Math.floor(Math.random() * wordsArray.length);
  }

  function showQuestion() {
    const questionElement = document.getElementById("question");
    if (
      wordsArray.length === 0 ||
      currentQuestionIndex < 0 ||
      currentQuestionIndex >= wordsArray.length ||
      !wordsArray[currentQuestionIndex]
    ) {
      console.error("Invalid question data.");
      return;
    }
    const word = useHangul
      ? wordsArray[currentQuestionIndex].romanji
      : wordsArray[currentQuestionIndex].hangul;
    questionElement.textContent = word;
  }

  function checkAnswer() {
    const userAnswer = document
      .getElementById("answer")
      .value.trim()
      .toLowerCase();

    if (
      wordsArray.length === 0 ||
      currentQuestionIndex < 0 ||
      currentQuestionIndex >= wordsArray.length ||
      !wordsArray[currentQuestionIndex]
    ) {
      console.error("Invalid question data.");
      return;
    }

    let correctAnswer = "";
    correctAnswer = wordsArray[currentQuestionIndex].translation
      .trim()
      .toLowerCase();
    if (userAnswer === correctAnswer) {
      document.getElementById("result").textContent = "Correct!";
      disableButtons();
      document.getElementById("answer").value = "";
      setTimeout(nextQuestion, 3000); // Move to the next question after 3 seconds
    } else {
      document.getElementById("result").textContent =
        "Incorrect. Try again, press reveal answer to see the answer or skip.";
    }
  }

  function revealAnswer() {
    answerInput.value = "";
    disableButtons();
    showCorrectAnswer();
    setTimeout(nextQuestion, 3000); // Move to the next question after 3 seconds
  }

  function skipQuestion() {
    answerInput.value = "";
    setRandomQuestionIndex(); // Set a new random question index
    showQuestion();
    document.getElementById("result").textContent = "";
    enableButtons();
  }

  function toggleLanguage() {
    useHangul = !useHangul;
    showQuestion();
  }

  function nextQuestion() {
    setRandomQuestionIndex();
    showQuestion();
    document.getElementById("result").textContent = "";
    enableButtons();
  }

  function toggleDisplay() {
    toggleLanguage();
    const displayType = document.getElementById("displayType").value;
    if (displayType === "romanji") {
      document.getElementById("question").textContent =
        wordsArray[currentQuestionIndex].romanji;
    } else {
      document.getElementById("question").textContent =
        wordsArray[currentQuestionIndex].hangul;
    }
  }

  function disableButtons() {
    document.getElementById("revealBtn").disabled = true;
    document.getElementById("checkBtn").disabled = true;
  }

  function enableButtons() {
    document.getElementById("revealBtn").disabled = false;
    document.getElementById("checkBtn").disabled = false;
  }

  function showCorrectAnswer() {
    const correctAnswer = wordsArray[currentQuestionIndex].translation
      .trim()
      .toLowerCase();

    // Display the correct answer
    document.getElementById("result").textContent =
      "The correct answer is: " + correctAnswer;
  }
});
