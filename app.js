const paragraphs = document.getElementsByClassName("paragraph");
handleParagraphs();
window.addEventListener("resize", () => {
    handleParagraphs();
});
function handleParagraphs() {
    const sizes = getSizeOfParagraphs();
    for (let i = 0; i < paragraphs.length; i++) {
        const element = paragraphs[i];
        element.addEventListener("mouseover", () => {
            element.style.height = `${sizes[i]}px`;
        });
        element.addEventListener("mouseleave", () => {
            if (element.id === "introduction") {
                element.style.height = "30px";
            }
            else {
                element.style.height = "20px";
            }
        });
    }
}
function getSizeOfParagraphs() {
    const result = [];
    for (const element of paragraphs) {
        element.style.height = "auto";
        result.push(element.offsetHeight - 35);
    }
    initHeightOfParagraphs();
    return result;
    function initHeightOfParagraphs() {
        for (const element of paragraphs) {
            element.style.height = "20px";
        }
        document.getElementById("introduction").style.height = "30px";
    }
}
