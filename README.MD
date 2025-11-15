# 📄 Content Analyzer & Text Extractor Service

## ✨ Project Overview

This application is a specialized service for performing secure, non-persistent text extraction from uploaded files (PDFs, images). It is built on a **MERN (MongoDB-less MERN)** stack, utilizing a deployment-friendly, in-memory processing architecture.

### Key Features

* **🔒 Secure In-Memory Processing:** Files are handled exclusively in the server's RAM using `multer.memoryStorage()`. No files are written to the local disk, ensuring immediate cleanup via Node.js's garbage collector and full compatibility with ephemeral cloud environments.

* **📚 Multi-Format Extraction:** Supports text extraction from:
    * **PDFs** (via `pdf-parse`)
    * **Images** (JPG, PNG) using OCR powered by `Tesseract.js` and `sharp` image preprocessing.

* **💻 MERN Stack:** Built with **R**eact for the frontend user interface and **N**ode/**E**xpress for the backend processing API.

## 🔗 Live Application URLs 

The application is deployed with a robust split-deployment strategy:

| Component | Platform | URL |
| :--- | :--- | :--- |
| **Frontend UI** | Vercel | <https://content-analyzer-nyle.vercel.app> |
| **Backend API** | Render | <https://content-analyzer-1.onrender.com> |

## ⚙️ Local Development Setup

The project uses a standard monorepo structure with `/client` (React) and `/server` (Node/Express).

### Prerequisites

* Node.js (v18+)

* npm or yarn

* Tesseract OCR installed locally (or correctly linked within your environment).

### Installation and Run Steps

1.  **Clone the Repository:**

    ```bash
    git clone [<https://github.com/Uttam-57/Content-Analyzer.git>]
    cd content-analyzer
    ```

2.  **Install Backend Dependencies:**

    ```bash
    cd server
    npm install
    ```

3.  **Install Frontend Dependencies:**

    ```bash
    cd ../client
    npm install
    ```

4.  **Start Backend API (Terminal 1):**

    ```bash
    cd .. 
    npm run dev-server # Use your package.json script to start the Node server
    ```

5.  **Start Frontend UI (Terminal 2):**

    ```bash
    cd client
    npm start
    ```

The application will run locally on `http://localhost:4000`.

## ✍️ Brief Write-up of Approach

The Content Analyzer utilizes the MERN stack to provide an efficient, non-persistent text extraction service. The architectural solution for cloud deployment centered on replacing disk-based file handling with **`multer.memoryStorage()`**. This technique ensures that uploaded files are held solely as a `Buffer` in the Node.js server's RAM. The backend controller passes this buffer directly to extraction libraries (`pdf-parse`, `Tesseract.js/sharp`), thereby eliminating all disk I/O and manual file cleanup. This approach ensures guaranteed data deletion upon request completion, high performance, and seamless compatibility with ephemeral hosting environments like Render and Vercel.

## © Author & Copyright

Copyright (c) 2025 **Uttam Santoki**

All rights reserved.
```eof