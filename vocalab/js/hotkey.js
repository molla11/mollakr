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
                if (e.shiftKey) {
                    set.test.shuffle = !set.test.shuffle;
                    document.getElementById("set-test-shuffle").checked = set.test.shuffle;
                } else {
                    set.show.shuffle = !set.show.shuffle;
                    document.getElementById("set-show-shuffle").checked = set.show.shuffle;
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