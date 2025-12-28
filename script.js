let data = [];
let editIndex = -1;

let labels = [];
let tI = [];
let tR = [];
let chart;

const LOOP_TEST = 2000; 

function submit() {
    const nama = get("nama");
    const harga = num("harga");
    const qty = num("qty");

    if (!nama || harga <= 0 || qty <= 0) {
        alert("Input tidak valid! Pastikan semua terisi dengan benar.");
        return;
    }

    if (qty > 5000) {
        alert("Jumlah (n) terlalu besar untuk simulasi rekursif. Maksimal 5000 agar browser tidak crash.");
        return;
    }

    if (editIndex === -1) {
        data.push({ nama, harga, qty });
    } else {
        data[editIndex] = { nama, harga, qty };
        editIndex = -1;
        document.getElementById("btn").innerText = "Tambah";
    }

    resetForm();
    render();
}

function render() {
    const tbody = document.getElementById("table");
    tbody.innerHTML = "";

    data.forEach((x, i) => {
        tbody.innerHTML += `
        <tr>
            <td>${i + 1}</td>
            <td>${x.nama}</td>
            <td>${x.harga.toLocaleString()}</td>
            <td>${x.qty}</td>
            <td>${(x.harga * x.qty).toLocaleString()}</td>
            <td>
                <button onclick="edit(${i})">Edit</button>
                <button class="secondary" onclick="hapus(${i})">Hapus</button>
            </td>
        </tr>`;
    });

    if (data.length > 0) {
        benchmark();
    }
}

function algoritmaIteratif(n, harga) {
    let total = 0;
    for (let i = 0; i < n; i++) {
        total += harga;
    }
    return total;
}

function algoritmaRekursif(n, harga) {
    if (n <= 0) return 0;
    return harga + algoritmaRekursif(n - 1, harga);
}


function benchmark() {
    const produkTerakhir = data[data.length - 1];
    const n = produkTerakhir.qty;
    const harga = produkTerakhir.harga;

    algoritmaIteratif(n, harga);
    algoritmaRekursif(n, harga);

    let startI = performance.now();
    for (let i = 0; i < LOOP_TEST; i++) {
        algoritmaIteratif(n, harga);
    }
    let endI = performance.now();
    let timeI = endI - startI;

    let startR = performance.now();
    for (let i = 0; i < LOOP_TEST; i++) {
        algoritmaRekursif(n, harga);
    }
    let endR = performance.now();
    let timeR = endR - startR;

    document.getElementById("totalI").innerText = (n * harga).toLocaleString();
    document.getElementById("totalR").innerText = (n * harga).toLocaleString();
    document.getElementById("timeI").innerText = timeI.toFixed(4);
    document.getElementById("timeR").innerText = timeR.toFixed(4);

    labels.push("n=" + n);
    tI.push(timeI);
    tR.push(timeR);

    draw();
}


function draw() {
    const ctx = document.getElementById("chart").getContext("2d");
    
    if (!chart) {
        chart = new Chart(ctx, {
            type: "line",
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "Iteratif",
                        data: tI,
                        borderColor: "#2563eb",
                        backgroundColor: "#2563eb",
                        tension: 0.2,
                        fill: false
                    },
                    {
                        label: "Rekursif",
                        data: tR,
                        borderColor: "#dc2626",
                        backgroundColor: "#dc2626",
                        tension: 0.2,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: "Waktu Eksekusi (ms)" }
                    },
                    x: {
                        title: { display: true, text: "Jumlah Nilai n (Qty)" }
                    }
                }
            }
        });
    } else {
        chart.update();
    }
}


function get(id) {
    return document.getElementById(id).value;
}

function num(id) {
    return parseInt(document.getElementById(id).value) || 0;
}

function resetForm() {
    ["nama", "harga", "qty"].forEach(id => document.getElementById(id).value = "");
    editIndex = -1;
    document.getElementById("btn").innerText = "Tambah";
}

function edit(i) {
    document.getElementById("nama").value = data[i].nama;
    document.getElementById("harga").value = data[i].harga;
    document.getElementById("qty").value = data[i].qty;
    editIndex = i;
    document.getElementById("btn").innerText = "Simpan";
}

function hapus(i) {
    data.splice(i, 1);
    render();
}