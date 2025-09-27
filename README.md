# Food Sharing Server

A backend REST API for managing food donations, donors, and requests.  
Built with **Node.js**, **Express**, **MongoDB**, and **Firebase Authentication**.

**API Hosted:** [food-sharing-server](https://food-sharing-server-seven.vercel.app)  
**Website Using API:** [food-sharing-app](https://food-sharing-e49b8.web.app/)  
**Client-Side Code:** [Food Sharing Client](https://github.com/Foysal-Munsy/Food-Sharing-Client)

---

## Tech Stack

- **Backend:** Node.js + Express
- **Database:** MongoDB
- **Authentication:** Firebase Admin SDK
- **Middleware:** CORS, JSON parsing
- **Development:** Nodemon

---

## Features & Endpoints

### Food Management

- `POST /add-food` → Add new food **(Public)**
- `GET /available-foods?page=&size=` → List available foods with pagination **(Public)**
- `GET /featured-foods` → Get top 6 foods by quantity **(Public)**
- `GET /my-foods` → Get foods added by logged-in donor **(Protected)**
- `PATCH /request/:id` → Request a food item **(Protected)**
- `GET /requested-foods` → Get foods requested by logged-in user **(Protected)**
- `GET /details/:id` → Get food details by ID **(Public)**

### Update & Delete

- `GET /update/:id` → Get food for editing **(Public)**
- `PUT /update/:id` → Update food details **(Public)**
- `DELETE /foods/:id` → Delete a food item **(Public)**

---

## Authentication

- Protected routes require **Firebase JWT token** in request header:

```http
Authorization: Bearer <Firebase-ID-Token>
```
