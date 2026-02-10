// --- DỮ LIỆU SẢN PHẨM ---
const products = [
    { id: 1, name: "Gấu Bông Bunny", cat: "toy", price: 320000, desc: "Gấu bông thỏ hồng siêu mềm mịn, kích thước 50cm, hàng nhập khẩu.", img: "https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=600&q=80" },
    { id: 2, name: "Máy Ảnh Instax", cat: "fashion", price: 1850000, desc: "Máy ảnh lấy liền màu hồng pastel, tặng kèm film và sticker.", img: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80" },
    { id: 3, name: "Giày Sneaker Pastel", cat: "fashion", price: 550000, desc: "Giày thể thao đế cao, phối màu hồng trắng cực xinh.", img: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80" },
    { id: 4, name: "Tai Nghe Gaming", cat: "fashion", price: 890000, desc: "Tai nghe tai mèo có đèn LED RGB, âm thanh vòm 7.1.", img: "https://images.unsplash.com/photo-1612444530582-fc66183b16f7?auto=format&fit=crop&w=600&q=80" },
    { id: 5, name: "Kính Mát Heart", cat: "fashion", price: 120000, desc: "Kính mát gọng trái tim hot trend, chống tia UV.", img: "https://images.unsplash.com/photo-1582142839970-2b9e04b60f65?auto=format&fit=crop&w=600&q=80" },
    { id: 6, name: "Nến Thơm Decor", cat: "decor", price: 210000, desc: "Nến thơm tinh dầu thiên nhiên, ly thủy tinh hồng.", img: "https://images.unsplash.com/photo-1602523961358-f9f03dd557db?auto=format&fit=crop&w=600&q=80" },
    { id: 7, name: "Bánh Macaron", cat: "decor", price: 85000, desc: "Mô hình bánh Macaron trang trí chụp ảnh.", img: "https://images.unsplash.com/photo-1558326567-98ae2405596b?auto=format&fit=crop&w=600&q=80" },
    { id: 8, name: "Túi Xách Phố", cat: "fashion", price: 450000, desc: "Túi xách da PU cao cấp, form cứng cáp.", img: "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=600&q=80" }
];

// Load giỏ hàng từ LocalStorage
let cart = JSON.parse(localStorage.getItem('kittyCart')) || [];

// --- INIT ---
window.onload = () => {
    setTimeout(() => {
        document.getElementById('loader').style.opacity = '0';
        setTimeout(() => document.getElementById('loader').style.display = 'none', 500);
    }, 1000); // Giả lập loading
    renderProducts('all');
    updateCartUI();
};

// --- RENDER PRODUCTS ---
const productList = document.getElementById('product-list');
function renderProducts(filter) {
    productList.innerHTML = "";
    const filtered = filter === 'all' ? products : products.filter(p => p.cat === filter);
    
    filtered.forEach(p => {
        productList.innerHTML += `
            <div class="pro-card">
                <div class="pro-img-box">
                    <img src="${p.img}" alt="${p.name}">
                    <div class="pro-actions">
                        <button class="action-btn" onclick="openQuickView(${p.id})" title="Xem nhanh"><i class="fas fa-eye"></i></button>
                        <button class="action-btn" onclick="addToCart(${p.id})" title="Thêm vào giỏ"><i class="fas fa-shopping-bag"></i></button>
                    </div>
                </div>
                <div class="pro-details">
                    <div class="pro-cat">${p.cat}</div>
                    <div class="pro-name">${p.name}</div>
                    <div class="pro-price">${p.price.toLocaleString('vi-VN')}đ</div>
                </div>
            </div>
        `;
    });
}

// --- FILTER ---
const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.filter-btn.active').classList.remove('active');
        btn.classList.add('active');
        renderProducts(btn.dataset.filter);
    });
});

// --- CART LOGIC ---
function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existing = cart.find(item => item.id === id);
    if(existing) existing.qty++;
    else cart.push({...product, qty: 1});
    
    saveCart();
    updateCartUI();
    showToast(`Đã thêm ${product.name} vào giỏ!`);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
}

