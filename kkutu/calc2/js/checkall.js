const checkAll = document.getElementById("check-all");
const checkAllInput = document.getElementById("check-all-input");
const checkAllOutput = document.getElementById("check-all-output");

const isCopy = {
    targetExp:document.getElementById("target-exp-isCopy"),
    nowExp:document.getElementById("now-exp-isCopy"),
    NJ:document.getElementById("NJ-isCopy"),
    targetLevel:document.getElementById("target-level-isCopy"),
    nowLevel:document.getElementById("now-level-isCopy"),
    expPerNJ:document.getElementById("exp-per-NJ-isCopy"),
    needExp:document.getElementById("need-exp-isCopy"),
    needNJ:document.getElementById("need-NJ-isCopy"),
    needPing:document.getElementById("need-ping-isCopy"),
};

isCopy.targetExp.addEventListener("click", () => { f_isSameInputs(); });
isCopy.nowExp.addEventListener("click", () => { f_isSameInputs(); });
isCopy.NJ.addEventListener("click", () => { f_isSameInputs(); });

function f_isSameInputs() {
    if (isCopy.targetExp.checked && isCopy.nowExp.checked && isCopy.NJ.checked) {
        checkAllInput.checked = true;
    } else { checkAllInput.checked = false; }
    f_isSameAll();
}

checkAllInput.addEventListener("click", () => {
    const checkboxValue = checkAllInput.checked;
    changeInputs(checkAllInput.checked);
    f_isSameAll();
});

function changeInputs(a_value) {
    isCopy.targetExp.checked = a_value;
    isCopy.nowExp.checked = a_value;
    isCopy.NJ.checked = a_value;
}

checkAllOutput.addEventListener("click", () => {
    changeOutputs(checkAllOutput.checked);
    f_isSameAll();
});

function changeOutputs(a_value) {
    isCopy.targetLevel.checked = a_value;
    isCopy.nowLevel.checked = a_value;
    isCopy.expPerNJ.checked = a_value;
    isCopy.needExp.checked = a_value;
    isCopy.needNJ.checked = a_value;
    isCopy.needPing.checked = a_value;
}

isCopy.targetLevel.addEventListener("click", () => { f_isSameOutputs(); });
isCopy.nowLevel.addEventListener("click", () => { f_isSameOutputs(); });
isCopy.expPerNJ.addEventListener("click", () => { f_isSameOutputs(); });
isCopy.needExp.addEventListener("click", () => { f_isSameOutputs(); });
isCopy.needNJ.addEventListener("click", () => { f_isSameOutputs(); });
isCopy.needPing.addEventListener("click", () => { f_isSameOutputs(); });

function f_isSameOutputs() {
    if (isCopy.targetLevel.checked && isCopy.nowLevel.checked && isCopy.expPerNJ.checked && isCopy.needExp.checked && isCopy.needNJ.checked && isCopy.needPing.checked) {
        checkAllOutput.checked = true;
    } else { checkAllOutput.checked = false; }
    f_isSameAll();
}

checkAll.addEventListener("click", () => {
    const checkboxValue = checkAll.checked;
    changeInputs(checkboxValue);
    changeOutputs(checkboxValue);
    checkAllInput.checked = checkboxValue;
    checkAllOutput.checked = checkboxValue;
});

function f_isSameAll() {
    if (checkAllInput.checked && checkAllOutput.checked) {
        checkAll.checked = true;
    } else { checkAll.checked = false; }
}