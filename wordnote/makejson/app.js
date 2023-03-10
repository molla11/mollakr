const HTML = {
    index: document.getElementById("index"),
    word: document.getElementById("word"),
    mean: {
        noun: document.getElementById("noun"),
        verb: document.getElementById("verb"),
        adjective: document.getElementById("adjective"),
        adverb: document.getElementById("adverb"),
        preposition: document.getElementById("preposition"),
        conjunction: document.getElementById("conjunction"),
        interjection: document.getElementById("interjection")
    },
    submit: document.getElementById("submit"),
    jsonData: document.getElementById("json-data")
};
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
    };
    function arrToString(arr) {
        let result = '';
        if (arr[0].replaceAll(" ", "") === "") {
            return result;
        }
        else {
            result += `"${arr[0]}"`;
        }
        for (let i = 1; i < arr.length; i++) {
            result += `, "${arr[i]}"`;
        }
        return result;
    }
    const data = `"${parseInt(HTML.index.value)}": {
  "word": "${HTML.word.value.replaceAll(" ", "")}",
  "meaning": {
  "noun": [${arrToString(mean.noun)}],
  "verb": [${arrToString(mean.verb)}],
  "adjective": [${arrToString(mean.adjective)}],
  "adverb": [${arrToString(mean.adverb)}],
  "preposition": [${arrToString(mean.preposition)}],
  "conjunction": [${arrToString(mean.conjunction)}],
  "interjection": [${arrToString(mean.interjection)}]
  }
},`;
    HTML.jsonData.innerHTML = data;
    copyToClipBoard(data);
}
function copyToClipBoard(content) {
    navigator.clipboard.writeText(content)
        .then(() => {
        console.log("Text copied to clipboard...");
    })
        .catch(err => {
        console.log('Something went wrong', err);
    });
}
