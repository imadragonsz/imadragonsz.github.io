function populateWordList(data, scriptType) {
  const wordList = document.getElementById("wordList");
  wordList.innerHTML = ""; // Clear existing content

  data.forEach((word) => {
    const listItem = document.createElement("li");
    switch (scriptType) {
      case "romanji":
        listItem.textContent = `${word.romanji}: ${word.translation}`;
        break;
      case "katakana":
        listItem.textContent = `${word.katakana}: ${word.translation}`;
        break;
      case "hiragana":
        listItem.textContent = `${word.hiragana}: ${word.translation}`;
        break;
      default:
        break;
    }
    wordList.appendChild(listItem);
  });
}

document.getElementById("wordType").addEventListener("change", function () {
  const selectedType = this.value;
  fetch(`../words/${selectedType}.json`)
    .then((response) => response.json())
    .then((data) => {
      const scriptType = document.getElementById("scriptType").value;
      populateWordList(data, scriptType);
    });
});

document.getElementById("scriptType").addEventListener("change", function () {
  const selectedScript = this.value;
  const selectedType = document.getElementById("wordType").value;
  fetch(`../words/${selectedType}.json`)
    .then((response) => response.json())
    .then((data) => {
      populateWordList(data, selectedScript);
    });
});

// Initially populate word list with default selections
fetch("../words/easy.json")
  .then((response) => response.json())
  .then((data) => {
    const defaultScriptType = document.getElementById("scriptType").value;
    populateWordList(data, defaultScriptType);
  });
