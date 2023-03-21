const data = words; // from data.js

const HTML = {
  top: {
    wrap: document.getElementById("top"),
    settings: document.getElementById("settings"),
    checkboxes: document.getElementById("checkboxes")
  },
  main: document.getElementById("main"),
  meaning: {
    wrap: document.getElementById("meaning"),
    noun: document.getElementById("noun"),
    verb: document.getElementById("verb"),
    adjective: document.getElementById("adjective"),
    adverb: document.getElementById("adverb"),
    preposition: document.getElementById("preposition"),
    conjunction: document.getElementById("conjunction"),
    interjection: document.getElementById("interjection")
  },
  bottom: document.getElementById("bottom")
}

showCheckBoxes();
hideWord();
hideHelp("help1");

const values = Array.from({ length: Object.keys(data).length }, () => false);
let indexes = new Array();
let isShuffle = false;
let isShowWordOnly = false;
let idxWord = -1;

function initIndex() {
  idxWord = -1;
  if (indexes.length === 0) {
    hideWord();
    hideMean();
  } else {
    showWord(...indexes[++idxWord]);
    if (!isShowWordOnly) {
      showMean(...indexes[idxWord]);
    }
  }
}

function getWordIndexes() {
  const list = [];
  for (const dayIndex in values) {
    if (values[dayIndex]) {
      for (const wordIndex in data["day" + (parseInt(dayIndex) + 1)]) {
        list.push([parseInt(dayIndex) + 1, parseInt(wordIndex)]);
      }
    }
  }
  return list;
}

function shuffle(array) { // method: Fisher-Yates Shuffle
  try {
    const shuffled = new Array();
    while (array.length !== 0) {
      const random = Math.floor(Math.random() * array.length);
      const temp = array[random];
      array[random] = array[array.length - 1];
      array[array.length - 1] = temp;
      shuffled.push(array.pop());
    }
    return shuffled;
  } catch(err) {
    alert("배열을 섞는 중 오류가 발생하였습니다.\n" + err);
  }
}

function arrange(array) { // method: Quicksort
  try {
    if (array.length <= 1) {
      return array;
    } else {
      const pivot = array[0];
      let left = new Array();
      let right = new Array();
      for (let i = 1; i < array.length; i++) {
        if (array[i][0] === pivot[0]) {
          if (array[i][1] < pivot[1]) {
            left.push(array[i]);
          } else {
            right.push(array[i]);
          }
        } else if (array[i][0] < pivot[0]) {
          left.push(array[i]);
        } else {
          right.push(array[i]);
        }
      }
      left = arrange(left);
      right = arrange(right);
      return [...left, pivot, ...right];
    }
  } catch(err) {
    alert("배열을 정렬하는 중 오류가 발생하였습니다.\n" + err);
  }
}

function compareFunction(a, b) {
  if (a[0] === b[0]) {
    return (a[1] < b[1]) ? -1 : 1;
  } else {
    return (a[0] < b[0]) ? -1 : 1;
  }
}

{
  let isHoverSettings = false;
  let isHoverCheckboxes = false;
  let isShuffle = false;

  HTML.top.settings.addEventListener("mouseover", () => {
    isHoverSettings = true;
    setCheckboxes();
    showHelp("help1");
  });
  HTML.top.settings.addEventListener("mouseleave", () => {
    isHoverSettings = false;
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

  document.getElementById("shuffle").addEventListener("click", () => {
    if (indexes.length === 0) {
      say("설정에서 어휘의 범위를 정해 주세요.");
    } else {
      if (isShuffle) {
        isShuffle = false;
        indexes = arrange(indexes);
        say("순서를 <b>정렬</b>하였습니다.<br>순서를 <b>섞</b>으려면 한번 더 눌러 주세요.");
      } else {
        isShuffle = true;
        indexes = shuffle(indexes);
        say("순서를 <b>섞</b>었습니다.<br>순서를 <b>정렬</b>하려면 한번 더 눌러 주세요.");
      }
    }
    initIndex();
  })

  document.getElementById("icon-copyright").addEventListener("mouseover", () => {
    showHelp("copyright-list");
  })
  document.getElementById("icon-copyright").addEventListener("mouseleave", () => {
    hideHelp("copyright-list");
  })

  document.getElementById("btn-previous").addEventListener("click", () => {
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
  })

  document.getElementById("btn-next").addEventListener("click", () => {
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
  })

  function setCheckboxes() {
    if (isHoverSettings || isHoverCheckboxes) {
      HTML.top.checkboxes.style.display = "inline-block";
    } else {
      HTML.top.checkboxes.style.display = "none";
    }
  }
}

function showCheckBoxes() {
  const REPEAT = 5;
  let repeated = 0;
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
      values[parseInt(keyIndex) - 1] = e.target.checked;
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
  } catch(err) {
    alert("showWord(): 단어를 표시하는 중 오류가 발생하였습니다.\n" + err);
  }
}

function hideWord() {
  const wordElement = document.getElementById("word");
  wordElement.style.display = "none";
  const indexElement = document.getElementById("index");
  indexElement.style.display = "none";
}

function showMean(day, index) {
  try {
    HTML.meaning.wrap.style.display = "";
    const obj = data['day' + day][index]
    for (const part in obj.meaning) {
      if (obj.meaning[part].length === 0) {
        HTML.meaning[part].style.display = "none";
      } else {
        const partsDiv = `<div id="part-${part}" class="parts-of-speech">${part}</div>`;
        HTML.meaning[part].style.display = "block";
        HTML.meaning[part].innerHTML = partsDiv;
        for (const mean of obj.meaning[part]) {
          const span = document.createElement("span");
          span.id = `mean-${part}`;
          span.className = "mean";
          span.innerHTML = mean;
          HTML.meaning[part].appendChild(span);
        }
      }
    }
  } catch (err) {
    alert("showMeans(): 뜻을 표시하는 중 오류가 발생하였습니다.\n" + err);
  }
}

function hideMean() {
  HTML.meaning.wrap.style.display = "none";
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