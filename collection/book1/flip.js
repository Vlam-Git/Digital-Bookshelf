let pages = [];
let currentPage = 0;

const leftPage  = document.querySelector(".left-page");
const rightPage = document.querySelector(".right-page");
const flipPage  = document.querySelector(".flip-page");

/* ============================================================
	FETCH STORY FILE FROM REPO
============================================================ */
fetch("fullstory.txt")
    .then(response => response.text())
    .then(rawText => {
        const html = convertMarkdown(rawText);
        const rawPages = paginateHTML(html);
        pages = pairPages(rawPages);
        currentPage = 0;
        renderPages();
    })
    .catch(err => console.error("Error loading story:", err));

/* ============================================================
	MARKDOWN → HTML PARSER
============================================================ */
function convertMarkdown(text) {
    const lines = text.split(/\r?\n/);

    const htmlLines = lines.map(line => {
        // Headings
        if (line.startsWith("### ")) return `<h3>${line.substring(4)}</h3>`;
        if (line.startsWith("## "))  return `<h2>${line.substring(3)}</h2>`;
        if (line.startsWith("# "))   return `<h1>${line.substring(2)}</h1>`;

        // Scene break
        if (line.trim() === "***") return `<div class="scene-break">***</div>`;

        // Indent (4 leading spaces)
        if (/^\s{4}/.test(line)) {
            const clean = line.replace(/^\s{4}/, "");
            return `<p class="indent">${clean}</p>`;
        }

        // Bold (**text**)
        line = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

        // Italic (*text*)
        line = line.replace(/\*(.*?)\*/g, "<em>$1</em>");

        // Blank line → paragraph break
        if (line.trim() === "") return "<br>";

        // Normal paragraph
        return `<p>${line}</p>`;
    });

    return htmlLines.join("\n");
}

/* ============================================================
	PAGINATION (HTML → pages)
============================================================ */
function paginateHTML(html) {
    const words = html.split(/\s+/);
    const pages = [];
    const wordsPerPage = 180;

    for (let i = 0; i < words.length; i += wordsPerPage) {
        const chunk = words.slice(i, i + wordsPerPage).join(" ");
        pages.push(chunk);
    }

    return pages;
}

/* ============================================================
	PAIR PAGES INTO LEFT/RIGHT SPREADS
============================================================ */
function pairPages(rawPages) {
    const spreads = [];

    for (let i = 0; i < rawPages.length; i += 2) {
        spreads.push({
            left: rawPages[i] || "",
            right: rawPages[i + 1] || ""
        });
    }

    return spreads;
}

/* ============================================================
	RENDER CURRENT SPREAD
============================================================ */
function renderPages() {
    if (!pages.length) return;

    leftPage.innerHTML  = pages[currentPage].left || "";
    rightPage.innerHTML = pages[currentPage].right || "";
}

/* ============================================================
	PAGE FLIPPING
============================================================ */
rightPage.addEventListener("click", () => {
    if (currentPage >= pages.length - 1) return;

    flipPage.style.display = "block";
    flipPage.innerHTML = pages[currentPage].right || "";
    flipPage.classList.remove("flip-backward");
    flipPage.classList.add("flip-forward");

    setTimeout(() => {
        flipPage.classList.remove("flip-forward");
        flipPage.style.display = "none";

        currentPage++;
        renderPages();
    }, 800);
});

leftPage.addEventListener("click", () => {
    if (currentPage <= 0) return;

    flipPage.style.display = "block";
    flipPage.innerHTML = pages[currentPage - 1].right || "";
    flipPage.classList.remove("flip-forward");
    flipPage.classList.add("flip-backward");

    setTimeout(() => {
        flipPage.classList.remove("flip-backward");
        flipPage.style.display = "none";

        currentPage--;
        renderPages();
    }, 800);
});

/* ============================================================
	BACK TO BOOKSHELF
============================================================ */
document.getElementById("back-button").addEventListener("click", () => {
    window.location.href = "../../index.html";
});