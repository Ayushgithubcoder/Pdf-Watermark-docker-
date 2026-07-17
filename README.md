# PDF Watermarker Microservice Workspace

This repository hosts a secure, production-grade PDF Watermarker microservice. It allows users to upload PDF documents, customize a watermark signature (text, opacity, font size), and download the watermarked PDF instantly.

## Project Structure
```text
.
├── .gitignore
├── README.md
└── pdf-watermarker/
    ├── package.json
    ├── server.js
    ├── Dockerfile
    ├── .dockerignore
    └── public/
        ├── index.html
        └── app.js
```

## Running the Project

### 1. Locally using Node.js
Ensure you have Node.js (version 18+) installed.
```bash
cd pdf-watermarker
npm install
npm start
```
Then open `http://localhost:8999` in your web browser.

### 2. Using Docker
Build and run the container using Docker:
```bash
cd pdf-watermarker
docker build -t pdf-watermarker .
docker run -d -p 8999:8999 --name pdf-watermarker-instance pdf-watermarker
```
Then open `http://localhost:8999` in your web browser.

## Features
- **Modern UI**: Interactive glassmorphic single-page design using Tailwind CSS v3 with drag-and-drop file upload zone.
- **Security Audit**: Docker build runs `npm audit` and executes as a non-privileged `node` user.
- **Health Checks**: Containers include automated Node-based health checks.
- **Clean PDF Processing**: Uses `pdf-lib` to add diagonal watermarks across all pages on the fly without writing temporary files to disk.
