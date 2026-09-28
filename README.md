# 📚 Book Haven - Professional Bookstore Website

## Project Structure
```
bookstore/
├── index.html              ← Homepage
├── products.html           ← All Books / Shop Page
├── cart.html               ← Shopping Cart
├── checkout.html           ← Checkout Form
├── order-success.html      ← Order Confirmation
├── supabase-setup.sql      ← Database Setup (run this first!)
├── css/
│   ├── style.css           ← Main Stylesheet
│   └── admin.css           ← Admin Panel Stylesheet
├── js/
│   ├── supabase-config.js  ← API Keys & Config
│   ├── main.js             ← Main JS (cart, products)
│   ├── cart.js             ← Cart Page Logic
│   └── checkout.js         ← Checkout & Order Logic
└── admin/
    ├── index.html          ← Admin Login
    ├── dashboard.html      ← Admin Dashboard
    ├── products.html       ← Manage Books (Add/Edit/Delete)
    └── orders.html         ← Manage Orders
```

---

## ✅ Setup Steps

### Step 1: Setup Supabase Database
1. Go to [https://supabase.com/dashboard/project/oufwwythfrmpyudqbcdt/sql](https://supabase.com/dashboard/project/oufwwythfrmpyudqbcdt/sql)
2. Open `supabase-setup.sql` file
3. Copy all SQL content and paste in SQL Editor
4. Click **Run** ✅

### Step 2: Create Admin Account
1. Go to [Authentication → Users](https://supabase.com/dashboard/project/oufwwythfrmpyudqbcdt/auth/users)
2. Click **"Invite User"** or **"Add User"**
3. Enter your admin email and password
4. Use these credentials to login at `admin/index.html`

### Step 3: Open Website
- Just open `index.html` in your browser — **No server needed!**
- Or use VS Code Live Server extension

---

## 🎯 Features

### 🛍️ Customer Store
| Feature | Description |
|---------|-------------|
| Homepage | Hero banner, categories, featured books |
| Products Page | Browse all books with filters |
| Search | Search by title/author |
| Category Filter | Filter by Fiction, Religion, Science, etc. |
| Sort | Price Low-High, High-Low, Newest |
| Quick View | Popup preview without leaving page |
| Cart | Add/remove/update quantities |
| Checkout | Customer details + delivery address |
| Payment Options | Cash on Delivery, Bank Transfer, EasyPaisa |
| Order Success | Confirmation with order ID |

### 🔐 Admin Panel
| Feature | Description |
|---------|-------------|
| Secure Login | Supabase Auth - email/password |
| Dashboard | Stats: books, orders, revenue |
| Add Books | Title, author, price, stock, image, description |
| Edit Books | Update any book details |
| Delete Books | Remove books from store |
| Toggle Active | Show/hide books without deleting |
| Mark Featured | Highlight as bestseller |
| View Orders | All orders with customer details |
| Order Details | Full order with items and totals |
| Update Status | Pending → Confirmed → Shipped → Delivered |
| Filter Orders | By status: pending, shipped, delivered, etc. |
| Low Stock Alert | Dashboard shows books with ≤5 stock |

---

## 💡 How to Add Books
1. Go to `admin/index.html`
2. Login with your admin email/password
3. Click **"Books / Products"** in sidebar
4. Click **"➕ Add New Book"** button
5. Fill in: Title, Author, Category, Price, Stock
6. (Optional) Add cover image URL, description
7. Check "Featured" if it's a bestseller
8. Click **"💾 Save Book"**

---

## 🛒 How Orders Work
1. Customer browses books on `products.html`
2. Adds to cart → goes to `cart.html`
3. Proceeds to `checkout.html`
4. Fills name, phone, address, city, payment method
5. Clicks **"Place Order"** → saved to Supabase
6. Admin sees order in `admin/orders.html`
7. Admin updates status: Pending → Processing → Shipped → Delivered

---

## 📞 Contact Info (Update in HTML files)
- Phone: `0300-1234567`
- Email: `info@bookhaven.pk`
- City: `Karachi, Pakistan`
