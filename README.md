<div align="center">

# 🌉 LinkBridger

### **Personalized Social Profile Link Manager**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-brightgreen.svg)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

**Transform your social media presence with memorable, personalized links that never expire**

[🚀 Live Demo](https://linkb-one.vercel.app) • [📖 Documentation](./frontend/src/components/Documentation.jsx) • [🐛 Report Bug](https://github.com/DpkRn/LinkBridger/issues) • [💡 Request Feature](https://github.com/DpkRn/LinkBridger/issues)

</div>

---

## 📋 Table of Contents

- [About The Project](#-about-the-project)
- [Why LinkBridger?](#-why-linkbridger)
- [Key Benefits](#-key-benefits)
- [LinkBridger vs. Link Shorteners](#-linkbridger-vs-link-shorteners)
- [Live Examples](#-live-examples)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Standards](#-project-standards)
- [Contributing](#-contributing)
- [Developer](#-developer)
- [License](#-license)

---

## 🎯 About The Project

**LinkBridger** is a revolutionary social profile link management platform that empowers users to create personalized, memorable URLs for all their social media profiles. Unlike traditional link shorteners that generate random, forgettable codes, LinkBridger uses your username and platform name to create links that are both human-readable and professional.

### The Problem It Solves

In today's digital age, professionals and creators manage multiple social media profiles across various platforms. Sharing these links can be cumbersome:
- **Long, complex URLs** are hard to remember and share
- **Random short links** (like `bit.ly/xyz123`) are forgettable and unprofessional
- **No centralized management** means updating one link requires changing it everywhere
- **No analytics** to track which platforms get the most engagement

### The Solution

LinkBridger bridges this gap by providing:
- ✨ **Personalized URLs** using your username and platform name
- 🎯 **Single hub link** that redirects to all your profiles
- 📊 **Click tracking** to understand your audience
- 🔄 **Centralized updates** that reflect instantly across all platforms
- 🚀 **Zero expiration** - your links work forever

---

## 💡 Why LinkBridger?

### For Professionals
- **Build Your Brand**: Use consistent, memorable links across all platforms
- **Professional Appearance**: Clean URLs that reflect your personal brand
- **Time-Saving**: Update all links from one dashboard
- **Analytics**: Understand which platforms drive the most engagement

### For Content Creators
- **Easy Sharing**: One simple link format for all platforms
- **Audience Insights**: Track clicks to optimize your content strategy
- **Flexibility**: Add any platform - not limited to popular ones
- **Customization**: Personalize your link structure

### For Developers
- **Open Source**: Contribute and customize to your needs
- **Modern Stack**: Built with cutting-edge technologies
- **Well Documented**: Comprehensive documentation and code comments
- **Active Development**: Regular updates and improvements

---

## 🌟 Key Benefits

### 1. **Memorable & Professional Links**
Instead of sharing `https://www.linkedin.com/in/your-name-123456789/`, share `https://linkb-one.vercel.app/yourname/linkedin`. Your audience will remember it!

### 2. **Single Hub for All Profiles**
Share one link (`https://linkb-one.vercel.app/yourname`) that acts as a landing page for all your social profiles. Visitors can choose which platform to visit.

### 3. **Centralized Link Management**
Changed your Instagram handle? Update it once in LinkBridger, and all your shared links automatically reflect the change. No need to update links across multiple platforms.

### 4. **Click Analytics**
Track which platforms get the most clicks. Understand your audience's preferences and optimize your social media strategy accordingly.

### 5. **Platform Flexibility**
Not limited to popular platforms. Add any platform - GitHub, Portfolio, Blog, YouTube, TikTok, or even custom platforms.

### 6. **No Expiration**
Unlike many link shorteners that expire or require premium subscriptions, LinkBridger links work forever. Your links remain active as long as you maintain your account.

### 7. **Email Notifications**
Get notified when someone clicks your links, including device and location information (with privacy in mind).

### 8. **Dark Mode Support**
Modern, eye-friendly interface with full dark mode support for comfortable browsing.

### 9. **Mobile Responsive**
Fully responsive design that works seamlessly on desktop, tablet, and mobile devices.

### 10. **Privacy & Security**
- Secure authentication with JWT tokens
- Cookie-based session management
- HTTPS encryption
- No tracking scripts or third-party analytics

---

## 🆚 LinkBridger vs. Link Shorteners

| Feature | LinkBridger | Traditional Link Shorteners |
|---------|------------|------------------------------|
| **Link Format** | `linkb-one.vercel.app/username/platform` | `bit.ly/xyz123` or `tinyurl.com/abc456` |
| **Memorability** | ✅ Human-readable, memorable | ❌ Random codes, forgettable |
| **Professionalism** | ✅ Branded, professional | ❌ Generic, unprofessional |
| **Expiration** | ✅ Never expires | ❌ Often expires or requires premium |
| **Centralized Management** | ✅ Update all links from one place | ❌ Must update each link individually |
| **Platform Hub** | ✅ Single link for all profiles | ❌ Separate links for each platform |
| **Analytics** | ✅ Built-in click tracking | ⚠️ Limited or premium-only |
| **Customization** | ✅ Username-based personalization | ❌ No customization |
| **Cost** | ✅ Free and open source | ⚠️ Often requires paid plans |
| **Transparency** | ✅ Open source, auditable | ❌ Closed source, proprietary |

### Why LinkBridger is Superior

1. **Brand Identity**: Your links become part of your brand identity, not generic shortened URLs
2. **User Trust**: Transparent, readable URLs build more trust than mysterious short codes
3. **SEO Friendly**: Descriptive URLs are better for search engines and social sharing
4. **No Vendor Lock-in**: Open source means you're not dependent on a single service
5. **Community Driven**: Built by developers, for developers, with active community support

---

## 🎬 Live Examples

See LinkBridger in action with these real-world examples:

### Example User: `dpkrn`

**Single Hub Link** (Access all profiles):
```
https://linkb-one.vercel.app/dpkrn
```

**Individual Platform Links**:
- **LinkedIn**: [`https://linkb-one.vercel.app/dpkrn/linkedin`](https://linkb-one.vercel.app/dpkrn/linkedin)
- **GitHub**: [`https://linkb-one.vercel.app/dpkrn/github`](https://linkb-one.vercel.app/dpkrn/github)
- **LeetCode**: [`https://linkb-one.vercel.app/dpkrn/leetcode`](https://linkb-one.vercel.app/dpkrn/leetcode)
- **Portfolio**: [`https://linkb-one.vercel.app/dpkrn/portfolio`](https://linkb-one.vercel.app/dpkrn/portfolio)
- **Instagram**: [`https://linkb-one.vercel.app/dpkrn/instagram`](https://linkb-one.vercel.app/dpkrn/instagram)
- **Facebook**: [`https://linkb-one.vercel.app/dpkrn/facebook`](https://linkb-one.vercel.app/dpkrn/facebook)
- **Codeforces**: [`https://linkb-one.vercel.app/dpkrn/codeforces`](https://linkb-one.vercel.app/dpkrn/codeforces)

**Notice**: Only the platform name changes; the username remains consistent across all links!

---

## ✨ Features

### Core Features
- 🔐 **Secure Authentication**: JWT-based authentication with email verification
- 👤 **User Profiles**: Customizable profile with bio and profile picture
- 🔗 **Link Management**: Create, edit, and delete social profile links
- 📊 **Click Tracking**: Real-time analytics for each link
- 🔔 **Notifications**: Email notifications for link clicks with device information
- 🌓 **Dark Mode**: Full dark mode support with system preference detection
- 📱 **Responsive Design**: Works perfectly on all devices

### Advanced Features
- 🎨 **Modern UI/UX**: Beautiful, intuitive interface built with React and Tailwind CSS
- ⚡ **Fast Performance**: Optimized for speed and efficiency
- 🔒 **Security**: Helmet.js security headers, CORS protection, and secure cookies
- 📝 **Form Validation**: Client and server-side validation
- 🎯 **Error Handling**: Comprehensive error handling with user-friendly messages
- 🧪 **Code Quality**: ESLint, Prettier, and best practices enforced

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications
- **Vite** - Build tool and dev server

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Nodemailer** - Email notifications
- **Helmet.js** - Security headers
- **CORS** - Cross-origin resource sharing

### DevOps & Deployment
- **Docker** - Containerization
- **Nginx** - Reverse proxy and load balancer
- **Let's Encrypt** - SSL certificates
- **Vercel** - Frontend hosting
- **EC2** - Backend hosting

---

## 🚀 Getting Started

### Prerequisites
- Node.js 22.x or higher
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/DpkRn/LinkBridger.git
   cd LinkBridger
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   ```

3. **Environment Setup**
   
   Create `.env` file in `backend/`:
   ```env
   JWT_KEY=your_jwt_secret_key
   DB_URL=your_mongodb_connection_string
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_app_password
   PORT=8080
   ```

4. **Run the application**
   ```bash
   # Backend (from backend directory)
   npm start
   
   # Frontend (from frontend directory)
   npm run dev
   ```

5. **Access the application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:8080`

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d --build
```

---

## 📐 Project Standards

This project adheres to professional development standards:

### Code Quality
- ✅ **ESLint** - Code linting and style enforcement
- ✅ **Prettier** - Code formatting
- ✅ **Consistent Naming** - Clear, descriptive variable and function names
- ✅ **Code Comments** - Comprehensive documentation
- ✅ **Error Handling** - Proper try-catch blocks and error messages

### Security
- ✅ **JWT Authentication** - Secure token-based authentication
- ✅ **Password Hashing** - Bcrypt for password security
- ✅ **Helmet.js** - Security headers protection
- ✅ **CORS Configuration** - Controlled cross-origin access
- ✅ **Input Validation** - Client and server-side validation
- ✅ **SQL Injection Prevention** - Using parameterized queries (Mongoose)

### Documentation
- ✅ **README.md** - Comprehensive project documentation
- ✅ **CHANGELOG.md** - Version history and changes
- ✅ **Code Comments** - Inline documentation
- ✅ **API Documentation** - Clear endpoint descriptions

### Version Control
- ✅ **Git Best Practices** - Meaningful commit messages
- ✅ **Branch Strategy** - Feature branches and main branch
- ✅ **Pull Request Reviews** - Code review process

### Testing
- ✅ **Error Handling** - Comprehensive error scenarios
- ✅ **Input Validation** - Form and API validation
- ✅ **Edge Cases** - Handling of boundary conditions

### Performance
- ✅ **Optimized Queries** - Efficient database operations
- ✅ **Lazy Loading** - Code splitting and lazy imports
- ✅ **Caching** - Appropriate caching strategies
- ✅ **Image Optimization** - Optimized asset delivery

### Accessibility
- ✅ **Semantic HTML** - Proper HTML structure
- ✅ **ARIA Labels** - Screen reader support
- ✅ **Keyboard Navigation** - Full keyboard accessibility
- ✅ **Color Contrast** - WCAG compliant color schemes

### UI/UX
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **Dark Mode** - Full dark mode support
- ✅ **Loading States** - Proper loading indicators
- ✅ **Error Messages** - User-friendly error handling
- ✅ **Form Validation** - Real-time validation feedback

---

## 🤝 Contributing

We love contributions! LinkBridger is an open-source project, and we welcome any contributions from the community.

### How to Contribute

1. **Fork the Repository**
   ```bash
   git fork https://github.com/DpkRn/LinkBridger.git
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make Your Changes**
   - Follow the project's code style
   - Add comments for complex logic
   - Update documentation as needed

4. **Commit Your Changes**
   ```bash
   git commit -m "Add amazing feature"
   ```

5. **Push to Your Branch**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**
   - Describe your changes clearly
   - Reference any related issues
   - Wait for review and feedback

### Contribution Guidelines

- 🎯 **Focus on Quality**: Write clean, maintainable code
- 📝 **Document Changes**: Update README and CHANGELOG
- 🧪 **Test Thoroughly**: Ensure your changes work correctly
- 💬 **Communicate**: Discuss major changes before implementing
- 🤝 **Be Respectful**: Maintain a positive and inclusive environment

### Areas for Contribution

- 🐛 **Bug Fixes**: Help us squash bugs
- ✨ **New Features**: Propose and implement new features
- 📚 **Documentation**: Improve documentation and examples
- 🎨 **UI/UX**: Enhance the user interface
- ⚡ **Performance**: Optimize code and queries
- 🔒 **Security**: Improve security measures
- 🌍 **Internationalization**: Add multi-language support

### Get in Touch

Have questions, suggestions, or want to discuss a major contribution?

**📧 Email**: [d.wizard.techno@gmail.com](mailto:d.wizard.techno@gmail.com)

We're always happy to hear from the community! Whether you're a developer, designer, or just someone with great ideas, your input is valuable.

---

## 👨‍💻 Developer

<div align="center">

### **Dwizard**

**Full Stack Developer & Open Source Enthusiast**

[![GitHub](https://img.shields.io/badge/GitHub-DpkRn-181717?style=for-the-badge&logo=github)](https://github.com/DpkRn)
[![Email](https://img.shields.io/badge/Email-d.wizard.techno@gmail.com-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:d.wizard.techno@gmail.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Profile-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/dpkrn)
[![Portfolio](https://img.shields.io/badge/Portfolio-Website-FF6B6B?style=for-the-badge&logo=firefox&logoColor=white)](https://linkb-one.vercel.app/dpkrn)

**Passionate about building innovative solutions and contributing to open source**

</div>

### About the Developer

**Dwizard** is a passionate full-stack developer with expertise in modern web technologies. With a focus on creating user-friendly applications and contributing to the open-source community, Dwizard has built LinkBridger to solve real-world problems faced by professionals and content creators.

**Skills & Expertise:**
- 🚀 Full Stack Development (MERN Stack)
- ⚛️ React & Modern JavaScript
- 🗄️ Database Design & Optimization
- 🔒 Security & Authentication
- 🐳 DevOps & Containerization
- 📱 Responsive Web Design

**Connect:**
- 📧 **Email**: [d.wizard.techno@gmail.com](mailto:d.wizard.techno@gmail.com)
- 💼 **LinkedIn**: [Connect on LinkedIn](https://www.linkedin.com/in/dpkrn)
- 🐙 **GitHub**: [@DpkRn](https://github.com/DpkRn)
- 🌐 **Portfolio**: [View Portfolio](https://linkb-one.vercel.app/dpkrn)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Open Source Community** - For the amazing tools and libraries
- **Contributors** - Everyone who has contributed to this project
- **Users** - For using LinkBridger and providing valuable feedback
- **MongoDB** - For the excellent database service
- **Vercel** - For seamless frontend hosting
- **Tailwind CSS** - For the beautiful utility-first CSS framework

---

<div align="center">

### ⭐ Star this repository if you find it helpful!

**Made with ❤️ by [Dwizard](https://github.com/DpkRn)**

[⬆ Back to Top](#-linkbridger)

</div>
