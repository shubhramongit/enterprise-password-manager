# Enterprise Zero-Knowledge Password Manager

A highly secure, full-stack password manager built with the MERN stack (MongoDB, Express, React, Node.js). This application implements a strict Zero-Knowledge Architecture, ensuring that user passwords are encrypted and decrypted locally in the browser's RAM. The server never has access to plaintext passwords or encryption keys.

## 🔐 Cryptographic Architecture
* **Zero-Knowledge Proof:** The backend only stores unreadable AES-256 ciphertext and Initialization Vectors (IV).
* **Key Derivation:** The user's Master Password is run through `PBKDF2` (100,000 iterations) via the Web Crypto API to generate a 512-bit key.
* **Key Splitting:** 
  * The first 256 bits are hashed and sent to the server for authentication.
  * The remaining 256 bits serve as the AES-GCM encryption key and remain strictly in the React Context (RAM).
* **True Randomness:** Passwords and IVs are generated using hardware-backed entropy (`window.crypto.getRandomValues`).

## 🚀 Key Features
* **AES-GCM Encryption:** Military-grade encryption for all stored credentials.
* **Multi-Factor Authentication (MFA):** Speakeasy-powered Time-Based One-Time Passwords (TOTP) integrated with Google Authenticator.
* **Session Management:** Secure JSON Web Tokens (JWT) distributed via Axios interceptors.
* **Brute-Force Protection:** Redis-backed rate limiting on all authentication endpoints.
* **Secure Clipboard API:** One-click copying of decrypted passwords that bypasses persistent storage.

## 🛠️ Tech Stack
* **Frontend:** React.js, Context API, Axios, Web Cryptography API
* **Backend:** Node.js, Express.js, Mongoose, JWT, Speakeasy, Bcrypt.js
* **Database & Caching:** MongoDB, Redis (Dockerized)

## ⚙️ Local Setup

1. **Start the Infrastructure**
   Ensure Docker is running and spin up the Redis container.
   Start your local MongoDB service (IPv4: `127.0.0.1:27017`).

2. **Backend Configuration**
   ```bash
   cd server
   npm install
   npm start

### 1. Frontend Configuration

cd client
npm install
npm start

### 2. Initialize the Git Repository

1. Open a fresh terminal tab in VS Code.
2. Ensure the path is your root directory: `C:\Users\SHUBHRAM\Documents\Enterprise-Password-Manager>`. (If it says `client` or `server`, type `cd ..` to go back).
3. Type these three commands one by one, hitting Enter after each:

git init
git add .
git commit -m "feat: finalized zero-knowledge architecture and added documentation"
