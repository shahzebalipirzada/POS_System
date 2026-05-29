# SwiftPOS — Offline Point of Sale (POS) System

SwiftPOS is a modern offline-first Point of Sale (POS) web application built using React, Vite, Tailwind CSS, and IndexedDB. It is designed to work completely offline while providing fast billing, receipt generation, inventory management, and transaction storage.

The project aims to simulate a real-world POS system used in retail stores, supermarkets, and small businesses.

---

# 🚀 Features

## 🛒 Billing / POS System

* Add products to cart
* Quantity adjustment
* Automatic subtotal and total calculation
* Discount support
* Tax calculation
* Hold and resume bills

---

## 📦 Product Management

* Add new products
* Edit existing products
* Delete products
* Product categories
* SKU / barcode support
* Stock quantity management

---

## 🧾 Receipt Generation

* Formatted printable receipts
* Invoice number generation
* Date and time display
* Thermal printer-friendly layout
* Browser print support

---

## 💾 Offline Storage

* Fully offline functionality
* Data stored locally using IndexedDB
* No internet required after first load

---

## 📊 Dashboard & Reports

* Daily sales overview
* Revenue tracking
* Transaction history
* Top-selling products

---

## ⚡ Progressive Web App (PWA)

* Installable like a desktop/mobile app
* Offline caching support
* Fast loading experience

---

# 🛠️ Tech Stack

## Frontend

* React
* Vite
* Tailwind CSS

## Offline Database

* IndexedDB
* Dexie.js

## Utilities

* React Router DOM
* UUID
* Day.js

---

# 📂 Project Structure

```bash
src/
│
├── components/
├── pages/
├── services/
├── database/
├── hooks/
├── utils/
├── styles/
└── App.jsx
```

---

# ⚙️ Installation

## 1. Clone Repository

```bash
git clone https://github.com/shahzebalipirzada/POS_System.git
cd POS_System
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Run Development Server

```bash
npm run dev
```

---

# 🔥 Requirements

Make sure you have installed:

* Node.js v20.19+ or v22+
* npm

Check versions:

```bash
node -v
npm -v
```

---

# 🖨️ Receipt Printing

The application supports browser-based receipt printing using optimized print styles.

Future improvements may include:

* ESC/POS thermal printer support
* PDF export
* Bluetooth printer integration

---

# 📌 Future Improvements

* Multi-user authentication
* Cloud synchronization
* Barcode scanner integration
* Sales analytics
* Customer management
* Supplier management
* Backup & restore system
* Electron desktop application

---

# 🤝 Contribution

Contributions, issues, and feature requests are welcome.

Feel free to fork the repository and submit pull requests.

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

Shahzeb Ali

GitHub:
https://github.com/shahzebalipirzada
