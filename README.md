# ConfigHub - Admin Dashboard

A modern, professional Admin Dashboard for managing JSON/YAML configurations across microservices. Built with React.js, Tailwind CSS, and featuring a clean, intuitive UI.

![ConfigHub Dashboard](https://img.shields.io/badge/React-18.2.0-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.6-06B6D4) ![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### 🔐 Authentication
- Secure JWT-based authentication
- Protected routes
- Auto-logout on token expiration
- Session management

### 📊 Dashboard
- Real-time statistics (total services, configs, active configs)
- Recent activity feed
- Quick action cards
- Visual data representation

### 🔧 Configuration Management
- **Service List**: Browse all services with search and filter
- **Upload Configs**: Validate and upload JSON/YAML files
- **Version History**: Track all config versions per service/environment
- **Config Viewer**: Pretty-print JSON with tree and raw views
- **Activate/Deactivate**: Switch between config versions
- **Delete**: Remove unused config versions

### 🎨 User Interface
- Clean, modern design with Tailwind CSS
- Responsive layout (mobile, tablet, desktop)
- Smooth animations and transitions
- Toast notifications for user feedback
- Loading states and empty states
- Modal dialogs for confirmations

### 🛠️ Technical Features
- Axios interceptors for automatic token attachment
- Global error handling
- File validation (JSON/YAML)
- Copy to clipboard functionality
- Download configurations
- Environment-based color coding (dev/test/prod)

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm/yarn
- Backend API running (see API endpoints below)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd config-dashboard
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
```

Edit `.env` and set your backend API URL:
```env
VITE_API_URL=http://localhost:8000/api
```

4. **Start development server**
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
config-dashboard/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Layout.jsx       # Main layout wrapper
│   │   ├── Sidebar.jsx      # Navigation sidebar
│   │   ├── ProtectedRoute.jsx
│   │   ├── Loading.jsx      # Loading spinner
│   │   ├── EmptyState.jsx   # Empty state component
│   │   └── Modal.jsx        # Modal dialog
│   ├── pages/               # Page components
│   │   ├── Login.jsx        # Authentication page
│   │   ├── Dashboard.jsx    # Dashboard with stats
│   │   ├── ServiceList.jsx  # Service listing
│   │   ├── UploadConfig.jsx # Upload form
│   │   ├── ConfigVersions.jsx # Version history
│   │   └── ConfigViewer.jsx # Config display
│   ├── contexts/            # React contexts
│   │   └── AuthContext.jsx  # Auth state management
│   ├── services/            # API services
│   │   ├── api.js           # Axios instance
│   │   └── configService.js # Config API calls
│   ├── utils/               # Utility functions
│   │   └── helpers.js       # Helper functions
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── index.html              # HTML template
├── package.json            # Dependencies
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind configuration
└── postcss.config.js      # PostCSS configuration
```

## 🔌 API Integration

### Required API Endpoints

The dashboard expects the following REST API endpoints:

#### Authentication
```
POST /auth/login
Body: { email: string, password: string }
Response: { token: string, user: object }
```

#### Configs
```
GET /configs
Response: Array<ConfigObject>

GET /configs/{service}/{env}
Response: ConfigObject

GET /configs/{service}/{env}/history
Response: Array<ConfigObject>

POST /configs/upload
Content-Type: multipart/form-data
Body: { file: File, serviceName: string, environment: string }
Response: ConfigObject

PUT /configs/{id}/activate
Response: ConfigObject

DELETE /configs/{id}
Response: { success: boolean }
```

#### Config Object Structure
```typescript
{
  id: number;
  serviceName: string;
  environment: 'dev' | 'test' | 'prod';
  version: number;
  data: object; // The actual config JSON
  isActive: boolean;
  createdAt: string; // ISO date
  createdBy?: string;
  description?: string;
}
```

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to customize the color scheme:
```js
colors: {
  primary: { /* your colors */ },
  dark: { /* your colors */ }
}
```

### Fonts
Update `src/index.css` to change fonts:
```css
@import url('https://fonts.googleapis.com/css2?family=Your+Font');
```

### API URL
Change backend URL in `.env`:
```env
VITE_API_URL=https://your-api-domain.com/api
```

## 🧪 Testing Credentials

For development/testing, use these demo credentials:
- Email: `admin@example.com`
- Password: `admin123`

**Note**: Configure these in your backend authentication system.

## 📱 Responsive Design

The dashboard is fully responsive:
- **Mobile** (< 768px): Hamburger menu, stacked layouts
- **Tablet** (768px - 1024px): Side navigation, grid layouts
- **Desktop** (> 1024px): Full sidebar, multi-column grids

## 🔒 Security Features

- JWT token storage in localStorage
- Automatic token attachment to requests
- Token expiration handling
- Protected routes with redirects
- Secure logout with token cleanup

## 🐛 Error Handling

- Global axios interceptors for API errors
- Toast notifications for user feedback
- Graceful degradation on failures
- Network error detection
- Validation errors displayed inline

## 📦 Dependencies

### Core
- **React 18.2** - UI library
- **React Router 6** - Routing
- **Axios** - HTTP client
- **Tailwind CSS 3** - Styling

### UI Components
- **react-toastify** - Toast notifications
- **react-json-view** - JSON tree viewer
- **lucide-react** - Icon library

### Utilities
- **js-yaml** - YAML parsing
- **Vite** - Build tool

## 🚢 Deployment

### Build
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙋‍♂️ Support

For issues and questions:
- Create an issue on GitHub
- Contact: support@confighub.io

## 🎯 Roadmap

- [ ] Dark mode toggle
- [ ] Export configs to CSV
- [ ] Batch operations
- [ ] Config diff viewer
- [ ] Audit logs
- [ ] Role-based access control
- [ ] Webhook notifications
- [ ] Config templates

---

Built with ❤️ using React and Tailwind CSS
