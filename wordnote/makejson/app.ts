const HTML = {
  index: document.getElementById("index") as HTMLInputElement,
  word: document.getElementById("word") as HTMLInputElement,
  mean: {
    noun: document.getElementById("noun") as HTMLInputElement,
    verb: document.getElementById("verb") as HTMLInputElement,
    adjective: document.getElementById("adjective") as HTMLInputElement,
    adverb: document.getElementById("adverb") as HTMLInputElement,
    preposition: document.getElementById("preposition") as HTMLInputElement,
    conjunction: document.getElementById("conjunction") as HTMLInputElement,
    interjection: document.getElementById("interjection") as HTMLInputElement
  },
  submit: document.getElementById("submit") as HTMLInputElement,
  jsonData: document.getElementById("json-data") as HTMLDivElement
}

HTML.submit.addEventListener('click', () => {
  makeJsonData();
  HTML.index.value = (parseInt(HTML.index.value) + 1).toString();
  HTML.word.value = '';
  for (const key in HTML.mean) {
    HTML.mean[key].value = '';
  }
  HTML.word.focus();
});

function makeJsonData() {
  const mean = {
    noun: HTML.mean.noun.value.split(', '),
    verb: HTML.mean.verb.value.split(', '),
    adjective: HTML.mean.adjective.value.split(', '),
    adverb: HTML.mean.adverb.value.split(', '),
    preposition: HTML.mean.preposition.value.split(', '),
    conjunction: HTML.mean.conjunction.value.split(', '),
    interjection: HTML.mean.interjection.value.split(', ')
  }

  function arrToString(arr: string[]): string {
    let result: string = '';

    if (arr[0].replaceAll(" ", "") === "") {
      return result;
    } else {
      result += `"${arr[0]}"`;
    }

    for (let i = 1; i < arr.length; i++) {
      result += `, "${arr[i]}"`;
    }

    return result;
  }

  const data = 
`"${ parseInt(HTML.index.value) }": {
  "word": "${ HTML.word.value.replaceAll(" ", "") }",
  "meaning": {
  "noun": [${ arrToString(mean.noun) }],
  "verb": [${ arrToString(mean.verb) }],
  "adjective": [${ arrToString(mean.adjective) }],
  "adverb": [${ arrToString(mean.adverb) }],
  "preposition": [${ arrToString(mean.preposition) }],
  "conjunction": [${ arrToString(mean.conjunction) }],
  "interjection": [${ arrToString(mean.interjection) }]
  }
},`;

  HTML.jsonData.innerHTML = data;
  copyToClipBoard(data);
}

function copyToClipBoard(content: string) {

  navigator.clipboard.writeText(content)
  .then(() => {
    console.log("Text copied to clipboard...")
  })
  .catch(err => {
    console.log('Something went wrong', err);
  })
}