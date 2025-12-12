# Organization Management Service

A multi-tenant backend service for managing organizations with dynamic MongoDB collections and JWT authentication.

## 🚀 Features

- Multi-tenant architecture with dynamic collection creation
- RESTful API design
- JWT-based authentication
- Secure password hashing with bcrypt
- MongoDB as the database
- Clean, modular code structure

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd org-management-service
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/master_db
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d
NODE_ENV=development
```

4. **Start MongoDB**

Make sure MongoDB is running on your machine:
```bash
# macOS (if installed via Homebrew)
brew services start mongodb-community

# Or run manually
mongod --dbpath /path/to/your/data/directory
```

## 🏃 Running the Application

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## 📡 API Endpoints

### 1. Create Organization
**POST** `/org/create`

**Request Body:**
```json
{
  "organization_name": "tech_corp",
  "email": "admin@techcorp.com",
  "password": "securepass123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Organization created successfully",
  "data": {
    "organization_id": "6472b8f9c8d4e5a6b7c8d9e0",
    "organization_name": "tech_corp",
    "collection_name": "org_tech_corp",
    "admin_email": "admin@techcorp.com",
    "created_at": "2024-12-11T10:30:00.000Z"
  }
}
```

### 2. Get Organization by Name
**GET** `/org/get/:organization_name`

**Response:**
```json
{
  "success": true,
  "data": {
    "organization_id": "6472b8f9c8d4e5a6b7c8d9e0",
    "organization_name": "tech_corp",
    "collection_name": "org_tech_corp",
    "admin_email": "admin@techcorp.com",
    "created_at": "2024-12-11T10:30:00.000Z"
  }
}
```

### 3. Update Organization
**PUT** `/org/update/:organization_name`

**Request Body:**
```json
{
  "email": "newemail@techcorp.com",
  "password": "newsecurepass456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Organization updated successfully",
  "data": {
    "organization_name": "tech_corp",
    "updated_at": "2024-12-11T11:00:00.000Z"
  }
}
```

### 4. Delete Organization
**DELETE** `/org/delete/:organization_name`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Organization deleted successfully"
}
```

### 5. Admin Login
**POST** `/admin/login`

**Request Body:**
```json
{
  "email": "admin@techcorp.com",
  "password": "securepass123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "6472b8f9c8d4e5a6b7c8d9e1",
    "email": "admin@techcorp.com",
    "organization_id": "6472b8f9c8d4e5a6b7c8d9e0",
    "organization_name": "tech_corp"
  }
}
```

## 🧪 Testing the API

You can test the API using:

1. **cURL**
```bash
# Create organization
curl -X POST http://localhost:5000/org/create \
  -H "Content-Type: application/json" \
  -d '{"organization_name":"test_org","email":"admin@test.com","password":"pass123"}'

# Login
curl -X POST http://localhost:5000/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"pass123"}'
```

2. **Postman** - Import the endpoints and test them interactively

3. **Thunder Client** (VS Code extension) - Great for quick testing

## 🏗️ Project Structure

```
org-management-service/
├── src/
│   ├── config/
│   │   └── database.js          # Database configuration
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   └── organizationController.js
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   └── errorHandler.js      # Global error handling
│   ├── models/
│   │   ├── Admin.js             # Admin user schema
│   │   └── Organization.js      # Organization schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── organizationRoutes.js
│   ├── app.js                   # Express app setup
│   └── server.js                # Server entry point
├── .env                         # Environment variables
├── .gitignore
├── package.json
└── README.md
```

## 🔒 Security Features

- Passwords hashed using bcrypt (12 rounds)
- JWT tokens for authentication
- Protected routes require valid tokens
- Authorization checks for sensitive operations
- Input validation on all endpoints

## 🎯 Design Decisions

### Architecture
- **Multi-tenant with dynamic collections**: Each organization gets its own MongoDB collection, providing data isolation while maintaining a single application instance.
- **Master database approach**: A central database stores organization metadata and credentials, simplifying management and authentication.

### Technology Stack
- **Node.js + Express**: Fast, lightweight, and perfect for REST APIs
- **MongoDB**: NoSQL flexibility allows easy dynamic collection creation
- **JWT**: Stateless authentication ideal for scalable systems
- **Bcrypt**: Industry-standard password hashing

### Trade-offs
**Pros:**
- Excellent data isolation between organizations
- Scalable architecture
- Simple to add new organizations
- No cross-organization data leakage

**Cons:**
- More complex than single-collection approach
- Each organization connection has overhead
- Migration complexity if restructuring needed

### Improvements for Production
- Rate limiting to prevent abuse
- Redis for session management
- Input sanitization library (express-validator)
- Logging system (Winston/Morgan)
- Database connection pooling optimization
- API documentation with Swagger
- Comprehensive test suite
- Docker containerization
- CI/CD pipeline

## 📝 Notes

- Organization names are automatically converted to lowercase
- Collection names follow pattern: `org_<organization_name>`
- Admin deletion automatically triggers organization deletion
- JWT tokens expire after 7 days (configurable)

## 👨‍💻 Development

This project was built with clean code principles, following MVC architecture pattern for maintainability and scalability.

## 📄 License

MIT