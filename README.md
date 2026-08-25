# StudyNotion — EdTech Web Application

**StudyNotion** is a modern, full-featured e-learning platform frontend built with **React 19**, **Vite**, **React Router v7**, and **pure modular CSS**. It delivers an authentic, high-contrast dark-mode user experience with interactive course filtering, dynamic API data integration, role-based authentication flows, protected routes, and informative landing pages.

---

## Features

- **StudyNotion Dark Design System**:
  - Custom dark theme with layered surface elevation (`#000814`, `#161D29`, `#2C333F`).
  - High-contrast visual accents using signature StudyNotion Yellow (`#FFD60A`) and Cyan/Blue (`#47A5C5`).
  - Pure modular CSS architecture without third-party CSS frameworks.

- **Interactive Course Catalog & Dashboard**:
  - **Dynamic Course Categories**: Filter courses by category (*All, Development, Business, Design, Lifestyle*).
  - **Elevated Course Cards**: High-contrast card designs with smooth hover lift micro-interactions, thumbnail previews, and interactive like/unlike bookmarking with toast feedback.
  - **Loading & Error Handling**: Custom loading spinner and dedicated error recovery/retry states.

- **Authentication & Protected Routing**:
  - **Sign In & Sign Up** forms with Student/Instructor role toggling.
  - **Interactive Password Visibility**: Smooth show/hide password toggles (`FaRegEye` / `FaRegEyeSlash`).
  - **Protected Dashboard (`PrivateRoute`)**: Secure navigation restricting authenticated dashboard access.
  - Google Sign-In button integration and responsive visual layouts with backdrop image frames.

- **Rich Landing & Info Pages**:
  - **Home**: Hero section with interactive code playground preview, metrics/statistics bar, key platform features, and popular learning track roadmaps.
  - **About Us**: Founding story, mission/vision showcase, and core principles.
  - **Contact Us**: Multi-channel support details and an interactive contact query form with Toast notifications.

- **Fully Responsive**: Seamlessly optimized across desktop, tablet, and mobile devices.

---

## Tech Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite
- **Routing**: React Router DOM (v7)
- **Icons**: React Icons (`react-icons`)
- **Notifications**: React Toastify (`react-toastify`)
- **Styling**: Pure Modular CSS (Vanilla CSS & CSS Custom Properties)

---

## Project Structure

```text
src/
+-- assets/             # Brand logos, frames, illustrations, and badges
+-- components/         # Modular components & corresponding CSS
¦   +-- About.jsx & .css
¦   +-- Contact.jsx & .css
¦   +-- Course.jsx & .css
¦   +-- Courses.jsx & .css
¦   +-- Dashboard.jsx & .css
¦   +-- FilterButton.jsx & .css
¦   +-- Footer.jsx & .css
¦   +-- Home.jsx & .css
¦   +-- Navbar.jsx & .css
¦   +-- PrivateRoute.jsx
¦   +-- SignIn.jsx & .css
¦   +-- SignUp.jsx & .css
¦   +-- Spinner.jsx & .css
+-- data.js             # Course categories, API endpoints, and mock data
+-- App.jsx & App.css   # Main app layout, API fetching, and route configuration
+-- index.css           # Global theme variables, reset, and typography
+-- main.jsx            # Application entry point & router/toast setup
```

---

## Getting Started

### Prerequisites

- Node.js (v18.0.0 or higher recommended)
- npm or yarn

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yuvraj-aura/StudyNotion.git
   ```

2. **Navigate to the project directory:**
   ```bash
   cd StudyNotion
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   Navigate to [http://localhost:5173](http://localhost:5173) to view the application.
