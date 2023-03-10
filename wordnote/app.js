const data = words;

const HTML = {
  top: {
    wrap: document.getElementById("top"),
    checkboxes: document.getElementById("checkboxes")
  },
  main: document.getElementById("main"),
  word: document.getElementById("word"),
  index: document.getElementById("index"),
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

showData(0, 0);

function showCheckBoxes() {
  let repeated = 0;
  for (const key in data) {
    if (!(repeated % 5)) {
      HTML.top.checkboxes.innerHTML = HTML.top.checkboxes.innerHTML + '<br>';
    }
    repeated++;

    const miniWrap = document.createElement("div");
    const keyIndex = key.substring(3, key.length);
    miniWrap.id = `checkbox-${keyIndex}`;
    miniWrap.className = "wrap-checkbox";
    miniWrap.innerHTML = `Day ${keyIndex}`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    miniWrap.appendChild(checkbox);
    HTML.top.checkboxes.appendChild(miniWrap);
  }
}

function showData(day, index) {
  try {

  } catch(err) {
    alert(err);
  }
  const obj = data['day' + day][index]
  HTML.word.innerHTML = obj.word;
  HTML.index.innerHTML = "No. " + index;
  for (const key in obj.meaning) {
    if (obj.meaning[key].length === 0) {
      HTML.meaning[key].style.display = "none";
    } else {
      const partsDiv = `<div id="${"part-" + key}" class="parts-of-speech">${key}</div>`;
      HTML.meaning[key].style.display = "block";
      console.log(HTML.meaning[key]);
      HTML.meaning[key].innerHTML = partsDiv + `<div id="mean-${key}" class="mean">   ${obj.meaning[key].join(', ')}</div>`;
    }
  }
  nowData.day = day;
  nowData.index = index;
}