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

const nowData = {
  day: 0,
  index: 0
}

const values = Array.from({ length: Object.keys(data).length }, () => false);

{
  let isHoverSettings = false;
  let isHoverCheckboxes = false;

  HTML.top.settings.addEventListener("mouseover", () => {
    isHoverSettings = true;
    setCheckboxes();
  });
  HTML.top.settings.addEventListener("mouseleave", () => {
    isHoverSettings = false;
    setCheckboxes();
  });
  HTML.top.checkboxes.addEventListener("mouseover", () => {
    isHoverCheckboxes = true;
    setCheckboxes();
  });
  HTML.top.checkboxes.addEventListener("mouseleave", () => {
    isHoverCheckboxes = false;
    setCheckboxes();
  });

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
      values[parseInt(keyIndex) - 1] = checkbox.checked;
    };
    const checkmark = document.createElement("span");
    checkmark.className = "checkmark";
    label.appendChild(checkbox);
    HTML.top.checkboxes.appendChild(label);

  }
}

function handleCheckbox(checkbox) {
  console.log(checkbox.id);
}

function showWord(day, index) {
  try {
    const word = document.createElement("span");
    word.id = "word";
    word.classList.add("in-top");
    word.classList.add("word");
    word.innerHTML = data['day' + day][index].word;
    const indexElement = document.createElement("span");
    indexElement.id = "index";
    indexElement.classList.add("in-top");
    indexElement.classList.add("index");
    HTML.top.wrap.prepend(indexElement);
    HTML.top.wrap.prepend(word);
    indexElement.innerHTML = "No. " + index;
  } catch(err) {
    alert("showWord(): 단어를 표시하는 중 오류가 발생하였습니다.\n" + err);
  }
}

function showMeans(day, index) {
  try {
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
        nowData.day = day;
        nowData.index = index;
      }
    }
  } catch (err) {
    alert("showMeans(): 뜻을 표시하는 중 오류가 발생하였습니다.\n" + err);
  }
}

function removeWord() {
  try {
    document.getElementById("word").remove();
    document.getElementById("index").remove();
  } catch(err) {
    console.log("removeWord(): 지울 element가 없습니다.");
  }
}