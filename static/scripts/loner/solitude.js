let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
let vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
let dt = 10;

let ps = document.getElementsByTagName("p");
for (let i = 0; i < ps.length; i++) {
    ps[i].style.display = "none";
}

let div = document.getElementsByTagName("div")[0];
div.style.display = "";

let doneWriting = true;
let currentPIndex = 0;

/**
 * @param {HTMLParagraphElement} p
 */
function parallel(p) {
    return p.hasAttribute("data-parallel");
}

/**
 * @param {HTMLParagraphElement} p
 */
function shouldContinue(p) {
    return p.hasAttribute("data-continue");
}

/**
 * @param {HTMLParagraphElement} p
 */
function shouldFontFade(p) {
    return p.hasAttribute("data-fontsize-fade");
}

/**
 * @param {HTMLParagraphElement} p
 */
function getFontSize(p) {
    if (!shouldFontFade(p)) {
        let fontSize = parseFloat(window.getComputedStyle(p).fontSize);
        return [fontSize, fontSize];
    }

    let sizes = p.getAttribute("data-fontsize-fade");
    let [sizeMax, sizeMin] = sizes.split(",").map(
        (v) => parseFloat(v) / 100 * Math.min(vw, vh)
    );
    return [parseFloat(sizeMax), parseFloat(sizeMin)];
}

/**
 * @param {HTMLParagraphElement} p
 */
function getDt(p) {
    if (p.hasAttribute("data-speed-mult")) {
        return dt * 1.0 / p.getAttribute("data-speed-mult");
    }
    return dt;
}

/**
 * @param {HTMLParagraphElement} p
 * @param {string} text
 * @param {number} i
 */
function writeToPosition(p, text, i, addCursor) {
    let [maxFontSize, minFontSize] = getFontSize(p);
    console.log(maxFontSize);
    let html = "";
    let currentSize = 0;
    for (let j = 0; j < i; j++) {
        // go from default to half size
        let percentage = (text.length - j) / text.length;
        currentSize = Math.floor(
            ((1 - percentage) * minFontSize + percentage * maxFontSize)
        );
        html += `<span style="font-size:${currentSize}px">${text[j]}</span>`;
    }
    if (addCursor) {
        html += `<span style="font-size:${currentSize}px">█</span>`;
    }
    p.innerHTML = html;
}

/**
 * @param {HTMLParagraphElement} p
 * @param {number} dt
 */
function writeText(p, dt) {
    doneWriting = false;
    text = p.innerText;
    p.innerText = "";
    let i = 0;
    let id = setInterval(function(p, text) {
        if (i < text.length && !doneWriting) {
            writeToPosition(p, text, i++, true);
            window.scrollTo(0, document.body.scrollHeight);
            return;
        }
        window.scrollTo(0, document.body.scrollHeight);

        // set doneWriting to true to skip to the next paragraph
        clearInterval(id);
        writeToPosition(p, text, text.length, false);
        if (parallel(p)) {
            return;
        }

        if (doneWriting) {
            advance();
        } else {
            doneWriting = true;
            if (shouldContinue(p)) {
                advance();
            }
        }
    }, dt, p, text);
}

function advance(flushWrite) {
    if (currentPIndex >= ps.length) {
        return;
    }

    if (!doneWriting && flushWrite) {
        doneWriting = true;
        return;
    }

    const p = ps[currentPIndex++];
    dt = getDt(p);
    p.style.display = "";
    writeText(p, dt);

    if (parallel(p)) {
        advance(false);
    }
}

function blinkingCursor() {
    let ticks = 0;
    let p = ps[currentPIndex - 1];
    const blink = (el) => {
        let text = el.innerText || "█";
        if (text[text.length - 1] == "█") {
            el.innerText = text.slice(0, text.length - 1);
        } else {
            el.innerText += "█";
        }
    }
    const addBar = (el) => {
        let text = el.innerText;
        if (text[text.length - 1] == "█") {
            el.innerHTML = text.slice(0, text.length - 1);
        }
    }

    let id = window.setInterval(() => {
        ticks++;
        if (currentPIndex == ps.length - 1) {
            clearInterval(id);
        }

        if (!doneWriting && currentPIndex > 1) {
            addBar(p.lastElementChild || p);
            return;
        }

        if (ticks % 100 != 0) {
            return;
        }

        p = ps[currentPIndex - 1];
        blink(p.lastElementChild || p);
    }, 1);
}

addEventListener("keydown", (_) => {
    advance(true);
});
addEventListener("touchstart", (_) => {
    advance(true);
});

advance(true);
blinkingCursor();
