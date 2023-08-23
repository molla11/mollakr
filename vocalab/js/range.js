const isTrusted = isTrustLocalRanges();
const wordIndices = new Array();

/** Array for saving ranges */
const ranges = isTrusted ? localRanges: Array.from({length: wordMap.size}, () => false);

/** HTML element: container of checkboxes */
const checkboxContainer = document.getElementById("range-checkbox-container");

function showStatusToCheckbox() {
    /** HTML elements: checkboxes to select ranges */
    const checkboxEls = document.querySelectorAll(`#range-checkbox-container input[type="checkbox"]`);

    checkboxEls.forEach((el, idx) => {
        el.addEventListener("input", (e) => {
            ranges[idx] = e.target.checked;
            rangesChanged();
        });
    });
}

/** HTML element: div to show selected ranges (to text) */
const showSelectedEl = document.getElementById("show-selected");

function rangesChanged() {
    localStorage.setItem("ranges", JSON.stringify(ranges));
    showSelected();
    setWordIndices();
    idxofWords = 0;
    if (isTrustLocalRanges()) {
        showWord(idxofWords);
    }
}

function showSelected() {
    let selectedStr = "Selected: ";
    let selectedNum = 0;
    ranges.forEach((value, idx) => {
        if (value) {
            if (selectedNum > 0) {
                selectedStr += ",";
            }
            selectedStr += ` ${idx + 1}`;
            selectedNum++;
        }
    })
    if (selectedNum == 0) {
        selectedStr += "None";
    }
    selectedStr += ".";
    showSelectedEl.innerText = selectedStr;
}

function setWordIndices() {
    const startTimeInWordIndices = new Date().getTime();

    wordIndices.splice(0, wordIndices.length);
    for (const rangesIdx in ranges) {
        const i = parseInt(rangesIdx);
        if (ranges[i]) {
            for (const j of wordMap.get(i + 1).keys()) {
                wordIndices.push([i + 1, j]);
            }
        }
    }

    const endTimeInWordIndices = new Date().getTime();
    console.log(`wordIndices has been refreshed. (${endTimeInWordIndices - startTimeInWordIndices}ms)`);
}

/** HTML element: button to clear ranges */
const clearRangeEl = document.getElementById("range-clear");

const selectAllEl = document.getElementById("range-select-all");