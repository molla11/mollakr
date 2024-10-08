const readEls = {
  dayIndex: document.getElementById("read-day-index"),
  index: document.getElementById("read-index"),
  indexInSelected: document.getElementById("read-index-in-selected"),
  indexInSelectedText: document.getElementById("read-index-in-selected-text"),
  indexInSelectedChange: document.getElementById(
    "read-index-in-selected-change"
  ),
  word: document.getElementById("read-word"),
  means: document.getElementById("read-means"),
};

function showWord(idx) {
  const wordObj = wordMap.get(wordIndices[idx][0]).get(wordIndices[idx][1]);
  readEls.dayIndex.innerText = `Day ${wordObj.day}`;
  readEls.index.innerText = `No. ${wordObj.id}`;
  readEls.indexInSelectedText.innerText = `${idx + 1} / ${wordIndices.length}`;
  readEls.indexInSelectedChange.value = (idx + 1).toString();

  remove_child(readEls.word);
  const wordLink = document.createElement("a");
  wordLink.href = `https://en.dict.naver.com/#/search?query=${wordObj.word}`;
  wordLink.innerText = wordObj.word;
  wordLink.target = "_blank";
  readEls.word.appendChild(wordLink);

  remove_child(readEls.means);
  if (set.read.displayMeans) {
    for (const meaningsObj of wordObj.meanings) {
      const partofMeaningEl = document.createElement("div");
      partofMeaningEl.id = `read-part-${meaningsObj.speechPart}`;
      partofMeaningEl.className = "read-means-container";

      const speechPartContEl = document.createElement("span");
      speechPartContEl.className = "read-part-of-speech";

      const speechPartTextEl = document.createElement("span");
      speechPartTextEl.className = "read-part-text";
      speechPartTextEl.innerText = meaningsObj.speechPart;

      speechPartContEl.appendChild(speechPartTextEl);
      partofMeaningEl.appendChild(speechPartContEl);

      for (const meaningIdx in meaningsObj.definitions) {
        const meanEl = document.createElement("span");
        meanEl.id = `read-${meaningsObj.definitions[meaningIdx]}-mean${
          parseInt(meaningIdx) + 1
        }`;
        meanEl.className = `read-mean`;

        const meanLink = document.createElement("a");
        meanLink.href = `https://ko.dict.naver.com/#/search?query=${meaningsObj.definitions[meaningIdx]}`;
        meanLink.target = "_blank";
        meanLink.innerText = meaningsObj.definitions[meaningIdx];

        meanEl.appendChild(meanLink);
        partofMeaningEl.appendChild(meanEl);
      }

      readEls.means.appendChild(partofMeaningEl);
    }
  }
}

function remove_child(parentEl) {
  while (parentEl.firstChild) {
    parentEl.removeChild(parentEl.firstChild);
  }
}

function toggleHideMeans() {
  set.read.displayMeans = !set.read.displayMeans;
  if (set.read.displayMeans) {
    hideMeansImgEl.src = "img/show.png";
    notice("뜻을 보입니다.");
  } else {
    hideMeansImgEl.src = "img/hide.png";
    notice("뜻을 숨깁니다.");
  }
  showWord(idxofWords);
}

const hideMeansEl = document.getElementById("read-set-hide-means");

hideMeansEl.addEventListener("click", () => {
  toggleHideMeans();
});

const skipToPreviousEl = document.getElementById("read-skipping-previous");
const skipToNextEl = document.getElementById("read-skipping-next");

skipToPreviousEl.addEventListener("click", () => {
  skipToPrevious();
});

skipToNextEl.addEventListener("click", () => {
  skipToNext();
});

const setShuffleEl = document.getElementById("read-set-shuffle");
const setShuffleImgEl = document.querySelector("#read-set-shuffle img");

setShuffleEl.addEventListener("click", () => {
  toggleShuffleIndices();
});

readEls.indexInSelected.addEventListener("mouseenter", () => {
  setTimeout(() => {
    readEls.indexInSelectedChange.focus();
  }, 201);
});

readEls.indexInSelected.addEventListener("mouseleave", () => {
  readEls.indexInSelectedChange.blur();
  readEls.indexInSelectedChange.value = (idxofWords + 1).toString();
});

readEls.indexInSelectedChange.addEventListener("input", () => {
  const inputValue = readEls.indexInSelectedChange.value.replaceAll(" ", "");
  const numValue = parseInt(inputValue);
  if (inputValue == "" || inputValue == null || inputValue == undefined) {
    notice("값을 입력하세요.");
  } else if (isNaN(numValue)) {
    notice(`${inputValue}은(는) 뭔가 잘못된 값입니다...`);
  } else if (numValue < 1) {
    notice(`${inputValue}은(는) 너무 작습니다...`);
  } else if (numValue > wordIndices.length) {
    notice(`${inputValue}은(는) 너무 큽니다...`);
  } else {
    idxofWords = numValue - 1;
    showWord(idxofWords);
  }
});

// document.addEventListener("keypress", (e) => {
//     if (e.ctrlKey && e.shiftKey && e.code == "keyH" && nowScreen == "read") {

//     }
// });
