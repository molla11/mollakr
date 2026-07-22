const wrap = document.getElementById("wrap");

loadContent();

async function loadContent() {
    try {
        const response = await fetch("content.md");
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        wrap.replaceChildren(renderMarkdown(await response.text()));
        appendHelp();
        setupAccordions();
    } catch (error) {
        console.error("마크다운 콘텐츠를 불러오지 못했습니다.", error);
        wrap.innerHTML = `
            <p class="error" role="alert">
                콘텐츠를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
            </p>`;
    }
}

function renderMarkdown(markdown) {
    const fragment = document.createDocumentFragment();
    let section = null;
    let paragraphLines = [];
    let list = null;

    const appendToPage = (element) => (section || fragment).appendChild(element);

    const flushParagraph = () => {
        if (paragraphLines.length === 0) return;

        const paragraph = document.createElement("p");
        paragraph.innerHTML = renderInline(joinParagraphLines(paragraphLines));
        appendToPage(paragraph);
        paragraphLines = [];
    };

    const flushList = () => {
        if (!list) return;
        appendToPage(list);
        list = null;
    };

    for (const sourceLine of markdown.replace(/\r\n?/g, "\n").split("\n")) {
        const line = sourceLine.trimEnd();
        const heading = /^(#{1,6})\s+(.+?)(?:\s+\{#([A-Za-z][\w-]*)\})?$/.exec(line);
        const listItem = /^\s*[-*+]\s+(.+)$/.exec(line);

        if (heading) {
            flushParagraph();
            flushList();

            section = document.createElement("section");
            section.className = "paragraph";
            section.id = heading[3] || makeSlug(heading[2]);

            const title = document.createElement(`h${heading[1].length}`);
            title.innerHTML = renderInline(heading[2]);
            section.appendChild(title);
            fragment.appendChild(section);
        } else if (/^\s{0,3}([-*_])(?:\s*\1){2,}\s*$/.test(line)) {
            flushParagraph();
            flushList();
            const rule = document.createElement("hr");
            rule.className = section ? "in-div" : "";
            appendToPage(rule);
        } else if (listItem) {
            flushParagraph();
            if (!list) list = document.createElement("ul");

            const item = document.createElement("li");
            item.innerHTML = renderInline(listItem[1]);
            list.appendChild(item);
        } else if (line.trim() === "") {
            flushParagraph();
            flushList();
        } else {
            flushList();
            paragraphLines.push(sourceLine);
        }
    }

    flushParagraph();
    flushList();
    return fragment;
}

function renderInline(source) {
    const tokens = [];
    const keep = (html) => {
        tokens.push(html);
        return `\u0000${tokens.length - 1}\u0000`;
    };

    let html = escapeHtml(source);
    html = html.replace(/`([^`]+)`/g, (_, code) => keep(`<code>${code}</code>`));
    html = html.replace(/\[([^\]]+)]\((https?:\/\/(?:[^\s()]|\([^\s()]*\))+?)\)/g,
        (_, label, url) => keep(`<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`));
    html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/  \n/g, "<br>").replace(/\n/g, " ");
    return html.replace(/\u0000(\d+)\u0000/g, (_, index) => tokens[Number(index)]);
}

function joinParagraphLines(lines) {
    return lines.map((line) => line.endsWith("  ") ? `${line}\n` : `${line.trim()} `)
        .join("")
        .trimEnd();
}

function escapeHtml(source) {
    return source
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function makeSlug(title) {
    return title.toLowerCase()
        .replace(/<[^>]*>/g, "")
        .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
        .replace(/^-|-$/g, "") || "section";
}

function appendHelp() {
    wrap.appendChild(document.createElement("hr"));

    const help = document.createElement("div");
    help.id = "help";
    help.textContent = "각 챕터의 제목에 마우스를 올려 보세요.";
    wrap.appendChild(help);
}

function setupAccordions() {
    const paragraphs = [...document.getElementsByClassName("paragraph")];
    let expandedSizes = measureParagraphs(paragraphs);

    for (const element of paragraphs) {
        element.addEventListener("mouseenter", () => {
            element.style.height = `${expandedSizes.get(element)}px`;
        });
        element.addEventListener("mouseleave", () => collapse(element));
    }

    window.addEventListener("resize", () => {
        expandedSizes = measureParagraphs(paragraphs);
    });
}

function measureParagraphs(paragraphs) {
    const sizes = new Map();
    for (const element of paragraphs) {
        element.style.height = "auto";
        sizes.set(element, element.scrollHeight - 20);
    }
    for (const element of paragraphs) collapse(element);
    return sizes;
}

function collapse(element) {
    element.style.height = element.id === "introduction" ? "30px" : "20px";
}
