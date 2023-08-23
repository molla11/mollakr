if (!isTrustLocalRanges()) {
    clearMain();
    mainEls.range.style.display = "inline-block";
    changeScreen("range");
}

for (let idx = 1; idx < wordMap.size + 1; idx++) {
    addCheckbox(idx);
    if (idx % 5 === 0 && idx != ranges.length) {
        checkboxContainer.appendChild(document.createElement('br'));
    }

    function addCheckbox(idx) {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        const checkboxId = `range-checkbox-${idx}`;
        checkbox.id = checkboxId;
        checkbox.checked = ranges[idx - 1];

        checkboxContainer.appendChild(checkbox);

        const label = document.createElement("label");
        label.htmlFor = checkboxId;
        label.innerText = `Day ${idx}`;

        const xMark = document.createElement("span");
        xMark.className = "range-x-mark";
        label.appendChild(xMark);

        const checkMark = document.createElement("span");
        checkMark.className = "range-check-mark";
        label.appendChild(checkMark);

        checkboxContainer.appendChild(label);
    }
}

showStatusToCheckbox();

rangesChanged();

clearRangeEl.addEventListener("click", () => {
    localStorage.removeItem("ranges");
    location.reload();
});

selectAllEl.addEventListener("click", () => {
    const checkboxEls = document.querySelectorAll(`#range-checkbox-container input[type="checkbox"]`);
    ranges.forEach((value, idx) => {
        ranges[idx] = true;
        checkboxEls[idx].checked = true;
    });
    rangesChanged();
});

const endTimeTotal = new Date().getTime();
console.log(`I'm ready! (total ${endTimeTotal - startTimeInHandleData}ms)`);