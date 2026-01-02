const sections = document.querySelectorAll(".section");
const homeLink = document.getElementById("homeLink");
const shopLink = document.getElementById("shopLink");
const cartLink = document.getElementById("cartLink");
const aboutLink = document.getElementById("aboutLink"); // New Link
const helpLink = document.getElementById("helpLink");     // New Link
const profileLink = document.getElementById("profileLink"); // New Link

const shopNow = document.getElementById("shopNow");
const cartNotify = document.getElementById("cartNotify");
const cartCount = document.getElementById("cartCount"); // New element for counter

const shopItemsContainer = document.getElementById("shopItems");
const cartItems = document.getElementById("cartItems");
const buyNowBtn = document.getElementById("buyNowBtn");
const checkoutPopup = document.getElementById("checkoutPopup");
const thankYouPopup = document.getElementById("thankYouPopup");
const closeBtn = document.querySelector(".close");

// Cart array now stores objects: { item: product, quantity: number }
let cart = [];

function showSection(id) {
  sections.forEach(sec => sec.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// Navigation Handlers
homeLink.addEventListener("click", () => showSection("home"));
shopLink.addEventListener("click", () => showSection("shop"));
cartLink.addEventListener("click", () => showSection("cart"));
shopNow.addEventListener("click", () => showSection("shop"));
aboutLink.addEventListener("click", () => showSection("about")); // New Handler
helpLink.addEventListener("click", () => showSection("help"));   // New Handler
profileLink.addEventListener("click", () => showSection("profile")); // New Handler

const shopProducts = [
  { name: "Iron Man Helmet", price: 5000, img: "helmet.png" },
  { name: "Arc Reactor Replica", price: 2500, img: "arc.png" },
  { name: "Iron Man Armor Keychain", price: 300, img: "keychain.png" },
  { name: "Mark 85 Action Figure", price: 4500, img: "mark85.jpg" },
  { name: "Iron Man Hoodie", price: 1200, img: "hoodie.png" },
  { name: "Iron Man Poster", price: 400, img: "poster.jpg" },
  { name: "Iron Man Bust Statue", price: 7000, img: "bust.png" },
  { name: "Tony Stark Glasses", price: 950, img: "sunglasses.png" },
  { name: "Iron Man USB Drive", price: 600, img: "usb.png" },
  { name: "Iron Man Powerbank", price: 1300, img: "powerbank.jpg" },
  { name: "Iron Man Laptop Sleeve", price: 800, img: "laptop_sleeve.jpg" },
  { name: "Iron Man Wallet", price: 650, img: "wallet.jpg" },
  { name: "Iron Man Watch", price: 1800, img: "watch.png" },
  { name: "Iron Man Mousepad", price: 300, img: "mousepad.png" },
  { name: "Iron Man Phone Case", price: 500, img: "case.jpg" },
];

shopProducts.forEach(item => {
  const div = document.createElement("div");
  div.className = "product-card";
  div.innerHTML = `
    <img src="${item.img}" alt="${item.name}">
    <h3>${item.name}</h3>
    <p>₱${item.price.toLocaleString()}</p>
    <button class="add-cart">Add to Cart</button>`;
  div.querySelector(".add-cart").addEventListener("click", e => addToCart(item, e.target));
  shopItemsContainer.appendChild(div);
});

// FEATURE: Cart Counter
function updateCartCount() {
    // Calculate total quantity of items
    const totalQuantity = cart.reduce((sum, cartItem) => sum + cartItem.quantity, 0);
    cartCount.textContent = totalQuantity > 0 ? `(${totalQuantity})` : '';
}

// FEATURE: Quantity Control
function addToCart(item, button) {
    // Check for existing item
    const existingItem = cart.find(cartItem => cartItem.item.name === item.name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        // Add new item with quantity: 1
        cart.push({ item: item, quantity: 1 });
    }

    // Visual Feedback (Temporary button change and notification)
    button.classList.add("added");
    button.textContent = "Added ✓";
    setTimeout(() => {
        button.textContent = "Add to Cart";
        button.classList.remove("added");
    }, 1500);

    cartNotify.style.display = "block";
    setTimeout(() => cartNotify.style.display = "none", 1500);
    
    renderCart();
    updateCartCount();
}

// FEATURE: Remove Item
function removeItem(index) {
    cart.splice(index, 1);
    renderCart();
    updateCartCount();
}

// FEATURE: Total Price, Quantity Display, and Remove Button Render
function renderCart() {
    let total = 0;
    
    // Generate HTML for cart items
    const cartHtml = cart.map((cartItem, index) => {
        const itemTotal = cartItem.item.price * cartItem.quantity;
        total += itemTotal;
        return `
            <div class="product-card cart-item-card">
              <img src="${cartItem.item.img}" alt="${cartItem.item.name}">
              <div class="cart-details">
                  <h3>${cartItem.item.name}</h3>
                  <p>Price: ₱${cartItem.item.price.toLocaleString()} x ${cartItem.quantity}</p>
                  <p class="subtotal-price">Subtotal: ₱${itemTotal.toLocaleString()}</p>
                  <button class="remove-btn" data-index="${index}">Remove</button>
              </div>
            </div>
        `;
    }).join("");

    if (cart.length > 0) {
        cartItems.innerHTML = cartHtml + `
            <div class="cart-summary">
                <h3>TOTAL: ₱${total.toLocaleString()}</h3>
            </div>
        `;
    } else {
        cartItems.innerHTML = "<p class='empty-cart-message'>Your cart is empty. Time to get some new gear, genius!</p>";
    }

    // Attach event listeners for remove buttons dynamically
    document.querySelectorAll(".remove-btn").forEach(button => {
        button.addEventListener("click", (e) => {
            const index = e.target.getAttribute("data-index");
            removeItem(parseInt(index));
        });
    });
}

// Initial render/setup when the script loads
renderCart();
updateCartCount();

buyNowBtn.addEventListener("click", () => {
  if (cart.length === 0) return alert("Your cart is empty! Add some collectibles before checking out.");
  checkoutPopup.style.display = "flex";
});

closeBtn.addEventListener("click", () => checkoutPopup.style.display = "none");

// work.js

// --- New Profile Editing Logic ---
const profileInputs = document.querySelectorAll("#profileForm input");
const editProfileBtn = document.getElementById("editProfileBtn");
const saveProfileBtn = document.getElementById("saveProfileBtn");
const cancelProfileBtn = document.getElementById("cancelProfileBtn");
const profileForm = document.getElementById("profileForm");

let originalProfileValues = {};

// 1. Function to switch between view and edit modes
function toggleEditMode(isEditing) {
    profileInputs.forEach(input => {
        // Toggle the 'readonly' attribute
        input.readOnly = !isEditing;
        // Apply/remove a visual class (e.g., to change background color)
        input.classList.toggle('editable', isEditing);
    });

    editProfileBtn.style.display = isEditing ? 'none' : 'block';
    saveProfileBtn.style.display = isEditing ? 'block' : 'none';
    cancelProfileBtn.style.display = isEditing ? 'block' : 'none';
}

// 2. Handle 'Edit Details' click
editProfileBtn.addEventListener('click', () => {
    // Store current values before editing starts (for 'Cancel' functionality)
    profileInputs.forEach(input => {
        originalProfileValues[input.id] = input.value;
    });
    toggleEditMode(true);
});

// 3. Handle 'Cancel' click
cancelProfileBtn.addEventListener('click', () => {
    // Restore original values
    profileInputs.forEach(input => {
        input.value = originalProfileValues[input.id];
    });
    toggleEditMode(false);
});

// 4. Handle 'Save Changes' submit
profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // In a real application, you would send this data to a server here.

    alert("Profile Updated Successfully!"); // Confirmation feedback
    toggleEditMode(false);
});

// Initial setup to ensure inputs are non-editable at load
toggleEditMode(false);

// Checkout Logic
document.getElementById("checkoutForm").addEventListener("submit", e => {
  e.preventDefault();
  checkoutPopup.style.display = "none";
  thankYouPopup.style.display = "flex";
  
  // Clear cart after successful checkout
  cart = [];
  renderCart();
  updateCartCount();
  
  // Hide thank you popup after delay
  setTimeout(() => thankYouPopup.style.display = "none", 3000);
});

// Placeholder functionality for Edit Details button in Profile
document.querySelector("#profile .cta-btn").addEventListener('click', () => {
    alert("Functionality to edit profile details is under development. Thank you for your patience!");

});
