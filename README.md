# SkillSwap Server

The **SkillSwap Server** is the backend API service for the [SkillSwap](https://github.com/gaziraihan1/skill-swap-server.git) platform — a community-driven application that enables users to exchange skills with each other. This server is built using **Node.js**, **Express.js**, **MongoDB**, and **Firebase Authentication with JWT** for secure data operations.

---

## 🌐 Live API

- **Base URL:** [https://skill-swap-with-next-server.vercel.app/](https://skill-swap-with-next-server.vercel.app/)

---

## ⚙️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** Firebase Auth with JWT
- **File Upload:** Cloudinary
- **Deployment:** Vercel
- **Security:** CORS, JWT


---

## 🔐 Authentication & Security

- Users authenticate with **Firebase Auth** on the client side.
- Upon successful login/register, a **JWT token** is issued by the backend.
- Protected routes use middleware to verify the JWT.
- Admin-only routes require both valid JWT and `role: admin`.

---

## 📦 API Endpoints

> Full documentation available via Postman or Insomnia (you can export if needed)

### 🔸 Users
- `POST /users` — Create a new user
- `GET /users/:email` — Get user info by email
- `PATCH /users/update/:email` — Update user details

### 🔸 Offers
- `GET /offers` — Get all skill offers
- `POST /offers` — Create a new offer
- `DELETE /offers/:id` — Delete an offer
- `GET /offers/made/:email` — Count of offers made
- `GET /offers/received/:email` — Count of offers received

### 🔸 Requests
- `POST /requests` — Send skill swap request
- `PATCH /requests/accept/:id` — Accept a request
- `PATCH /requests/complete/:id` — Mark request as completed
- `GET /requests/received/:email` — Received requests
- `GET /requests/sent/:email` — Sent requests

### 🔸 Swaps
- `GET /swaps/active/:email` — Active swaps
- `GET /swaps/history/:email` — Completed swaps

### 🔸 Reviews
- `POST /feedbacks` — Submit feedback with optional rating
- `GET /feedbacks` — Get all feedbacks

---

## 🖼️ Cloudinary

Image uploads (like profile or offer images) are handled using **Cloudinary**.

- Upload endpoint: `POST /upload`
- Uses `form-data` with the file key `image`

---

## 🚀 Getting Started Locally

```bash
git clone https://github.com/your-username/skill-swap-server.git
cd skill-swap-server
npm install
```
