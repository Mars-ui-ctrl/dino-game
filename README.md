# 🦖 Dino Rush - Neon Kinetic

Welcome to **Dino Rush**, a synthwave-inspired, cyberpunk-themed infinite runner game built from scratch as a full-stack web application! 

> I built this project to learn full-stack development, focusing on connecting a dynamic frontend to a secure Node.js backend.

## 🎮 Play the Game
[👉 **Play Dino Rush Here!**] *(Replace this with your deployed Vercel link)*

## ✨ Features
- **Neon Cyberpunk Aesthetic**: Hand-crafted CSS glow effects, dynamic background gradients, and sleek typography.
- **Infinite Runner Mechanics**: Continuously accelerating gameplay with random obstacle generation.
- **Global Leaderboard**: Compete with other racers globally for the top score!
- **User Authentication**: Secure JWT-based login and registration system wrapper.
- **Cross-Platform**: Fully playable on desktop (Spacebar/Up Arrow) and mobile devices (Tap to jump).

## 🛠️ Tech Stack
- **Frontend**: HTML5, Vanilla JavaScript, CSS3, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose) for securely storing user accounts and high scores
- **Security**: `bcryptjs` for password hashing, JWT for session management

## 🚀 Running Locally

If you'd like to run the game on your own machine, follow these steps:

### Prerequisites
- [Node.js](https://nodejs.org/) installed
- A running MongoDB instance or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) URI

### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` folder and add your environment variables:
   ```env
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_key
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. The frontend operates via static files. Open `frontend/index.html` in your web browser or serve it using a Live Server extension (like VSCode's Live Server).
2. Because the code automatically detects if it's running on `localhost`, it will magically bridge to your local Node server!

## 🤝 Contributing
Feel free to fork this project, submit pull requests, or open issues to help improve the game.
