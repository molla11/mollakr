const data = words; // from data.js

const HTML = {
  top: {
    wrap: document.getElementById("top"),
    forder: document.getElementById("forder"),
    checkboxes: document.getElementById("checkboxes")
  },
  main: document.getElementById("main"),
  meaning: {
    wrap: document.getElementById("meaning")
  },
  bottom: document.getElementById("bottom")
}

showCheckBoxes();
hideWord();
hideHelp("help1");

const checkboxValues = Array.from({ length: Object.keys(data).length }, () => false);
let indexes = new Array();
let isShuffle = false;
let isShowWordOnly = false;
let idxWord = -1;

function initIndex() {
  idxWord = -1;
  hideWord();
  clearMean();
  if (indexes.length >= 1) {
    idxWord++;
    showWord(...indexes[idxWord]);
    if (!isShowWordOnly) {
      showMean(...indexes[idxWord]);
    }
  }
}

function getWordIndexes() {
  const list = [];
  for (const dayIndex in checkboxValues) {
    if (checkboxValues[dayIndex]) {
      for (const wordIndex in data["day" + (parseInt(dayIndex) + 1)]) {
        list.push([parseInt(dayIndex) + 1, parseInt(wordIndex)]);
      }
    }
  }
  return list;
}

function shuffle(array) { // method: Fisher-Yates Shuffle
  try {
    if (array.length <= 1) {
      return array;
    } else {
      const shuffled = new Array();
      while (array.length !== 0) {
        const random = Math.floor(Math.random() * array.length);
        const temp = array[random];
        array[random] = array[array.length - 1];
        array[array.length - 1] = temp;
        shuffled.push(array.pop());
      }
      return shuffled;
    }
  } catch(err) {
    alert("shuffle(): 배열을 섞는 중 오류가 발생하였습니다.\n" + err);
  }
}

function arrange(array) { // method: Quicksort
  try {
    if (array.length <= 1) {
      return array;
    } else {
      const criterion = array[0];
      let left = new Array();
      let right = new Array();
      for (let i = 1; i < array.length; i++) {
        if (array[i][0] === criterion[0]) {
          if (array[i][1] < criterion[1]) {
            left.push(array[i]);
          } else {
            right.push(array[i]);
          }
        } else if (array[i][0] < criterion[0]) {
          left.push(array[i]);
        } else {
          right.push(array[i]);
        }
      }
      left = arrange(left);
      right = arrange(right);
      return [...left, criterion, ...right];
    }
  } catch(err) {
    alert("arrange(): 배열을 정렬하는 중 오류가 발생하였습니다.\n" + err);
  }
}

/*
function compareFunction(a, b) {
  if (a[0] === b[0]) {
    return (a[1] < b[1]) ? -1 : 1;
  } else {
    return (a[0] < b[0]) ? -1 : 1;
  }
}*/

