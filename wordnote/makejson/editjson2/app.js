const result = new Array();

for (const dayIdx of Object.keys(words)) {
    const dayObj = new Object();
    dayObj.day = parseInt(dayIdx.slice(3));
    dayObj.words = new Array();
    for (const wordIdx of Object.keys(words[dayIdx])) {
        const wordObj = {
            day: parseInt(dayIdx.slice(3)),
            id: parseInt(wordIdx),
            word: words[dayIdx][wordIdx].word,
            meanings: new Array()
        }

        for (speechPart of Object.keys(words[dayIdx][wordIdx].meaning)) {
            wordObj.meanings.push({
                speechPart,
                definitions: [...words[dayIdx][wordIdx].meaning[speechPart]]
            });
        }
        dayObj.words.push(wordObj);
    }

    result.push(dayObj);
}

document.write(JSON.stringify(result));
console.log(result);