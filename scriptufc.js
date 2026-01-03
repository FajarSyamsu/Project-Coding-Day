let keranjang = {};
let itemTerakhir = "";
document.addEventListener('DOMContentLoaded', () => {

    const searchInput = document.querySelector('.search-box input');
    const searchForm = document.querySelector('.search-box');
    const menuItems = document.querySelectorAll('.menu-item');

    // Cek apakah elemen pencarian ada di HTML sebelum dijalankan
    if (searchInput) {
        // Fungsi Filter Menu
        const filterMenu = () => {
    const filter = searchInput.value.toLowerCase();
    let adaYangCocok = false; 

    menuItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(filter)) {
            item.style.display = ""; 
            adaYangCocok = true;
        } else {
            item.style.display = "none"; 
        }
    });
    const notFoundEl = document.getElementById('not-found');
    if (adaYangCocok) {
        notFoundEl.style.display = "none";
    } else {
        notFoundEl.style.display = "block";
    }
};
        // Jalankan saat mengetik
        searchInput.addEventListener('input', filterMenu);

        // Mencegah reload saat tekan Enter
        if (searchForm) {
            searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                filterMenu();
            });
        }
    }

    /* =========================================
          LOGIKA NAVIGASI (MOBILE & SCROLL)
       ========================================= */
    const isMobile = () => window.innerWidth <= 768;

    // Tutup menu saat scroll
    window.addEventListener('scroll', () => {
        document.querySelectorAll('.dropdown-content, .nested-content').forEach(el => {
            el.classList.remove('show-mobile');
        });
    });

    // Logika Klik (Mobile)
    document.addEventListener('click', (e) => {
        if (!isMobile()) return;

        // Klik Menu
        if (e.target.classList.contains('dropbtn')) {
            e.preventDefault();
            const content = e.target.nextElementSibling;
            
            document.querySelectorAll('.dropdown-content').forEach(el => {
                if (el !== content) el.classList.remove('show-mobile');
            });
            content.classList.toggle('show-mobile');
        }

        // Klik Sub menu
        if (e.target.classList.contains('nested-btn')) {
            e.preventDefault();
            e.stopPropagation();
            const nestedContent = e.target.nextElementSibling;
            
            const parentContainer = e.target.closest('.dropdown-content');
            if (parentContainer) {
                parentContainer.querySelectorAll('.nested-content').forEach(el => {
                    if (el !== nestedContent) el.classList.remove('show-mobile');
                });
            }
            nestedContent.classList.toggle('show-mobile');
        }

        // Tutup jika di luar navbar
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown-content, .nested-content').forEach(el => {
                el.classList.remove('show-mobile');
            });
        }
    });
});

/* =========================================
      FUNGSI KIRIM PESAN (DI LUAR DOMContentLoaded)
   ========================================= */
// ---  + FUNGSI KERANJANG ---
function tambahKeKeranjang(nama, harga) {
    console.log("Tombol diklik: " + nama + " Harga: " + harga); // LAPORAN 1
    
    if (keranjang[nama]) {
        keranjang[nama].qty += 1;
    } else {
        keranjang[nama] = { harga: harga, qty: 1 };
    }
    
    console.log("Isi Keranjang Sekarang:", keranjang); // LAPORAN 2
    updateTampilanKeranjang();
}

function updateTampilanKeranjang() {
    const container = document.getElementById('keranjang');
    const countEl = document.getElementById('ker-jumlah');
    const totalEl = document.getElementById('ker-total');
    
    let totalItem = 0;
    let totalHarga = 0;

    for (let item in keranjang) {
        totalItem += keranjang[item].qty;
        totalHarga += keranjang[item].qty * keranjang[item].harga;
    }

    console.log("Total Item: " + totalItem + " Total Harga: " + totalHarga); // LAPORAN 3

    if (totalItem > 0) {
        container.style.display = 'block'; // INI YANG MEMUNCULKAN KERANJANG
        container.classList.add('ker-update');
        setTimeout(() => container.classList.remove('ker-update'), 400);

        countEl.innerText = totalItem;
        totalEl.innerText = 'Rp ' + totalHarga.toLocaleString('id-ID');
    } else {
        container.style.display = 'none';
    }
}
function kurangiDariKeranjang(nama) {
    if (keranjang[nama]) {
        keranjang[nama].qty -= 1; // Kurangi 1
        
        // Jika jumlahnya jadi 0, hapus nama menu tersebut dari daftar
        if (keranjang[nama].qty <= 0) {
            delete keranjang[nama];
        }
    }
    updateTampilanKeranjang();
}
function resetKeranjang() {
    if (confirm("Kosongkan semua pesanan?")) {
        keranjang = {};
        updateTampilanKeranjang();
    }
}
function tambahKeKeranjang(nama, harga) {
    itemTerakhir = nama; // Catat nama menu ini
    if (keranjang[nama]) {
        keranjang[nama].qty += 1;
    } else {
        keranjang[nama] = { harga: harga, qty: 1 };
    }
    updateTampilanKeranjang();
}
function kurangiSatuItem() {
  if (itemTerakhir && keranjang[itemTerakhir]) {
        kurangiDariKeranjang(itemTerakhir);
    } else {
        // Jika item terakhir sudah habis, kurangi apa saja yang ada di daftar
        const keys = Object.keys(keranjang);
        if (keys.length > 0) {
            kurangiDariKeranjang(keys[0]);
        }
    }
  }
function checkoutWA() {
    const nomorWA = "6282174275051";
    let daftarPesanan = "Halo Unida Mart, saya mau pesan:\n";
    let totalHarga = 0;

    for (let item in keranjang) {
        let subTotal = keranjang[item].qty * keranjang[item].harga;
        daftarPesanan += `- ${item} (${keranjang[item].qty}x) = Rp ${subTotal.toLocaleString('id-ID')}\n`;
        totalHarga += subTotal;
    }

    daftarPesanan += `\n*Total Tagihan: Rp ${totalHarga.toLocaleString('id-ID')}*`;
    
    const url = `https://wa.me/${nomorWA}?text=${encodeURIComponent(daftarPesanan)}`;
    window.open(url, '_blank');
}
function cekJamOperasional() {
    const sekarang = new Date();
    const jam = sekarang.getHours();
    const menit = sekarang.getMinutes();
    
    const jamBuka = 6;
    const jamTutup = 24;
    const menitTutup = 30;

    const semuaTombol = document.querySelectorAll('.menu-item button');
    
    let sedangBuka = false;

    // Logika pengecekan
    if (jam > jamBuka && jam < jamTutup) {
        sedangBuka = true;
    } else if (jam === jamBuka) {
        sedangBuka = true;
    } else if (jam === jamTutup && menit < menitTutup) {
        sedangBuka = true;
    }

    if (!sedangBuka) {
        semuaTombol.forEach(btn => {
            btn.innerText = "Tutup";
            btn.style.backgroundColor = "#7a7a7a"; // Warna abu-abu
            btn.style.cursor = "not-allowed";
            btn.disabled = true; 
        });
        console.log("Status: Warung Tutup (Buka kembali jam 06:00)");
    } else {
        console.log("Status: Warung Buka, Selamat Belanja!");
    }
}

window.onload = cekJamOperasional;

