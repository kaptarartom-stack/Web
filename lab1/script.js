"use strict";

/* ---------- Допоміжне: вивід повідомлень ---------- */
function showMessage(text) {
    const time = new Date().toLocaleTimeString("uk-UA");
    const log = document.getElementById("log");
    if (log) {
        const line = document.createElement("div");
        line.textContent = "[" + time + "] " + text;
        log.appendChild(line);
        log.scrollTop = log.scrollHeight;
    }
    console.log(text);
}

function tagName(el) {
    return "<" + el.tagName.toLowerCase() + ">";
}

function randomColor() {
    const h = Math.floor(Math.random() * 360);
    return "hsl(" + h + ", 70%, 40%)";
}

/* ---------- 1. Події головного вікна (BODY): onload, onfocus, onresize ---------- */
document.body.onload = null; // onload для body фактично належить window
window.onload = function () {
    showMessage("onload: сторінку повністю завантажено (" +
        window.innerWidth + "×" + window.innerHeight + ")");
    document.body.style.background = "#e8f5e9";
};

window.onfocus = function () {
    showMessage("onfocus: вікно отримало фокус");
    document.body.style.background = "#e8f5e9";
};

window.onblur = function () {
    showMessage("onblur: вікно втратило фокус");
    document.body.style.background = "#f4f4f9";
};

window.onresize = function () {
    showMessage("onresize: новий розмір вікна " +
        window.innerWidth + "×" + window.innerHeight);
};

/* ---------- 2. Теги H1..H6, B, I, STRONG, EM: onclick, onmousedown, onscroll ---------- */
const textTags = document.querySelectorAll("h1, h2, h3, h4, h5, h6, b, i, strong, em");

textTags.forEach(function (el) {
    el.style.cursor = "pointer";

    // onclick — змінюємо колір тексту та накреслення
    el.onclick = function () {
        const color = randomColor();
        el.style.color = color;
        el.style.textDecoration = el.style.textDecoration === "underline" ? "none" : "underline";
        showMessage("onclick: елемент " + tagName(el) + " — колір змінено на " + color);
    };

    // onmousedown — змінюємо фон і рамку, повідомляємо кнопку миші
    el.onmousedown = function (e) {
        const buttons = ["ліва", "середня", "права"];
        el.style.background = "#fff3b0";
        el.style.outline = "2px dashed #006f1c";
        showMessage("onmousedown: " + tagName(el) + ", натиснуто " +
            (buttons[e.button] || e.button) + " кнопку миші");
    };

    // повертаємо вигляд після відпускання кнопки
    el.onmouseup = function () {
        el.style.background = "";
        el.style.outline = "";
    };
});

// onscroll — подія не спливає, тому вішаємо на вікно та на прокручуваний блок
window.onscroll = function () {
    const h = document.querySelector("h1, h2");
    if (h) {
        h.style.letterSpacing = Math.min(window.scrollY / 20, 10) + "px";
    }
    showMessage("onscroll (вікно): прокрутка по Y = " + Math.round(window.scrollY));
};

const scrollBox = document.getElementById("scrollBox");
if (scrollBox) {
    scrollBox.onscroll = function () {
        const percent = Math.round(
            scrollBox.scrollTop / (scrollBox.scrollHeight - scrollBox.clientHeight) * 100);
        scrollBox.style.background = "hsl(" + (percent * 1.2) + ", 60%, 92%)";
        showMessage("onscroll (блок): прокручено " + percent + "%");
    };
}

/* ---------- 3. (додатково) Події миші для малюнків SVG ---------- */
const shapes = document.querySelectorAll("svg .shape");

shapes.forEach(function (shape, index) {
    const name = "Фігура №" + (index + 1) + " (" + shape.tagName + ")";

    shape.style.cursor = "pointer";
    shape.style.transition = "stroke-width 0.2s, opacity 0.2s";

    shape.onmousedown = function () {
        shape.style.opacity = "0.5";
        showMessage("mousedown: натиснуто на фігурі — " + name);
    };

    shape.onmouseup = function () {
        shape.style.opacity = "";
        showMessage("mouseup: кнопку відпущено — " + name);
    };

    shape.onclick = function () {
        const on = shape.dataset.marked === "1";
        shape.dataset.marked = on ? "0" : "1";
        shape.style.strokeDasharray = on ? "" : "8 4";
        showMessage("click: " + name + (on ? " — пунктир вимкнено" : " — пунктир увімкнено"));
    };

});

// mousemove над SVG — координати в системі координат малюнка
const svg = document.querySelector("svg");
if (svg) {
    let lastMove = 0;
    svg.onmousemove = function (e) {
        const now = Date.now();
        if (now - lastMove < 400) return; // не засмічуємо журнал
        lastMove = now;
        const pt = svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const p = pt.matrixTransform(svg.getScreenCTM().inverse());
        const coords = document.getElementById("coords");
        if (coords) {
            coords.textContent = "x = " + Math.round(p.x) + ", y = " + Math.round(p.y);
        }
    };

    // подвійний клік по порожньому місці повертає сховані фігури
    svg.ondblclick = function (e) {
        if (e.target === svg) {
            shapes.forEach(function (s) {
                s.style.visibility = "visible";
                s.dataset.hidden = "0";
            });
            showMessage("dblclick: усі фігури знову показано");
        }
    };
}