# RideSphere

RideSphere is a **ride-sharing platform** designed for students to conveniently pool transport (bike/car) between home and college. It enables users to **offer rides as drivers** and **book rides as passengers**, ensuring a cost-effective and efficient commuting experience.

---

## 📌 Key Features

### 🚘 **Ride Posting (For Drivers)**
- Choose **pickup & drop-off locations**
- Preview **route before posting**
- Set **date, time, vehicle type, and available seats**
- **Fare calculation** at ₹3 per km (customizable by driver)
- **Ride status tracking** (`pending`, `booked`, `started`, `completed`)

### 🚖 **Ride Searching & Booking (For Passengers)**
- Enter **pickup & drop-off locations** to find rides
- Finds rides with **departure time after the current time**
- Supports **exact & nearby location matches**
- Allows **one seat per booking**
- View **booking details & status** in "My Bookings"

### 📂 **Ride & Booking Management**
- **My Rides:** Manage rides you have posted
- **My Bookings:** Track booked rides

### 🏠 **Enhanced User Experience**
- **Redesigned Home Screen** with seamless navigation
- **Side Menu & Notification Button** for quick access
- **Modern UI** with `#008955` as the primary theme color
- **Secure authentication** using Redux state management

---

## 🛠️ Tech Stack

### **Frontend:**
- React Native (Expo)
- Redux Toolkit (State Management)
- AsyncStorage (Local Storage)
- Mapbox GL (Route Visualization)
- React Navigation (Navigation)

### **Backend:**
- Node.js (Express.js)
- MongoDB (NoSQL Database)
- JWT Authentication

### **Additional Dependencies:**
- Axios (API Requests)
- React Native Vector Icons (UI Icons)

---

## 🚀 Installation & Setup

### 1️⃣ **Clone the Repository**
```bash
git clone https://github.com/yourusername/RideSphere.git
cd RideSphere
```

### 2️⃣ **Install Dependencies**
#### 📌 Frontend Setup (React Native):
```bash
cd frontend
npm install
expo start
```

#### 📌 Backend Setup (Node.js & Express):
```bash
cd backend
npm install
node server.js
```

### 3️⃣ **Environment Configuration**
Create a `.env` file in both `frontend` and `backend` directories and specify necessary API keys & credentials.

---

## 📜 API Endpoints

### 🔹 **Ride Management**
- `POST /rides` → Create a new ride
- `GET /rides` → Fetch available rides
- `PUT /rides/:id` → Update ride details
- `DELETE /rides/:id` → Delete a ride

### 🔹 **Booking System**
- `POST /rides/:id/book` → Book a ride
- `GET /bookings` → Retrieve user bookings

### 🔹 **User Authentication**
- `POST /auth/signup` → Register a new user
- `POST /auth/login` → Authenticate user login

---

## 🚀 Future Enhancements (v2 Roadmap)
✅ **Real-time seat availability updates**  
✅ **In-app notifications for ride updates**  
✅ **Seamless payment integration** for cashless bookings  
✅ **Performance optimizations & UI improvements**

---

## 🤝 Contributing
We welcome contributions! Follow these steps to contribute:
1. **Fork** the repository
2. **Create a new branch** (`git checkout -b feature-branch`)
3. **Commit your changes** (`git commit -m 'Add new feature'`)
4. **Push your branch** (`git push origin feature-branch`)
5. **Open a Pull Request** for review

---


🚀 **RideSphere - Making Student Commutes Smarter & Easier!**

## 📜 License  
RideSphere is open-source software licensed under the GNU General Public License v3.0.See the LICENSE file for more details.

