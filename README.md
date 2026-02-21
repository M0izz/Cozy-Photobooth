# 📸 Cozy Photobooth

A premium, Apple-inspired online photobooth experience built with Next.js. Capture, customize, and share your moments with a cozy and minimal aesthetic.

![Cozy Photobooth](https://img.shields.io/badge/Status-Perfect-brightgreen?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge)

## ✨ Features

- **🎯 Multi-Phase Workflow:** Seamless transition from layout selection to photo capture, and finally to the editing studio.
- **🖼️ Layout Selection:** Choose from various professional layouts (Strips, Polaroid, Collage, Postcard) before you start.
- **🎨 Studio Panel:** 
  - **Stickers & Emojis:** Drag-and-drop your favorite emojis anywhere on your photo.
  - **Doodle Mode:** Freehand drawing directly on your photos with custom brush sizes and colors.
  - **Premium Filters:** Real-time filter engine with adjustable intensity (Warm Vintage, Soft Café, Golden Hour, and more).
  - **Custom Frames:** Select from curated color palettes or pick your own custom frame color.
- **📬 Realistic Postcard:** A dedicated postcard layout with stamps and postmarks that lets you add messages directly on the ruled lines.
- **⚡ Performance:** Optimized for low latency with a custom Canvas-based rendering engine.

## 🚀 Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🛠️ Technical Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **Styling:** CSS Modules (Vanilla CSS)
- **Rendering:** HTML5 Canvas API
- **State Management:** React Hooks
- **Icons:** Lucide React

## 📂 Project Structure

- `/app`: Next.js App Router pages and styles.
- `/lib`: Core engines (FilterEngine, LayoutComposer).
- `/public`: Static assets (if any).

## 📄 License

Created by **M0izz**.
