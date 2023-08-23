const readEls = {
    index: document.getElementById("read-index"),
    indexInSelected: document.getElementById("read-index-in-selected"),
    word: document.getElementById("read-word"),
    means: document.getElementById("read-means")
}

function showWord(idx) {
    const wordObj = wordMap.get(wordIndices[idx][0]).get(wordIndices[idx][1]);
    readEls.index.innerText = `No. ${wordObj.id}`;
    readEls.indexInSelected.innerText = `${idx + 1} / ${wordIndices.length}`;
    readEls.word.innerText = wordObj.word;
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
                meanEl.id = `read-${meaningsObj.definitions[meaningIdx]}-mean${parseInt(meaningIdx) + 1}`;
                meanEl.className = `read-mean`;
                meanEl.innerText = meaningsObj.definitions[meaningIdx]; 
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
})

const skipToPreviousEl = document.getElementById("read-skipping-previous");
const skipToNextEl = document.getElementById("read-skipping-next");

skipToPreviousEl.addEventListener("click", () => {
    skipToPrevious();
})

skipToNextEl.addEventListener("click", () => {
    skipToNext();
})

// document.addEventListener("keypress", (e) => {
//     if (e.ctrlKey && e.shiftKey && e.code == "keyH" && nowScreen == "read") {
        
//     }
// });