try {
  let isHoverForder = false;
  let isHoverCheckboxes = false;

  HTML.top.forder.addEventListener("mouseover", () => {
    isHoverForder = true;
    setCheckboxes();
    showHelp("help1");
  });
  HTML.top.forder.addEventListener("mouseleave", () => {
    isHoverForder = false;
    setCheckboxes();
    hideHelp("help1");
  });
  HTML.top.checkboxes.addEventListener("mouseover", () => {
    isHoverCheckboxes = true;
    setCheckboxes();
  });
  HTML.top.checkboxes.addEventListener("mouseleave", () => {
    isHoverCheckboxes = false;
    setCheckboxes();
  });

  document.getElementById("shuffle").addEventListener("click", () => toggleShuffling());

  function toggleShuffling() {
    if (isShuffle) {
      if (indexes.length >= 1) {
        indexes = arrange(indexes);
      }
      isShuffle = false;
      document.getElementById("img-shuffle").src = "./img/icon/unshuffle.png";
      say("순서를 <b>정렬</b>하였습니다.<br>순서를 <b>섞</b>으려면 한번 더 눌러 주세요.");
    } else {
      if (indexes.length >= 1) {
        indexes = shuffle(indexes);
      }
      isShuffle = true;
      document.getElementById("img-shuffle").src = "./img/icon/shuffle.png";
      say("순서를 <b>섞</b>었습니다.<br>순서를 <b>정렬</b>하려면 한번 더 눌러 주세요.");
    }
    initIndex();
  }

  document.getElementById("hide").addEventListener("click", () => toggleDisplaying());

  function toggleDisplaying() {
    if (isShowWordOnly) {
      isShowWordOnly = false;
      document.getElementById("img-hide").src = "./img/icon/show.png";
      say("뜻을 <b>보였</b>습니다.<br>뜻을 <b>숨기</b>려면 한번 더 눌러 주세요.");
      if (indexes.length >= 1) {
        showMean(...indexes[idxWord]);
      }
    } else {
      isShowWordOnly = true;
      document.getElementById("img-hide").src = "./img/icon/hide.png";
      say("뜻을 <b>숨겼</b>습니다.<br>뜻을 <b>보이</b>려면 한번 더 눌러 주세요.");
      clearMean();
    }
  }

  document.getElementById("icon-copyright").addEventListener("mouseover", () => {
    showHelp("copyright-list");
  })
  document.getElementById("icon-copyright").addEventListener("mouseleave", () => {
    hideHelp("copyright-list");
  })

  document.getElementById("btn-previous").addEventListener("click", () => showPrevious());
  document.getElementById("btn-next").addEventListener("click", () => showNext());

  function showPrevious() {
    if (indexes.length === 0) {
      say("설정에서 어휘의 범위를 정해 주세요.");
    } else {
      if (idxWord <= 0) {
        say("앞으로 넘길 수 없습니다.");
        return;
      }
      showWord(...indexes[--idxWord]);
      if (!isShowWordOnly) {
        showMean(...indexes[idxWord]);
      }
    }
  }

  function showNext() {
    if (indexes.length === 0) {
      say("설정에서 어휘의 범위를 정해 주세요.");
    } else {
      if (idxWord >= indexes.length - 1) {
        say("뒤로 넘길 수 없습니다.");
        return;
      }
      showWord(...indexes[++idxWord]);
      if (!isShowWordOnly) {
        showMean(...indexes[idxWord]);
      }
    }
  }

  function setCheckboxes() {
    if (isHoverForder || isHoverCheckboxes) {
      HTML.top.checkboxes.style.display = "inline-block";
    } else {
      HTML.top.checkboxes.style.display = "none";
    }
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showPrevious();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      showNext();
    } else if (event.key === "d" && event.ctrlKey === true) {
      event.preventDefault();
      toggleDisplaying();
    } else if (event.key === "s" && event.ctrlKey === true) {
      event.preventDefault();
      toggleShuffling();
    }
  })
} catch (err) {
  alert("이벤트를 설정하거나 실행하는 중 오류가 발생하였습니다.\n" + err);
}

function showCheckBoxes() {
  const REPEAT = 5;
  let repeated = 0;

  const selectToText = document.createElement("div");
  selectToText.id = "select-to-text";
  
  const inputText = document.createElement("input");
  inputText.id = "select-to-text-input";

  selectToText.appendChild(inputText);

  HTML.top.checkboxes.appendChild(selectToText);

  const inputTextElement = document.getElementById("select-to-text-input");

  inputTextElement.addEventListener("input", () => {
    for (const i in checkboxValues) {
      checkboxValues[i] = false;
      document.querySelector(`#checkbox-${parseInt(i) + 1} input`).checked = false;
    }

    for (indexString of ((inputTextElement.value).split(","))) {
      const index = parseInt(indexString);
      if (isNaN(index)) {
        if (!(indexString.replaceAll(" ", "") === "")) {
          say(`"${indexString}" 은(는) 일반적인 숫자가 아닙니다. 올바른 index를 입력해 주세요.`);
        }
      } else if (checkboxValues.length < index || index < 1) {
        continue;
      } else {
        checkboxValues[index - 1] = true;
        document.querySelector(`#checkbox-${index} input`).checked = true;
      }
    }
  });

  for (const key in data) {
    if (!(repeated % REPEAT) && Boolean(repeated)) {
      HTML.top.checkboxes.appendChild(document.createElement("br"));
    }
    repeated++;

    const label = document.createElement("label");
    const keyIndex = key.substring(3, key.length);
    label.id = `checkbox-${keyIndex}`;
    label.className = "label-checkbox";
    label.innerHTML = `<span class="inner-checkbox">Day ${keyIndex}</span>`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "day-checkbox";
    checkbox.onchange = (e) => {
      checkboxValues[parseInt(keyIndex) - 1] = e.target.checked;
      console.log(isShuffle);
      indexes = isShuffle ? shuffle(getWordIndexes()): getWordIndexes();
      initIndex();
    };
    const checkmark = document.createElement("span");
    checkmark.className = "checkmark";
    label.appendChild(checkbox);
    HTML.top.checkboxes.appendChild(label);
  }
}

