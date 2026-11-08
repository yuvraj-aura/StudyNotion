# StudyNotion

StudyNotion is a full-stack learning platform where students can discover courses, purchase access, track their learning progress, and leave reviews. Instructors can create and manage course content, publish courses, and view enrollment and income insights from their dashboard.

The project uses a React/Vite client and an Express/MongoDB API. It includes role-based access for students, instructors, and administrators, plus integrations for Razorpay payments, Cloudinary media uploads, and transactional email.

## What the app includes

### Student experience

- **Course discovery:** Browse published courses by category and open detailed course pages with curriculum, instructor information, ratings, and reviews.
- **Search and catalog filtering:** Use category-aware catalog pages and course cards to narrow down available learning content.
- **Persistent cart:** Add and remove courses from the cart while keeping the client state synchronized with the authenticated user's server-side cart.
- **Razorpay checkout:** Start a single-course or multi-course purchase, open the Razorpay checkout modal, and verify payment before enrollment is completed.
- **Enrolled courses:** Access purchased courses from the dashboard and continue learning from the course's sections and lectures.
- **Lecture progress:** Mark lectures complete and keep completion state associated with the enrolled course.
- **Ratings and reviews:** Submit course ratings and written reviews after learning from a course.

### Instructor tools

- **Course creation:** Create courses with descriptions, pricing, tags, learning outcomes, categories, and thumbnails.
- **Curriculum builder:** Add sections and video subsections, edit course content, and manage course publishing status.
- **Course management:** View instructor-owned courses, open an edit flow, and delete courses when needed.
- **Instructor dashboard:** See total courses, enrolled students, and generated income, with interactive Chart.js visualizations for student enrollment and income by course.

### Account and platform features

- **OTP-based registration:** Verify new accounts through an email OTP before creating the user and profile records.
- **JWT authentication:** Authenticate API requests and protect dashboard and role-specific routes with Student, Instructor, and Admin middleware.
- **Profile management:** Update profile details and profile photos, change passwords, and delete an account.
- **Password recovery:** Request a time-limited reset token and set a new password.
- **Media uploads:** Store course thumbnails, profile images, and lecture media through Cloudinary.
- **Email notifications:** Send verification, enrollment, payment receipt, contact response, and password update emails.
- **Responsive dark UI:** Use a responsive StudyNotion design with reusable React components, Tailwind utility classes, custom CSS, icons, toast notifications, and loading states.
- **Auto-sliding reviews:** Present learner testimonials in an automatically moving Swiper React carousel.

## Technology stack

### Frontend

- React 19 and React DOM
- Vite
- React Router DOM 7
- Redux Toolkit and React Redux
- Tailwind CSS with the Vite plugin and component-specific CSS
- Axios for API requests
- Chart.js and `react-chartjs-2` for instructor charts
- Swiper React for the review carousel
- React Hook Form, React Icons, and React Hot Toast

### Backend

- Node.js and Express 5
- MongoDB with Mongoose
- JWT and bcrypt authentication
- Razorpay order creation and payment verification
- Cloudinary uploads
- Nodemailer email delivery
- Express File Upload and CORS

## Project structure

```text
StudyNotion/
├── server/
│   ├── config/              # Database, Cloudinary, and Razorpay configuration
│   ├── controllers/         # Authentication, course, payment, profile, and review logic
│   ├── mail/templates/      # HTML email templates
│   ├── middlewares/         # JWT and role checks
│   ├── models/              # User, profile, course, progress, payment, and review schemas
│   ├── routes/              # Auth, course, profile, and payment endpoints
│   ├── utils/               # Upload and email helpers
│   ├── index.js             # Express server entry point
│   └── package.json
├── src/
│   ├── components/          # Shared UI, catalog, learning, home, auth, and dashboard components
│   ├── data/                # Navigation, footer, dashboard, and static display data
│   ├── pages/               # Route-level pages
│   ├── redux/               # Store, reducers, and slices
│   ├── services/            # API endpoints, Axios connector, and feature operations
│   ├── utils/               # Formatting and application helpers
│   ├── App.jsx              # Client routes and session hydration
│   └── main.jsx             # React entry point
├── tests/                   # Focused scripts for cart, reviews, and profile behavior
├── package.json             # Frontend scripts and dependencies
└── vite.config.js           # Vite server and API proxy configuration
```

## Getting started

### Prerequisites

- Node.js 18 or newer
- npm
- MongoDB database
- Razorpay account for checkout flows
- Cloudinary account for media uploads
- SMTP credentials for application email

### Install dependencies

```bash
git clone https://github.com/yuvraj-aura/StudyNotion.git
cd StudyNotion
npm install
cd server
npm install
cd ..
```

### Configure the backend

Create `server/.env` with the values required by the API:

```env
DATABASE_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173

CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
FOLDER_NAME=studynotion

RAZORPAY_KEY=your_razorpay_key_id
RAZORPAY_SECRET=your_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret

MAIL_HOST=your_smtp_host
MAIL_USER=your_smtp_username
MAIL_PASS=your_smtp_password
```

Keep `server/.env` out of version control. The backend loads this file automatically during startup.

### Run the application

Run the frontend and backend together:

```bash
npm run dev:all
```

Or run them separately:

```bash
# terminal 1
npm run dev

# terminal 2
npm run server
```

The frontend is available at [http://localhost:5173](http://localhost:5173), and the API runs on port `4000`. Vite proxies `/api` requests to the backend.

## Useful scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run server` | Start the backend with Nodemon |
| `npm run dev:all` | Run the frontend and backend together |
| `npm run build` | Create a production frontend build |
| `npm run preview` | Preview the production frontend build |
| `npm run lint` | Run Oxlint against the project |
| `npm --prefix server start` | Start the backend without Nodemon |

## Main user flows

1. **Register and sign in:** A visitor requests an OTP, verifies the email, creates an account, and signs in.
2. **Discover a course:** A student browses the home page or catalog, filters by category, and opens a course detail page.
3. **Purchase and enroll:** The student adds courses to the cart or chooses Buy Now, completes Razorpay checkout, and receives enrollment confirmation after server-side verification.
4. **Learn and review:** The student watches lectures, updates progress, and submits a rating or review.
5. **Build and publish:** An instructor creates course content, uploads media, manages sections and lectures, then publishes the course.
6. **Review performance:** The instructor dashboard summarizes course count, students, and income with interactive charts.

## Testing notes

The `tests/` directory contains focused Node.js scripts for cart synchronization, backend cart behavior, profile photo handling, and course reviews. Payment, Cloudinary, email, and database flows require valid local environment variables and service credentials before they can be exercised end to end.

## Security and configuration notes

- Never commit `server/.env`, API keys, payment secrets, SMTP passwords, or Cloudinary credentials.
- Payment verification is performed on the server before a course is marked as purchased.
- Protected routes require a valid JWT and the appropriate account role.
- Configure the Razorpay webhook endpoint as `/api/v1/payment/webhook` when webhook-based payment confirmation is enabled.

## License

This project is currently maintained as a personal StudyNotion application. NOT TO BE **REUSED** .

