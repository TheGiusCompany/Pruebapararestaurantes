
const menu = [
  {id:1, name:'Hamburguesa clásica', desc:'Carne 200g, lechuga, queso, salsa especial', price:8.50, img:'assets/dish1.svg'},
  {id:2, name:'Pizza Margarita', desc:'Tomate, mozzarella, albahaca', price:9.75, img:'assets/dish2.svg'},
  {id:3, name:'Ensalada mediterránea', desc:'Mix de hojas, oliva, queso feta', price:7.00, img:'assets/dish3.svg'},
  {id:4, name:'Tacos al pastor', desc:'Tortilla de maíz, cerdo adobado, piña', price:6.50, img:'assets/dish4.svg'}
];

function $(sel){ return document.querySelector(sel); }
function $all(sel){ return document.querySelectorAll(sel); }

/* Render del menú */
function renderMenu(){
  const grid = $('#menu-grid');
  grid.innerHTML = '';
  menu.forEach(it => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${it.img}" alt="${it.name}">
      <div class="card-body">
        <h4>${it.name}</h4>
        <p class="muted">${it.desc}</p>
        <div style="display:flex; gap:8px; align-items:center; margin-top:8px;">
          <strong>\$${it.price.toFixed(2)}</strong>
          <button class="btn add-btn" data-id="${it.id}">Añadir</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
  document.querySelectorAll('.add-btn').forEach(b=>b.addEventListener('click', e=> addToCart(parseInt(e.target.dataset.id))));
}

/* Carrito en localStorage */
function getCart(){ return JSON.parse(localStorage.getItem('lc_cart')||'[]'); }
function saveCart(c){ localStorage.setItem('lc_cart', JSON.stringify(c)); updateCartCount(); }
function updateCartCount(){ const c=getCart(); $('#cart-count').textContent = c.reduce((s,i)=>s+i.qty,0); }

function addToCart(id){
  const item = menu.find(m=>m.id===id);
  if(!item) return;
  const cart = getCart();
  const existing = cart.find(i=>i.id===id);
  if(existing) existing.qty += 1; else cart.push({id:item.id, name:item.name, price:item.price, qty:1});
  saveCart(cart);
  alert('Añadido al carrito: ' + item.name);
}

function openCart(){
  const modal = $('#cart-modal');
  modal.setAttribute('aria-hidden','false');
  renderCartItems();
}
function closeCart(){ $('#cart-modal').setAttribute('aria-hidden','true'); }

function renderCartItems(){
  const container = $('#cart-items');
  const cart = getCart();
  if(cart.length===0){ container.innerHTML='<p>Tu carrito está vacío.</p>'; $('#cart-total').textContent = '0.00'; return; }
  container.innerHTML = '';
  cart.forEach(it=>{
    const div = document.createElement('div');
    div.style.display='flex'; div.style.justifyContent='space-between'; div.style.margin='8px 0';
    div.innerHTML = `<div>${it.name} x ${it.qty}</div><div>\$${(it.price*it.qty).toFixed(2)} <button class="remove" data-id="${it.id}">Eliminar</button></div>`;
    container.appendChild(div);
  });
  document.querySelectorAll('.remove').forEach(b=> b.addEventListener('click', e=>{ removeFromCart(parseInt(e.target.dataset.id)); }));
  const total = cart.reduce((s,i)=> s + i.price * i.qty, 0);
  $('#cart-total').textContent = total.toFixed(2);
}

function removeFromCart(id){
  let cart = getCart();
  cart = cart.filter(i=> i.id !== id);
  saveCart(cart);
  renderCartItems();
}

function checkout(){
  const cart = getCart();
  if(cart.length===0){ alert('El carrito está vacío.'); return; }
  // Simular envío de pedido
  const order = { id: 'ORD' + Date.now(), items: cart, total: cart.reduce((s,i)=>s+i.price*i.qty,0), date: new Date().toISOString() };
  // aquí podrías enviar a servidor via fetch
  localStorage.removeItem('lc_cart');
  updateCartCount();
  closeCart();
  alert('Pedido confirmado! Número: ' + order.id + '\nTotal: $' + order.total.toFixed(2));
  console.log('Pedido (simulado):', order);
}

/* Form contacto */
$('#contact-form').addEventListener('submit', e=>{
  e.preventDefault();
  const name = $('#contact-name').value.trim();
  const msg = $('#contact-message').value.trim();
  if(!name || !msg) { alert('Completa los campos.'); return; }
  alert('Gracias, ' + name + '! Hemos recibido tu mensaje.');
  $('#contact-form').reset();
});

/* Event listeners */
$('#cart-btn').addEventListener('click', openCart);
$('#close-cart').addEventListener('click', closeCart);
$('#checkout-btn').addEventListener('click', checkout);

/* Init */
renderMenu();
updateCartCount();
