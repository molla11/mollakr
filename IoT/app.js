const left = document.querySelector("#left");
const right = document.querySelector("#right");
const img = document.querySelector("img");
left.addEventListener('click', () => {
    const idxOfimg = parseInt(img.src.slice(-5, img.src.length).substring(0, 1));
    if (idxOfimg >= 2) {
        changeImage(-1);
    }
    else if (idxOfimg === 0) {
        changeImage(9);
    }
});
right.addEventListener('click', () => {
    const idxOfimg = parseInt(img.src.slice(-5, img.src.length).substring(0, 1));
    if (idxOfimg <= 9 && !(idxOfimg === 0)) {
        changeImage(1);
    }
});
function changeImage(amount) {
    const idxOfimg = parseInt(img.src.slice(-5, img.src.length).substring(0, 1));
    img.src = `img/${idxOfimg + amount}.png`;
}
