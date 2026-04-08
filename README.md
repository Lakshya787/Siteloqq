# 🚫 Siteloqq — Neumorphic Website Blocker

A modern Chrome extension designed to eliminate distractions and improve focus using a clean **neumorphic (soft UI)** interface. Built for simplicity, speed, and strict control.

---

## 📌 Overview

Siteloqq helps you block distracting websites with a visually stunning monochromatic "cool grey" neumorphic interface. Once a website is blocked, a strict emergency unlock system ensures you stay focused until your goals are completed.

---

## ✨ Features

- 🔒 **Block Any Website:** Lock domains for a specific number of days and hours.
- 🚧 **Strict Enforcement:** Blocked pages are completely restricted by a unified static page. 
- ⌨️ **Emergency Unlock Challenge:** No easy off-switch. Unlocking a site early requires retyping a generated 500-word block of text accurately—copy-pasting is disabled!
- 🎨 **Neumorphic UI:** Experience a premium, tactile interface with dual-shadow depth and modern aesthetics.
- 💾 **Persistent Storage:** Keeps track of expirations locally.
- 🔥 **Lightweight & Fast:** Uses Vite + React for lightning-quick popup rendering.

---

## 🖥️ Installation

### 1. Clone & Build
```bash
git clone https://github.com/Lakshya787/Siteloqq.git
cd siteloqq
npm install
npm run build
```

### 2. Load Extension into Chrome
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **"Developer mode"** (toggle in the top right corner).
3. Click on the **"Load unpacked"** button.
4. Select the `dist` folder located inside your cloned `siteloqq` folder.
5. Pin the extension to your Chrome toolbar for easy access.

---

## 🧠 How To Use

### Adding a Block
1. Click the **Siteloqq** icon in your Chrome toolbar.
2. In the "Domain" field, type the URL you want to block (e.g., `reddit.com`, `instagram.com`).
3. Set your **Block Duration** using the `d` (days) and `h` (hours) fields.
4. Click **Lock**. The site will instantly be locked across all open tabs, and its favicon will appear in your "Active Blocks" list.

### Unlocking a Block (Emergency)
Sometimes you actually need access to a blocked site. To unblock it before the timer naturally expires:
1. Open the **Siteloqq** popup window and find your site in the Active Blocks list.
2. Click the **Unlock** button next to it.
3. You will enter the **Typing Challenge View**. 
4. Type out the exact **500 words** shown on the screen to prove your resolve. The system disables copy/paste, tracking exactly how many words you have successfully entered.
5. Once complete, the site will be unblocked instantly!