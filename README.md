# 🎓 GSVConnect

**An alumni yearbook & networking platform for GSV students and alumni.**

GSVConnect is a **college-exclusive MERN stack web platform** designed to strengthen the bond between **students and alumni of Gati Shakti Vishwavidyalaya (GSV)**.
It serves as a **digital yearbook and professional networking space**, enabling alumni discovery, storytelling, events, and career opportunities — all in one place.

🌐 **Live Demo:**
https://sampleyearbook-frontend.vercel.app/

---

## ✨ Key Highlights

- College-only access (GSV focused)
- Alumni yearbook with memories & timelines
- Searchable alumni directory
- Events & job opportunity board
- Secure authentication with Firebase
- Clean, modern UI with smooth animations

---

## 🧩 Core Features

### 🏠 Home

- Hero section with platform overview
- Feature highlights, statistics & testimonials
- Clear call-to-action for students & alumni

### 📇 Directory

- Searchable alumni directory
- Filter by year, branch, company
- View detailed alumni profiles

### 📅 Events

- Alumni events listing and registration
- RSVP management
- Event reminders and notifications

### 💼 Jobs

- Job postings by alumni
- Easy application process
- Job search and filtering

### 📖 Stories

- Alumni success stories
- Memory submissions
- Interactive yearbook pages

### 🎓 Yearbook

- Digital yearbook experience
- Memory timeline
- Photo and video gallery

### 📰 Magazine

- Digital magazine reader
- Article browsing
- Interactive flipbook style

---

## 🛠️ Tech Stack

### Frontend

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **Vite** for fast build

### Backend

- **Node.js** with Express
- **Supabase** for database & auth
- **Cloudinary** for image storage
- **Firebase** for authentication

---

## 📦 Installation

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Firebase project

### Setup

1. Clone the repository:

```bash
git clone https://github.com/pratik3011622/gsv-yearbook.git
cd gsv-yearbook
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

```bash
cp .env.example .env
```

4. Update `.env` with your credentials:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
```

5. Start development server:

```bash
npm run dev
```

---

## 🚀 Deployment

The project is configured for deployment on Vercel.

1. Push to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

---

## 📁 Project Structure

```
gsv-yearbook/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── contexts/       # React contexts
│   ├── lib/            # Utility functions
│   ├── App.jsx         # Main app component
│   └── main.tsx        # Entry point
├── public/             # Static assets
├── backend/            # Backend API (if applicable)
└── supabase/           # Database schema & migrations
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📧 Contact

For questions or support, reach out to:

- **Email:** technocrats@gsv.ac.in
- **Website:** https://gsv.ac.in

---

## 🙏 Acknowledgments

- Gati Shakti Vishwavidyalaya
- All contributors and alumni
- TechnoCrats Club
