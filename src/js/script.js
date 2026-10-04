
const text = document.querySelector("#text");
const tambah = document.querySelector("#tambah");
const date = document.querySelector("#date");
const kategori = document.querySelector("#kategori");
const prioritas = document.querySelector("#prioritas");
const semua = document.querySelector("#semua");
const belumSelesai = document.querySelector("#belumSelesai");
const selesai = document.querySelector("#selesai");
const daftarTugas = document.querySelector("#daftarTugas");

let dataTugas = JSON.parse(localStorage.getItem("daftarTugas")) || [];

tambah.addEventListener("click", function(){
    const isiTugas= text.value.trim();
    const isiDeadline = date.value;
    const isiKategori = kategori.value;
    const isiPrioritas = prioritas.value;
    const hariIni = new Date();
    hariIni.setHours(0,0,0,0);
    const tanggalDeadline = new Date(isiDeadline + "T00:00:00");
    if (
        isiTugas === "" ||
        isiDeadline === "" ||
        isiKategori === "" ||
        isiPrioritas === ""
        ) {
        alert("Semua data tugas harus diisi");
        return;
    }if (tanggalDeadline < hariIni) {
        alert("Deadline tidak boleh menggunakan tanggal yang sudah lewat");
        return;
    }
    const tugasBaru = {
        nama: isiTugas,
        deadline: isiDeadline,
        kategori: isiKategori,
        prioritas: isiPrioritas,
        selesai: false
    };

    dataTugas.push(tugasBaru);

    simpanData();
    renderTugas();

    text.value = "";
    date.value = "";
    kategori.value = "";
    prioritas.value = "";
});
        
//filter seleasi

selesai.addEventListener("click", function(){
    const semuaTugas = document.querySelectorAll(".taskCard");
    semuaTugas.forEach(function(task){
        if(task.classList.contains("completed")){
            task.style.display = "block";
        }else{
            task.style.display = "none";
        }
    });
});

//filter belum selesai
belumSelesai.addEventListener("click", function(){
    const semuaTugas = document.querySelectorAll(".taskCard");
    semuaTugas.forEach(function(task){
        if(!task.classList.contains("completed")){
            task.style.display = "block";
        }else{
            task.style.display = "none";
        }
    });
});

//filter semua
semua.addEventListener("click", function() {
    const semuaTugas = document.querySelectorAll(".taskCard");

    semuaTugas.forEach(function(task) {
        task.style.display = "block";
    });
});

//simpan data
function simpanData(){
    localStorage.setItem(
        "daftarTugas",
        JSON.stringify(dataTugas)
    );
}

function renderTugas(){
    daftarTugas.innerHTML = "";
    dataTugas.forEach(function(tugas, index){
        tampilkanTugas(tugas, index);
    });
    updateJumlah();
}

