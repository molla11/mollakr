const navEls = {
    read: document.getElementById("nav-read"),
    range: document.getElementById("nav-range"),
    test: document.getElementById("nav-test"),
    settings: document.getElementById("nav-settings"),
    search: document.getElementById("nav-search"),
}

const mainEls = {
    read: document.getElementById("main-read"),
    range: document.getElementById("main-range"),
    test: document.getElementById("main-test"),
    settings: document.getElementById("main-settings"),
    search: document.getElementById("main-search"),
}

let nowScreen = "read";

function clearMain() {
    for (const elId of Object.keys(mainEls)) {
        mainEls[elId].style.display = "none";
    }
}

navEls.read.addEventListener("click", () => {
    clearMain();
    mainEls.read.style.display = "inline-block";
    changeScreen("read");
});

navEls.range.addEventListener("click", () => {
    clearMain();
    mainEls.range.style.display = "inline-block";
    changeScreen("range");
});

navEls.test.addEventListener("click", () => {
    clearMain();
    mainEls.test.style.display = "inline-block";
    changeScreen("test");
});

navEls.settings.addEventListener("click", () => {
    clearMain();
    mainEls.settings.style.display = "inline-block";
    changeScreen("settings");
});

navEls.search.addEventListener("click", () => {
    clearMain();
    mainEls.search.style.display = "inline-block";
    changeScreen("search");
});


function changeScreen(screen) {
    nowScreen = screen;
}

let localRanges = JSON.parse(localStorage.getItem("ranges"));

function isTrustLocalRanges() {
    localRanges = JSON.parse(localStorage.getItem("ranges"));
    let isTrusted = true;
    let isSelected = false;

    if (localRanges === null || localRanges === undefined) {
        return false;
    }
    if (localRanges.length != Object.keys(words).length) {
        console.log(`localStorage have strange data. Don't touch it!`);
        localStorage.removeItem('ranges');
        return false;
    }

    localRanges.forEach(value => {
        if (typeof value != "boolean") {
            isTrusted = false;
        } else if (value === true) {
            isSelected = true;
        }
    });

    return isTrusted && isSelected;
}

let saveTimeout;
function notice(ment) {
    clearTimeout(saveTimeout);
    const noticeEl = document.getElementById("main-notice");
    if (browserShape() == "portrait") {
        noticeEl.style.width = "80%";
    } else {
        noticeEl.style.width = "300px";
    }
    console.log(noticeEl.width);
    noticeEl.innerHTML = ment;
    noticeEl.style.zIndex = 100;
    noticeEl.style.opacity = 1;
    saveTimeout = setTimeout(() => {
        noticeEl.style.opacity = 0;
        noticeEl.style.zIndex = -1;
    }, 2500);
}

function browserShape() {
    if (window.innerWidth >= window.innerHeight) {
        return "landscape";
    }
    return "portrait";
}