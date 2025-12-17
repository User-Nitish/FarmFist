# FarmFist - Digital Farm Management Portal

A comprehensive MERN stack web application for implementing Biosecurity measures in Pig and Poultry Farms. Features AI-powered insights, real-time monitoring, and complete farm management capabilities.

## 🌟 Features

- **User Authentication**: Secure login/registration system
- **Farm Management**: Complete CRUD operations for farm records
- **Biosecurity Inspections**: Schedule and track farm inspections
- **AI-Powered Insights**: Gemini API integration for intelligent recommendations
- **Real-time Dashboard**: Overview of farm operations and compliance
- **Responsive Design**: Mobile-first approach with green theme
- **Data Persistence**: All data stored in MongoDB with proper relationships

## 🛠 Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Google Gemini API** for AI insights

### Frontend
- **React 18** with TypeScript
- **React Router** for navigation
- **Bootstrap 5** with custom styling
- **Axios** for API calls
- **Context API** for state management

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd farmfist
   ```

2. **Backend Setup**

   ```bash
   cd server
   npm install
   ```

   Create a `.env` file in the server directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/farmfist
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
   GEMINI_API_KEY=AIzaSyDYyK5Iuk6PKMgHtkdJ69vi8QBa2DW-iGk
   PORT=5000
   ```

   Start the backend server:
   ```bash
   npm run dev  # Development mode with nodemon
   # or
   npm start    # Production mode
   ```

3. **Frontend Setup**

   ```bash
   cd ../client
   npm install
   npm start
   ```

4. **Database Setup**

   - Install MongoDB Compass locally
   - Connect to `mongodb://localhost:27017/farmfist`
   - The application will automatically create collections when you start using it

## 📁 Project Structure

```
farmfist/
├── server/                 # Backend (Express.js)
│   ├── config/            # Configuration files
│   ├── middleware/        # Custom middleware
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── server.js         # Main server file
│   └── package.json
├── client/                # Frontend (React)
│   ├── public/           # Static files
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── context/      # React Context
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── App.tsx       # Main App component
│   │   └── index.tsx     # React entry point
│   └── package.json
└── README.md
```

## 🔐 Authentication

The app uses JWT (JSON Web Tokens) for authentication. User roles include:
- **Farmer**: Basic farm management access
- **Inspector**: Can perform inspections and generate reports
- **Admin**: Full system access

## 🎨 UI Design Features

### Color Scheme
- **Primary**: #2e7d32 (Dark Green)
- **Secondary**: #4caf50 (Light Green)
- **Background**: Light gray (#f5f5f5)
- **Text**: Dark gray (#333)

### Typography
- **Main Font**: Poppins/Roboto (Google Fonts)
- **Weights**: 300 (body), 500 (headings), 600 (buttons)

### Animations & Interactions
- Fade-in animations on page load
- Hover effects on buttons and cards
- Ripple effects on button clicks
- Smooth transitions between states
- Loading spinners and progress indicators

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Farms
- `GET /api/farms` - Get user's farms
- `POST /api/farms` - Create new farm
- `PUT /api/farms/:id` - Update farm
- `DELETE /api/farms/:id` - Delete farm

### Inspections
- `GET /api/inspections` - Get inspections
- `POST /api/inspections` - Create inspection
- `PUT /api/inspections/:id` - Update inspection
- `DELETE /api/inspections/:id` - Delete inspection

### Reports
- `GET /api/reports` - Get reports
- `POST /api/reports` - Create report
- `PUT /api/reports/:id` - Update report
- `DELETE /api/reports/:id` - Delete report

### Gemini AI
- `POST /api/gemini/biosecurity-insights/:farmId` - Get biosecurity insights
- `POST /api/gemini/health-insights/:farmId` - Get health analysis
- `POST /api/gemini/climate-insights/:farmId` - Get climate impact analysis
- `POST /api/gemini/comprehensive-report/:farmId` - Generate full report
- `POST /api/gemini/anomaly-detection/:farmId` - Detect potential issues

## 🚀 Deployment

### Backend Deployment
```bash
cd server
npm run build
npm start
```

### Frontend Deployment
```bash
cd client
npm run build
# Serve the build folder with any static server
```

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_secure_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 📞 Support

For support or questions, please contact the development team.

## 🔄 Future Enhancements

- [ ] Real-time notifications
- [ ] Mobile app version
- [ ] Advanced analytics dashboard
- [ ] Integration with IoT sensors
- [ ] Multi-language support
- [ ] Offline functionality
- [ ] API documentation with Swagger

---

**FarmFist** - Revolutionizing farm management with technology and AI-powered insights.