function tampilkanTugas(tugas, index){
    const taskBaru = document.createElement("div");
    taskBaru.classList.add("taskCard");
    if(tugas.selesai === true){
        taskBaru.classList.add("completed");
    }
    const barisTask = document.createElement("div");
    barisTask.classList.add("barisTask");
    const infoBaris = document.createElement("div");
    infoBaris.classList.add("infoBaris");
    //nama tugas
    const namaTugas = document.createElement("h3");
    namaTugas.textContent = tugas.nama;
    //deadline
    const deadlineTugas = document.createElement("p");
    deadlineTugas.textContent = tugas.deadline;
    //kategori
    const namaKategori = document.createElement("p");
    namaKategori.textContent = tugas.kategori;
    //prioritas
    const namaPrioritas = document.createElement("p");
    namaPrioritas.textContent = tugas.prioritas;
    namaPrioritas.classList.add("tagPrioritas");
    if(tugas.prioritas === "mudah"){
        namaPrioritas.classList.add("prioritasMudah");
    }else if(tugas.prioritas === "sedang"){
        namaPrioritas.classList.add("prioritasSedang");
    }else{
        namaPrioritas.classList.add("prioritasSusah");
    }

    //edit
    const tombolEdit = document.createElement("button");
    tombolEdit.textContent = "edit";
    tombolEdit.classList.add("tagEdit");
    tombolEdit.addEventListener("click", function(){
        const formEdit = document.createElement("div");
        formEdit.classList.add("formEdit");

        // input nama
        const inputNama = document.createElement("input");
        inputNama.type = "text";
        inputNama.value = tugas.nama;

        // input deadline
        const inputDeadline = document.createElement("input");
        inputDeadline.type = "date";
        inputDeadline.value = tugas.deadline;

        // pilihan kategori
        const inputKategori = kategori.cloneNode(true);
        inputKategori.removeAttribute("id");
        inputKategori.value = tugas.kategori;

        // pilihan prioritas
        const inputPrioritas = prioritas.cloneNode(true);
        inputPrioritas.removeAttribute("id");
        inputPrioritas.value = tugas.prioritas;

        // tombol simpan
        const tombolSimpan = document.createElement("button");
        tombolSimpan.textContent = "Simpan";

        // tombol batal
        const tombolBatal = document.createElement("button");
        tombolBatal.textContent = "Batal";

        formEdit.append(
            inputNama,
            inputDeadline,
            inputKategori,
            inputPrioritas,
            tombolSimpan,
            tombolBatal
        );

        taskBaru.append(formEdit);
        tombolBatal.addEventListener("click", function(){
            formEdit.remove();
        });

        tombolSimpan.addEventListener("click", function(){

            const namaBaru = inputNama.value.trim();
            const deadlineBaru = inputDeadline.value;
            const kategoriBaru = inputKategori.value;
            const prioritasBaru = inputPrioritas.value;
            const hariIni = new Date();
            hariIni.setHours(0,0,0,0);

            const tanggalBaru = new Date(
                deadlineBaru + "T00:00:00"
            );

            if(tanggalBaru < hariIni){
                alert("Deadline tidak boleh menggunakan tanggal yang sudah lewat");
                return;
            }
            // validasi
            if(
                namaBaru === "" ||
                deadlineBaru === "" ||
                kategoriBaru === "" ||
                prioritasBaru === ""
            ){
                alert("Semua data harus diisi");
                return;
            }

            // update data di array
            dataTugas[index].nama = namaBaru;
            dataTugas[index].deadline = deadlineBaru;
            dataTugas[index].kategori = kategoriBaru;
            dataTugas[index].prioritas = prioritasBaru;

            simpanData();
            renderTugas();
        });
    });

    //checbox
    const cekSelesai = document.createElement("input");
    cekSelesai.type = "checkbox";
    cekSelesai.classList.add("tagCek");
    cekSelesai.checked = tugas.selesai;

    cekSelesai.addEventListener("change", function(){
        dataTugas[index].selesai = cekSelesai.checked;

        simpanData();
        renderTugas();
    });
    //hapus
    const tombolHapus = document.createElement("button");
    tombolHapus.textContent = "hapus";
    tombolHapus.classList.add("tagHapus");

    tombolHapus.addEventListener("click", function(){
    
        const yakinHapus = confirm("yakin ingin menghapus tugas ini?");
        if(yakinHapus){
            dataTugas.splice(index,1);

            simpanData();
            renderTugas();
        }
    });

    barisTask.append(
        namaTugas,
        namaPrioritas,
        tombolEdit,
        tombolHapus,
        cekSelesai
        
    );

    infoBaris.append(
        deadlineTugas,
        namaKategori
    );

    taskBaru.append(
        barisTask,
        infoBaris
    );
    daftarTugas.append(taskBaru);
}


function updateJumlah() {
    const semuaTugas = document.querySelectorAll(".taskCard");
    const tugasSelesai = document.querySelectorAll(".taskCard.completed");

    const jumlahSemua = semuaTugas.length;
    const jumlahSelesai = tugasSelesai.length;
    const jumlahBelum = jumlahSemua - jumlahSelesai;

    semua.textContent = "Semua (" + jumlahSemua + ")";
    belumSelesai.textContent = "Belum Selesai (" + jumlahBelum + ")";
    selesai.textContent = "Selesai (" + jumlahSelesai + ")";
}

renderTugas();

if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
        navigator.serviceWorker.register("/service-worker.js")
            .then(function () {
                console.log("Service Worker terdaftar");
            })
            .catch(function (error) {
                console.log("Service Worker gagal:", error);
            });
    });
}