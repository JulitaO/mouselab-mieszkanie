const matrixData = {
    A: {
        Cena: "585 000 zł",
        "Odległość od centrum": "Blisko centrum",
        "Metraż": "55 m²",
        "Rynek": "Wtórny",
        "Stan techniczny": "Do remontu",
        "Dostęp do komunikacji": "Dobra"
    },
    B: {
        Cena: "598 000 zł",
        "Odległość od centrum": "Daleko od centrum",
        "Metraż": "50 m²",
        "Rynek": "Pierwotny",
        "Stan techniczny": "Do wykończenia",
        "Dostęp do komunikacji": "Bardzo dobra"
    },
    C: {
        Cena: "555 000 zł",
        "Odległość od centrum": "Blisko centrum",
        "Metraż": "50 m²",
        "Rynek": "Wtórny",
        "Stan techniczny": "Po remoncie",
        "Dostęp do komunikacji": "Ograniczona"
    }
};

let startTime = Date.now();
let clicks = 0;
let sequence = [];

window.onload = () => {
    const table = document.getElementById("matrix");
    const attrs = Object.keys(matrixData.A);
    const rows = ["A", "B", "C"];

    const header = document.createElement("tr");
    header.innerHTML = "<th></th>" + attrs.map(a => `<th>${a}</th>`).join("");
    table.appendChild(header);

    rows.forEach(row => {
        const tr = document.createElement("tr");

        const th = document.createElement("th");
        th.textContent = `Mieszkanie ${row}`;
        tr.appendChild(th);

        attrs.forEach(attr => {
            const td = document.createElement("td");
            td.classList.add("hidden");
            td.textContent = "?";
            td.dataset.value = matrixData[row][attr];

            let hoverStart = null;

            td.onclick = function () {
                if (this.classList.contains("hidden")) {
                    this.textContent = this.dataset.value;
                    this.classList.remove("hidden");
                    clicks++;

                    hoverStart = Date.now();

                    this.addEventListener("mouseleave", function handleLeave() {
                        const hoverDuration = ((Date.now() - hoverStart) / 1000).toFixed(2);
                        sequence.push(`${row}:${attr}:${hoverDuration}s`);

                        this.textContent = "?";
                        this.classList.add("hidden");

                        this.removeEventListener("mouseleave", handleLeave);
                    }, { once: true });
                }
            };

            tr.appendChild(td);
        });

        table.appendChild(tr);
    });
};

function submitData() {
    const choice = document.getElementById("choice").value;
    if (!choice) {
        document.getElementById("status").textContent = "Wybierz ofertę przed zatwierdzeniem.";
        return;
    }

    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    const payload = {
        time: timeTaken,
        clicks: clicks,
        sequence: sequence,
        choice: choice
    };

    fetch("https://script.google.com/macros/s/AKfycby05Wmu7foP4mrzKEBhpHV8t-TBEt5Bf_WwFtzjoie5hOJpa6gYO5PoX_4bNLWD32NAJQ/exec", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(res => {
