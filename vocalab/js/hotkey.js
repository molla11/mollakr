const hideMeansImgEl = document.querySelector("#read-set-hide-means img");

document.addEventListener("keydown", (e) => {
    if (e.ctrlKey) {
        switch(e.code) {
            case "KeyF": {
                const isFocused = document.activeElement == document.querySelector(`#search-container .input-search`);
                e.preventDefault();
                if (isFocused) {
                    document.querySelector(`#search-container .input-search`).blur();
                } else {
                    document.querySelector(`#search-container .input-search`).focus();
                }
                break;
            }

            case "KeyD": {
                e.preventDefault();
                toggleHideMeans();
                break;
            }

            case "KeyS": {
                e.preventDefault();
                if (nowScreen == "settings") {
                    set.test.shuffle = !set.test.shuffle;
                    document.getElementById("set-test-shuffle").checked = set.test.shuffle;
                } else if (nowScreen == "read") {
                    toggleShuffleIndices();
                }
                break;
            }
            
            default:
                break;
        }
    }
});

document.addEventListener("keydown", (e) => {
    switch (e.code) {
        case "ArrowRight": {
            skipToNext();
            break;
        }

        case "ArrowLeft": {
            skipToPrevious();
            break;
        }
    }
});

function skipToNext() {
    if (nowScreen == "read") {
        if (idxofWords < wordIndices.length - 1) {
            showWord(++idxofWords);
        } else {
            notice("뒤로 더 넘길 수 없습니다.");
        }
    }
}

function skipToPrevious() {
    if (nowScreen == "read") {
        if (idxofWords > 0) {
            showWord(--idxofWords);
        } else {
            notice("앞으로 더 넘길 수 없습니다.");
        }
    }
}

function toggleShuffleIndices() {
    set.read.shuffle = !set.read.shuffle;
    if (set.read.shuffle) {
        wordIndices = shuffleIndices(wordIndices);
        setShuffleImgEl.src = "img/shuffle.png";
        notice("순서를 섞었습니다.");
    } else {
        wordIndices = sortIndices(wordIndices);
        setShuffleImgEl.src = "img/unshuffle.png";
        notice("순서를 정렬했습니다.");
    }
    idxofWords = 0;
    showWord(idxofWords);
}

function shuffleIndices(array) { // method: Fisher-Yates Shuffle
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
    } catch (err) {
        alert("shuffleIndices(): 배열을 섞는 중 오류가 발생하였습니다.\n" + err);
    }
}

function sortIndices(array) {
    if (array.length <= 1) {
        return array;
    }

    const middle = Math.floor(array.length / 2);
    const left = array.slice(0, middle);
    const right = array.slice(middle);

    return merge(sortIndices(left), sortIndices(right));
}

function merge(left, right) {
    let sortedArr = [];

    while (left.length && right.length) {
        if (left[0][0] < right[0][0] || (left[0][0] === right[0][0] && left[0][1] < right[0][1])) {
            sortedArr.push(left.shift());
        } else {
            sortedArr.push(right.shift());
        }
    }

    return [...sortedArr, ...left, ...right];
}
