# 🥗 Food Sharing Server

A Node.js backend server for a food-sharing application, using Express, MongoDB, Firebase Admin, and JWT for secure authentication and data access.

## 📦 Project Structure

```

Food-Sharing-server/
├── index.js
├── admin-key.json
├── .env
├── package.json
└── README.md

```

## 🚀 Features

- RESTful API built with **Express.js**
- Uses **MongoDB** for data storage
- Firebase Admin SDK for user authentication
- **JWT** support for protected routes
- CORS enabled for frontend interaction
- Dotenv for environment variable management

## 🛠️ Installation

1. **Install dependencies**:

```bash
npm install
```

2. **Create a `.env` file** in the root directory and add the following:

```
PORT=5001
MONGODB_URI=your_mongodb_connection_string
```

3. **Add your Firebase Admin SDK** key file as `admin-key.json`.

## 📡 Running the Server

Start the development server using:

```bash
npm run dev
```

This will run the server using `nodemon` and listen on the specified `PORT`.

## 📚 Scripts

| Command       | Description           |
| ------------- | --------------------- |
| `npm run dev` | Starts the dev server |

## 📦 Dependencies

- [express](https://www.npmjs.com/package/express)
- [mongodb](https://www.npmjs.com/package/mongodb)
- [firebase-admin](https://www.npmjs.com/package/firebase-admin)
- [cors](https://www.npmjs.com/package/cors)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)

## 🔐 Security Notes

- Make sure not to expose your `admin-key.json` or `.env` file in production or version control.
- Always validate JWTs on protected routes to ensure secure access.

## 🧑‍💻 Author

This project is developed and maintained by **\[Foysal Munsy]**.