function showWord(day, index) {
  try {
    const wordElement = document.getElementById("word");
    wordElement.innerHTML = data['day' + day][index].word;
    wordElement.style.display = "";
    const indexElement = document.getElementById("index");
    indexElement.innerHTML = "No. " + index;
    indexElement.style.display = "";
    const tempIndexElement = document.getElementById("temp-index");
    tempIndexElement.innerHTML = `${Boolean(idxWord + 1) ? idxWord + 1 : 0} / ${indexes.length}`;
    tempIndexElement.style.display = "";
  } catch(err) {
    alert("showWord(): 단어를 표시하는 중 오류가 발생하였습니다.\n" + err);
  }
}

function hideWord() {
  const wordElement = document.getElementById("word");
  wordElement.style.display = "none";
  const indexElement = document.getElementById("index");
  indexElement.style.display = "none";
  const tempIndexElement = document.getElementById("temp-index");
  tempIndexElement.style.display = "none";
}

function showMean(day, index) {
  try {
    console.log(day, index);
    HTML.meaning.wrap.style.display = "";
    clearMean();
    for (const part in data["day" + day][index].meaning) {
      const miniWrap = document.createElement("div");
      miniWrap.id = part;
      miniWrap.className = "means";
      const partsDiv = `<div id="part-${part}" class="parts-of-speech">${part}</div>`;
      miniWrap.innerHTML = partsDiv;
      for (const mean of data["day" + day][index].meaning[part]) {
        const span = document.createElement("span");
        span.id = `mean-${part}`;
        span.className = "mean";
        span.innerHTML = mean;
        miniWrap.appendChild(span);
        document.getElementById("meaning").appendChild(miniWrap);
      }
    }
  } catch(err) {
    alert("showMean(): 뜻을 표시하는 중 오류가 발생하였습니다.\n" + err);
  }
}

function clearMean() {
  try {
    console.log(HTML.meaning.wrap.children);
    const means = HTML.meaning.wrap.children;
    console.log(means.length);
    HTML.meaning.wrap.innerHTML = "";
  } catch (err) {
    alert("clearMean(): 뜻을 지우는 중 오류가 발생하였습니다.\n" + err);
  }
}

function showHelp(helpIndex) {
  const helpElement = document.getElementById(helpIndex);
  helpElement.style.zIndex = 100;
  helpElement.style.opacity = 1;
}

function hideHelp(helpIndex) {
  const helpElement = document.getElementById(helpIndex);
  helpElement.style.zIndex = -1;
  helpElement.style.opacity = 0;
}

let saveTimeout;
function say(ment) {
  clearTimeout(saveTimeout);
  const sayElement = document.getElementById("say");
  sayElement.innerHTML = ment;
  sayElement.style.zIndex = 100;
  sayElement.style.opacity = 1;
  saveTimeout = setTimeout(() => {
    sayElement.style.opacity = 0;
    sayElement.style.zIndex = -1;
  }, 2500);
}