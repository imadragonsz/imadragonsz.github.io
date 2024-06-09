fetch("../words/hangul explanation.json")
  .then((response) => response.json())
  .then((data) => {
    const easyConsonants = document.getElementById("easyConsonants");
    const mediumConsonants = document.getElementById("mediumConsonants");
    const hardConsonants = document.getElementById("hardConsonants");
    const vowels = document.getElementById("vowels");
    const syllables = document.getElementById("syllables");
    const commonWords = document.getElementById("commonWords");
    console.log(data);

    data.easyConsonants.forEach((item) => {
      easyConsonants.innerHTML += `<div class="hangul-row"><span class="hangul">${item.hangul}</span> (${item.romanji}) </div>`;
    });

    data.mediumConsonants.forEach((item) => {
      mediumConsonants.innerHTML += `<div class="hangul-row"><span class="hangul">${item.hangul}</span> (${item.romanji}) </div>`;
    });

    data.hardConsonants.forEach((item) => {
      hardConsonants.innerHTML += `<div class="hangul-row"><span class="hangul">${item.hangul}</span> (${item.romanji}) </div>`;
    });

    data.vowels.forEach((item) => {
      vowels.innerHTML += `<div class="hangul-row"><span class="hangul">${item.hangul}</span> (${item.romanji}) </div>`;
    });

    data.syllables.forEach((item) => {
      syllables.innerHTML += `<div class="hangul-row"><span class="hangul">${item.hangul}</span> (${item.romanji}) </div>`;
    });

    data.commonWords.forEach((item) => {
      commonWords.innerHTML += `<div class="common-word"><span class="hangul">${item.hangul}</span> (${item.romanji}) - ${item.translation}</div>`;
    });

    data.kpopWords.forEach((item) => {
      kpopWords.innerHTML += `<div class="hangul-row"><span class="hangul">${item.hangul}</span> (${item.romanji}) - ${item.translation}</div>`;
    });
  })
  .catch((error) => console.error("Error fetching Hangul data:", error));