function updateCartUI() {
    const cartItems = document.getElementById('cart-items');
    const badge = document.getElementById('cart-total-badge');
    const sumEl = document.getElementById('cart-sum');
    const checkoutTotal = document.getElementById('checkout-total');
    
    cartItems.innerHTML = "";
    let total = 0, count = 0;
    
    if(cart.length === 0) cartItems.innerHTML = "<p style='text-align:center; color:#999; margin-top:20px'>Giỏ hàng trống trơn...</p>";

    cart.forEach((item, index) => {
        total += item.price * item.qty;
        count += item.qty;
        cartItems.innerHTML += `
            <div class="cart-item">
                <img src="${item.img}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.price.toLocaleString('vi-VN')}đ x ${item.qty}</p>
                </div>
                <i class="fas fa-trash" style="cursor:pointer; color:#ff6b6b" onclick="removeFromCart(${index})"></i>
            </div>
        `;
    });
    
    badge.innerText = `(${count})`;
    sumEl.innerText = total.toLocaleString('vi-VN') + 'đ';
    checkoutTotal.innerText = total.toLocaleString('vi-VN') + 'đ';
}

function saveCart() {
    localStorage.setItem('kittyCart', JSON.stringify(cart));
}

function toggleCart() {
    document.getElementById('cart-modal').classList.toggle('active');
}

// --- QUICK VIEW ---
function openQuickView(id) {
    const p = products.find(p => p.id === id);
    document.getElementById('qv-image').src = p.img;
    document.getElementById('qv-name').innerText = p.name;
    document.getElementById('qv-price').innerText = p.price.toLocaleString('vi-VN') + 'đ';
    document.getElementById('qv-desc').innerText = p.desc;
    document.getElementById('qv-add-btn').onclick = () => addToCart(p.id);
    document.getElementById('quick-view-modal').classList.add('active');
}
function closeQuickView() {
    document.getElementById('quick-view-modal').classList.remove('active');
}

// --- CHECKOUT ---
function openCheckout() {
    if(cart.length === 0) return showToast("Giỏ hàng trống kìa Sen!");
    document.getElementById('cart-modal').classList.remove('active');
    document.getElementById('checkout-modal').classList.add('active');
}
function closeCheckout() {
    document.getElementById('checkout-modal').classList.remove('active');
}
document.getElementById('checkout-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';
    setTimeout(() => {
        alert("Đặt hàng thành công! Cảm ơn Sen nha ❤️");
        cart = [];
        saveCart();
        updateCartUI();
        closeCheckout();
        btn.innerHTML = 'Xác Nhận Đặt Hàng';
    }, 2000);
});

// --- WELCOME & MUSIC ---
const welcome = document.getElementById('welcome-screen');
const music = document.getElementById('bg-music');
document.getElementById('enter-btn').addEventListener('click', () => {
    welcome.style.opacity = '0';
    setTimeout(() => welcome.style.display = 'none', 600);
    music.volume = 0.4;
    music.play().then(() => document.querySelector('.music-widget').classList.add('playing'))
         .catch(() => console.log('Music blocked'));
});

function toggleMusic() {
    if(music.paused) { music.play(); document.querySelector('.music-widget').classList.add('playing'); }
    else { music.pause(); document.querySelector('.music-widget').classList.remove('playing'); }
}

// --- UTILS ---
function showToast(msg) {
    const t = document.getElementById('toast');
    t.innerText = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
}

window.onscroll = () => {
    // Sticky Navbar
    const nav = document.getElementById('navbar');
    if(window.scrollY > 50) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
    
    // Back to top
    const btn = document.querySelector('.back-to-top');
    if(window.scrollY > 300) btn.classList.add('show');
    else btn.classList.remove('show');
};

function scrollToTop() {
    window.scrollTo(0, 0);
}
