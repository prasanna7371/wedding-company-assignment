# Organization Management System - The Wedding Company 

A professional full-stack multi-tenant organization management system with complete CRUD operations and JWT authentication.

##  Live Demo

- **Frontend**: https://wedding-company-assignment-swart.vercel.app/
- **Backend API**: https://org-management-api.onrender.com
- **API Health Check**: https://org-management-api.onrender.com/health


## Features

- Create organizations with admin accounts
-  Secure JWT-based authentication
- Search organizations by name
-  Update organization admin credentials
- Delete organizations (with authentication)
-  Dynamic MongoDB collection per organization
-  Professional UI with smooth animations
-  Complete error handling
-  Responsive design

##  Tech Stack



### Backend
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB (multi-tenant architecture)
- **Authentication**: JSON Web Tokens (JWT)
- **Security**: bcrypt password hashing
- **Validation**: Express validators

### Frontend
- **Framework**: React 18
- **Styling**: Custom CSS with gradients
- **State Management**: React Hooks
- **HTTP Client**: Fetch API

##  API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/health` | Health check | No |
| POST | `/org/create` | Create organization | No |
| GET | `/org/get/:name` | Get organization | No |
| PUT | `/org/update/:name` | Update organization | No |
| DELETE | `/org/delete/:name` | Delete organization | Yes |
| POST | `/admin/login` | Admin login | No |

##  Architecture

The system implements a **multi-tenant architecture** where:
- Each organization gets its own isolated MongoDB collection
- Single application instance serves all organizations
- Complete data isolation between tenants
- Scalable design for growth

##  Local Development

### Prerequisites
- Node.js v14 or higher
- MongoDB running locally
- npm or yarn

### Backend Setup
```bash
# Clone repository
git clone https://github.com/prasanna7371/wedding-company-assignment
cd wedding-company-assignment

# Install dependencies
npm install

# Create .env file
echo "PORT=5001
MONGODB_URI=mongodb://localhost:27017/master_db
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
NODE_ENV=development" > .env

# Start server
npm run dev
```

### Frontend Setup
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```
 COMPLETE FILE STRUCTURE
 
wedding-company-assignment/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── organizationController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── Admin.js
│   │   └── Organization.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── organizationRoutes.js
│   ├── app.js
│   └── server.js
├── .env
├── .gitignore
├── package.json
└── README.md


##  Testing Guide

### 1. Create Organization
- Navigate to "Create" tab
- Fill in organization name, email, password
- Submit form

### 2. Login
- Navigate to "Login" tab
- Use credentials from step 1
- Receive JWT token

### 3. Search
- Navigate to "Search" tab
- Enter organization name
- View details

### 4. Update
- Navigate to "Update" tab
- Enter organization name
- Provide new email/password
- Submit

### 5. Delete
- Ensure you're logged in
- Navigate to "Delete" tab
- Enter organization name
- Confirm deletion

##  Security Features

- Password hashing with bcrypt (12 rounds)
- JWT token-based authentication
- Protected delete endpoint
- Input validation and sanitization
- CORS configuration
- Environment variable protection

## Database Schema

### Organization Collection
```javascript
{
  organization_name: String (unique),
  collection_name: String,
  admin_user_id: ObjectId,
  connection_details: {
    database_name: String,
    created_at: Date
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Admin Collection
```javascript
{
  email: String (unique),
  password: String (hashed),
  organization_id: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

##  Deployment

### Backend (Render)
- Automatic deployment from GitHub
- Environment variables configured
- MongoDB Atlas cloud database

### Frontend (Vercel)
- Static site deployment
- Environment variables for API URL
- Automatic HTTPS

##  Future Enhancements

- Role-based access control (RBAC)
- Organization member management
- Activity logging and audit trails
- Rate limiting
- API documentation with Swagger
- Unit and integration tests
- Email verification
- Password reset functionality

##  Developer

Built as part of The Wedding Company backend developer internship assignment.


---

##  Final Submission Package

### What I Have Now:

1. ✅ **Fully working backend** with all 5 endpoints
2. ✅ ** frontend** with all features **
3. ✅ **Live deployment** with public URLs
4. ✅ **Complete documentation**
5. ✅ **Clean GitHub repository**


Dear Hiring Team,

I've completed the Organization Management System assignment. Here are the details:

🌐 Live Application: https://wedding-company-assignment-swart.vercel.app/
🔗 GitHub Repository: https://github.com/prasanna7371/wedding-company-assignment
📡 API Documentation: Available in README.md

The system includes:
✅ Complete CRUD operations
✅ JWT authentication
✅ Multi-tenant architecture
✅ Professional UI/UX
✅ Comprehensive error handling
✅ Production deployment

All features are fully functional and tested. Please feel free to create, update, and delete organizations using the live demo.

Looking forward to discussing the implementation. I would very much like to be a part of your organisation. 

Much Appreciated.

Best regards,
Prasanna Kumar K
