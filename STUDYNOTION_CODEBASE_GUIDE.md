# Edtech Platform: StudyNotion Codebase Map & Flow Guide

## 🏢 1. System Overview & Core Entities

**StudyNotion** is a full-stack EdTech (educational technology) platform built with a **MERN-like stack** (MongoDB, Express.js, React 19/Vite, Node.js). It supports three primary user roles: **Student**, **Instructor**, and **Admin**.

### Core Platform Capabilities:
* **Courses & Curriculum Hierarchy:** Categories -> Courses -> Sections -> SubSections (lectures/videos).
* **Role-Based Authentication & Permissions:** OTP-based email verification, bcrypt password hashing, JWT authentication cookies/headers, and role-based route middleware (`isStudent`, `isInstructor`, `isAdmin`).
* **Student Lifecycle & Course Enrollment:** Course catalog discovery, course preview & details, Razorpay payment gateway integration, automatic course enrollment upon payment verification, and enrollment confirmation emails.
* **Learning & Progress Tracking:** Enrolled course dashboards, lecture completion status (`CourseProgress`), ratings & reviews.
* **Instructor Studio:** Course creation, curriculum management (Sections & SubSections), thumbnail uploads via Cloudinary, and course deletion/publishing.
* **Profile & Media Management:** User profiles (linked 1-to-1 with Profile model), avatar uploads to Cloudinary, password resets with time-expiring tokens.

### Core Database Entities (`StudyNotion/server/models`):
* [user.js](file:///c:/Users/Dell/OneDrive/Desktop/Aryan/Web%20Dev/StudyNotion/server/models/user.js): Name, email, password, accountType (`Student` | `Instructor` | `Admin`), profile reference, enrolled courses, course progress.
* [profile.js](file:///c:/Users/Dell/OneDrive/Desktop/Aryan/Web%20Dev/StudyNotion/server/models/profile.js): Additional details: gender, date of birth, bio (`about`), contact number.
* [course.js](file:///c:/Users/Dell/OneDrive/Desktop/Aryan/Web%20Dev/StudyNotion/server/models/course.js): Course name, description, instructor reference, whatYouWillLearn, courseContent (`[Section]`), ratings & reviews, price, thumbnail, tags, category, students enrolled (`[User]`), instructions, status (`Draft` | `Published`).
* [section.js](file:///c:/Users/Dell/OneDrive/Desktop/Aryan/Web%20Dev/StudyNotion/server/models/section.js): Section name, array of `subSection` references.
* [subSections.js](file:///c:/Users/Dell/OneDrive/Desktop/Aryan/Web%20Dev/StudyNotion/server/models/subSections.js): Title, timeDuration, description, videoUrl.
* [category.js](file:///c:/Users/Dell/OneDrive/Desktop/Aryan/Web%20Dev/StudyNotion/server/models/category.js): Category name, description, courses array.
* [courseProgress.js](file:///c:/Users/Dell/OneDrive/Desktop/Aryan/Web%20Dev/StudyNotion/server/models/courseProgress.js): Course ID, completed videos/lectures array.
* [ratingAndReviews.js](file:///c:/Users/Dell/OneDrive/Desktop/Aryan/Web%20Dev/StudyNotion/server/models/ratingAndReviews.js): User reference, rating (number), review (text), course reference.
* [otp.js](file:///c:/Users/Dell/OneDrive/Desktop/Aryan/Web%20Dev/StudyNotion/server/models/otp.js): Email, OTP, createdAt with TTL (5 min expiration) and pre-save email trigger.

---

## 📁 2. Architecture & File Directory Map

```text
StudyNotion/
├── server/                     # Backend API (Node.js & Express)
│   ├── config/                 # Service & cloud configurations
│   │   ├── cloudinary.js       # Cloudinary media storage connection
│   │   ├── database.js         # MongoDB Mongoose connection
│   │   └── razorpay.js         # Razorpay client instance setup
│   ├── controllers/            # Route controllers handling business logic
│   │   ├── auth.js             # sendOTP, signUp, login, changePassword
│   │   ├── category.js         # createCategory, showAllCategories, categoryPageDetails
│   │   ├── contactUs.js        # Contact email handler
│   │   ├── course.js           # createCourse, showAllCourses, getCourseDetails, deleteCourse
│   │   ├── payments.js         # capturePayments, verifyPayment, sendPaymentSuccessEmail, enrollStudent
│   │   ├── profile.js          # updateProfile, deleteAccount, getUserDetails, getEnrolledCourses, updateProfilePhoto
│   │   ├── ratingAndReview.js  # createRating, getAvgRatings, getAllRatingAndReview
│   │   ├── resetPassword.js    # resetPasswordToken, resetPassword
│   │   ├── section.js          # createSection, updateSection, deleteSection
│   │   └── subSection.js       # createSubSection, updateSubSection, deleteSubSection
│   ├── mail/templates/         # HTML email templates
│   │   ├── courseEnrollment.js # Template for course enrollment confirmation
│   │   ├── emailVerification.js# Template for signup OTP
│   │   └── paymentSuccessEmail.js # Template for payment receipt
│   ├── middlewares/
│   │   └── auth.js             # JWT verification (auth), isStudent, isInstructor, isAdmin checks
│   ├── models/                 # Mongoose schemas (user, course, section, subSections, category, profile, otp, etc.)
│   ├── routes/                 # Express API route definitions
│   │   ├── Course.js           # /api/v1/course endpoints (courses, categories, sections, subSections, ratings)
│   │   ├── Payments.js         # /api/v1/payment endpoints (capturePayment, verifyPayment, sendPaymentSuccessEmail)
│   │   ├── Profile.js          # /api/v1/profile endpoints (updateProfile, getEnrolledCourses, deleteProfile, etc.)
│   │   └── User.js             # /api/v1/auth endpoints (login, signup, sendotp, reset-password)
│   ├── utils/
│   │   ├── imageUploader.js    # Cloudinary upload helper
│   │   └── mailSender.js       # Nodemailer transporter & email sender utility
│   ├── index.js                # Server entry point, CORS, express-fileupload, route mounts
│   └── package.json
│
├── src/                        # Frontend Application (React 19, Vite, Tailwind/CSS)
│   ├── assets/                 # SVGs, banners, logo, images
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.jsx      # Top navigation, catalog dropdown, cart badge, profile avatar
│   │   │   └── Footer.jsx      # Global footer links
│   │   ├── core/
│   │   │   ├── Auth/           # OpenRoute, PrivateRoute, ProfileDropdown
│   │   │   ├── Dashboard/      # EnrolledCourses, Cart, MyProfile, Settings, AddCourse, MyCourse, EditCourse
│   │   │   └── Homepage/       # Hero sections, code blocks, explore tabs, review slider
│   │   ├── Course.jsx          # Individual course presentation component
│   │   ├── Courses.jsx         # Course list component
│   │   ├── FilterButton.jsx    # Category filter pills
│   │   └── Spinner.jsx         # Loading spinner
│   ├── data/                   # Navigation links, mock filter data, footer items
│   ├── pages/
│   │   ├── About.jsx           # About Us page
│   │   ├── Catalog.jsx         # Category-specific courses catalog
│   │   ├── Contact.jsx         # Contact us inquiry form
│   │   ├── CourseDetails.jsx   # Course overview & Buy Now / Enroll trigger
│   │   ├── Dashboard.jsx       # Nested user dashboard wrapper
│   │   ├── ForgotPassword.jsx  # Request password reset link
│   │   ├── Home.jsx            # Landing page
│   │   ├── SignIn.jsx          # User login
│   │   ├── SignUp.jsx          # User registration & role selection
│   │   ├── UpdatePassword.jsx  # New password submission
│   │   └── VerifyEmail.jsx     # OTP entry page
│   ├── redux/
│   │   ├── reducer/            # root combinedReducer
│   │   ├── slices/             # authSlice, cartSlice, profileSlice
│   │   └── store.js            # Redux Toolkit store config
│   ├── services/
│   │   ├── APIs.js             # Centralized backend endpoint constants
│   │   ├── apiConnector.js     # Axios wrapper for GET/POST/PUT/DELETE
│   │   └── operations/
│   │       ├── authAPI.js      # Auth action dispatches (login, signup, sendOTP)
│   │       ├── courseDetailsAPI.js # Course fetch & modification API calls
│   │       ├── profileAPI.js   # User profile and enrolled course fetchers
│   │       ├── settingsAPI.js  # Settings & profile update operations
│   │       └── studentFeaturesAPI.js # Razorpay SDK loader, buyCourse, verifyPayment
│   ├── utils/constants.js      # Roles enum (STUDENT, INSTRUCTOR, ADMIN), Course status
│   ├── App.jsx                 # Client router setup (<Routes>, <Route>)
│   └── main.jsx                # React DOM root render with Redux Provider & BrowserRouter
│
├── package.json
└── vite.config.js
```

---

## 🔄 3. Key UX & Data Flows

### Flow 1: Student Registration & Authentication (OTP-driven)

```text
[User Form / UI] -> [Send OTP Request] -> [OTP Generator & Mail] -> [Submit SignUp + OTP] -> [User & Profile Created]
```

1. **OTP Request Trigger:**
   * **UI:** User fills basic info on [SignUp.jsx](file:///c:/Users/Dell/OneDrive/Desktop/Aryan/Web%20Dev/StudyNotion/src/pages/SignUp.jsx) and requests verification.
   * **Frontend API:** Dispatches `sendOTP(email, navigate)` in `authAPI.js` calling `/api/v1/auth/sendotp` via [apiConnector.js](file:///c:/Users/Dell/OneDrive/Desktop/Aryan/Web%20Dev/StudyNotion/src/services/apiConnector.js).
2. **Server Handling & OTP Generation:**
   * **Route:** [StudyNotion/server/routes/User.js](file:///c:/Users/Dell/OneDrive/Desktop/Aryan/Web%20Dev/StudyNotion/server/routes/User.js) (`router.post("/sendotp", sendOTP)`).
   * **Controller:** [StudyNotion/server/controllers/auth.js](file:///c:/Users/Dell/OneDrive/Desktop/Aryan/Web%20Dev/StudyNotion/server/controllers/auth.js) `sendOTP()` verifies user is not already registered, generates a 6-digit numeric OTP using `otp-generator`, saves to [otp.js](file:///c:/Users/Dell/OneDrive/Desktop/Aryan/Web%20Dev/StudyNotion/server/models/otp.js), and sends email using [StudyNotion/server/utils/mailSender.js](file:///c:/Users/Dell/OneDrive/Desktop/Aryan/Web%20Dev/StudyNotion/server/utils/mailSender.js).
3. **Form Submission & User Creation:**
   * **UI:** User inputs OTP on [VerifyEmail.jsx](file:///c:/Users/Dell/OneDrive/Desktop/Aryan/Web%20Dev/StudyNotion/src/pages/VerifyEmail.jsx) and submits signup data (`firstName`, `lastName`, `email`, `password`, `confirmPass`, `accountType: "Student"`, `otp`).
   * **Route:** [StudyNotion/server/routes/User.js](file:///c:/Users/Dell/OneDrive/Desktop/Aryan/Web%20Dev/StudyNotion/server/routes/User.js) (`router.post("/signup", signUp)`).
   * **Controller:** [StudyNotion/server/controllers/auth.js](file:///c:/Users/Dell/OneDrive/Desktop/Aryan/Web%20Dev/StudyNotion/server/controllers/auth.js) `signUp()`:
     - Checks if recent OTP matches the database record.
     - Hashes password with `bcrypt.hash(password, 10)`.
     - Creates empty [profile.js](file:///c:/Users/Dell/OneDrive/Desktop/Aryan/Web%20Dev/StudyNotion/server/models/profile.js) record.
     - Saves new [user.js](file:///c:/Users/Dell/OneDrive/Desktop/Aryan/Web%20Dev/StudyNotion/server/models/user.js) pointing to Profile ID with `image = DiceBear avatar URL`.
4. **Login & Session Hydration:**
   * **UI:** User submits credentials on [SignIn.jsx](file:///c:/Users/Dell/OneDrive/Desktop/Aryan/Web%20Dev/StudyNotion/src/pages/SignIn.jsx).
   * **Route:** `POST /api/v1/auth/login` -> `login()` in [StudyNotion/server/controllers/auth.js](file:///c:/Users/Dell/OneDrive/Desktop/Aryan/Web%20Dev/StudyNotion/server/controllers/auth.js).
   * **Verification:** Compares password via `bcrypt.compare()`. Generates JWT token (`{email, id, accountType}`).
   * **Frontend Store:** Token and User data saved into localStorage and Redux slices ([authSlice.js](file:///c:/Users/Dell/OneDrive/Desktop/Aryan/Web%20Dev/StudyNotion/src/redux/slices/authSlice.js), [profileSlice.js](file:///c:/Users/Dell/OneDrive/Desktop/Aryan/Web%20Dev/StudyNotion/src/redux/slices/profileSlice.js)).

---

### Flow 2: Student Discovery, Enrollment & Payment Flow (End-to-End)

```text
[Browse/Catalog/Details] 
       │
       ▼
[Click "Buy Now" in CourseDetails.jsx]
       │
       ▼
[buyCourse() in studentFeaturesAPI.js] ──> Inject Razorpay checkout.js
       │
       ▼
[POST /api/v1/payment/capturePayment] ──> Razorpay Order created on Server
       │
       ▼
[Razorpay Modal Opens on Client] ───────> Student enters card / UPI details
       │
       ▼
[Payment Success Handler callback]
       ├──> [POST /api/v1/payment/sendPaymentSuccessEmail]
       └──> [POST /api/v1/payment/verifyPayment]
                   │
                   ▼
       [Server Verifies HMAC SHA256 Signature]
                   │
                   ▼
       [enrollStudent() runs on Server]
            ├── Course.findByIdAndUpdate: push userId into studentEnrolled
            ├── User.findByIdAndUpdate: push courseId into courses
            └── mailSender(): sends courseEnrollment confirmation email
                   │
                   ▼
       [Client redirects to Dashboard / EnrolledCourses]
```

#### Detailed Step-by-Step Execution:

1. **Course Selection:**
   * The student browses courses from [Home.jsx](file:///c:/Users/Dell/OneDrive/Desktop/Aryan/Web%20Dev/StudyNotion/src/pages/Home.jsx), [Catalog.jsx](file:///c:/Users/Dell/OneDrive/Desktop/Aryan/Web%20Dev/StudyNotion/src/pages/Catalog.jsx), or search filters.
   * Navigates to `/course/:courseId` handled by [CourseDetails.jsx](file:///c:/Users/Dell/OneDrive/Desktop/Aryan/Web%20Dev/StudyNotion/src/pages/CourseDetails.jsx).
2. **Initiating Purchase:**
   * User clicks the **"Buy Now"** button in [CourseDetails.jsx](file:///c:/Users/Dell/OneDrive/Desktop/Aryan/Web%20Dev/StudyNotion/src/pages/CourseDetails.jsx).
   * Handler checks if user is logged in (has `token`). If not, redirects to `/signin`.
   * Invokes `buyCourse({ courses: [courseId], token, userDetails, navigate, dispatch })` in [studentFeaturesAPI.js](file:///c:/Users/Dell/OneDrive/Desktop/Aryan/Web%20Dev/StudyNotion/src/services/operations/studentFeaturesAPI.js).
3. **Razorpay Script Loading & Order Capture:**
   * `buyCourse` dynamically loads Razorpay SDK `https://checkout.razorpay.com/v1/checkout.js`.
   * Sends `POST` request to `COURSE_PAYMENT_API` (`/api/v1/payment/capturePayment`) with course IDs in headers/body.
   * Handled by [StudyNotion/server/routes/Payments.js](file:///c:/Users/Dell/OneDrive/Desktop/Aryan/Web%20Dev/StudyNotion/server/routes/Payments.js) through `auth` and `isStudent` middleware.
   * In [payments.js](file:///c:/Users/Dell/OneDrive/Desktop/Aryan/Web%20Dev/StudyNotion/server/controllers/payments.js) `capturePayments()`:
     - Validates course existence and verifies that the student is not already enrolled.
     - Computes `totalAmount`.
     - Calls `instance.orders.create()` using Razorpay instance configured in [razorpay.js](file:///c:/Users/Dell/OneDrive/Desktop/Aryan/Web%20Dev/StudyNotion/server/config/razorpay.js).
     - Returns order details (`order_id`, `amount`, `currency`).
4. **Modal Launch & Payment Execution:**
   * Frontend configures Razorpay options (`order_id`, `key`, user prefill name/email) and triggers `paymentObject.open()`.
   * The student completes the payment in the Razorpay popup.
5. **Verification & Enrollment:**
   * Razorpay invokes the `handler` callback with `razorpay_order_id`, `razorpay_payment_id`, and `razorpay_signature`.
   * Frontend invokes `verifyPayment()` sending `razorpay_order_id`, `razorpay_payment_id`, `razorpay_signature`, and `courses`.
   * Endpoint: `POST /api/v1/payment/verifyPayment`.
   * Server controller in [payments.js](file:///c:/Users/Dell/OneDrive/Desktop/Aryan/Web%20Dev/StudyNotion/server/controllers/payments.js) generates expected signature:
     ```javascript
     let body = razorpay_order_id + "|" + razorpay_payment_id;
     const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET).update(body).digest("hex");
     ```
   * If signatures match:
     - Calls helper `enrollStudent(courses, userId, res)`.
     - Updates course: `Course.findOneAndUpdate({ _id: courseId }, { $push: { studentEnrolled: userId } })`.
     - Updates student: `User.findByIdAndUpdate(userId, { $push: { courses: courseId } })`.
     - Sends HTML confirmation email via `mailSender` using template [courseEnrollment.js](file:///c:/Users/Dell/OneDrive/Desktop/Aryan/Web%20Dev/StudyNotion/server/mail/templates/courseEnrollment.js).
6. **Confirmation & Dashboard Redirection:**
   * Client receives success response.
   * Redux clears cart state if purchased via cart (`resetCart()` in [cartSlice.js](file:///c:/Users/Dell/OneDrive/Desktop/Aryan/Web%20Dev/StudyNotion/src/redux/slices/cartSlice.js)).
   * Client navigates to `/dashboard/enrolled-courses` ([EnrolledCourses.jsx](file:///c:/Users/Dell/OneDrive/Desktop/Aryan/Web%20Dev/StudyNotion/src/components/core/Dashboard/EnrolledCourses.jsx)).
   * Component fetches updated course list using `GET_USER_ENROLLED_COURSES_API` (`/api/v1/profile/getEnrolledCourses`) in [profileAPI.js](file:///c:/Users/Dell/OneDrive/Desktop/Aryan/Web%20Dev/StudyNotion/src/services/operations/profileAPI.js).

---

### Flow 3: Instructor Course Creation & Content Publishing

1. **Course Details Creation:**
   * Instructor navigates to Dashboard -> Add Course (`AddCourse.jsx`).
   * Submits Course information (Title, Category, Tags, Thumbnail).
   * Sent to `POST /api/v1/course/createCourse` -> [course.js](file:///c:/Users/Dell/OneDrive/Desktop/Aryan/Web%20Dev/StudyNotion/server/controllers/course.js). Thumbnail uploaded to Cloudinary via [imageUploader.js](file:///c:/Users/Dell/OneDrive/Desktop/Aryan/Web%20Dev/StudyNotion/server/utils/imageUploader.js).
2. **Sections & SubSections Building:**
   * Instructor adds Sections: `POST /api/v1/course/addSection` -> [section.js](file:///c:/Users/Dell/OneDrive/Desktop/Aryan/Web%20Dev/StudyNotion/server/controllers/section.js).
   * Instructor uploads video lectures into sections: `POST /api/v1/course/addSubSection` -> [subSection.js](file:///c:/Users/Dell/OneDrive/Desktop/Aryan/Web%20Dev/StudyNotion/server/controllers/subSection.js). Video file uploaded to Cloudinary.
3. **Publishing:**
   * Course status toggled from `Draft` to `Published`, rendering it visible in [Catalog.jsx](file:///c:/Users/Dell/OneDrive/Desktop/Aryan/Web%20Dev/StudyNotion/src/pages/Catalog.jsx) and search results.

---

## 🧭 4. Quick Reference: Where to Make Common Changes

| If you need to update... | Primary Files to Edit |
| :--- | :--- |
| **Authentication & Signup logic** | Backend: [StudyNotion/server/controllers/auth.js](file:///c:/Users/Dell/OneDrive/Desktop/Aryan/Web%20Dev/StudyNotion/server/controllers/auth.js), [StudyNotion/server/models/user.js](file:///c:/Users/Dell/OneDrive/Desktop/Aryan/Web%20Dev/StudyNotion/server/models/user.js)<br>Frontend: [SignUp.jsx](file:///c:/Users/Dell/OneDrive/Desktop/Aryan/Web%20Dev/StudyNotion/src/pages/SignUp.jsx), [VerifyEmail.jsx](file:///c:/Users/Dell/OneDrive/Desktop/Aryan/Web%20Dev/StudyNotion/src/pages/VerifyEmail.jsx), [authAPI.js](file:///c:/Users/Dell/OneDrive/Desktop/Aryan/Web%20Dev/StudyNotion/src/services/operations/authAPI.js) |
| **Razorpay / Payment & Checkout** | Backend: [StudyNotion/server/controllers/payments.js](file:///c:/Users/Dell/OneDrive/Desktop/Aryan/Web%20Dev/StudyNotion/server/controllers/payments.js), [StudyNotion/server/routes/Payments.js](file:///c:/Users/Dell/OneDrive/Desktop/Aryan/Web%20Dev/StudyNotion/server/routes/Payments.js)<br>Frontend: [studentFeaturesAPI.js](file:///c:/Users/Dell/OneDrive/Desktop/Aryan/Web%20Dev/StudyNotion/src/services/operations/studentFeaturesAPI.js), [CourseDetails.jsx](file:///c:/Users/Dell/OneDrive/Desktop/Aryan/Web%20Dev/StudyNotion/src/pages/CourseDetails.jsx), [Cart.jsx](file:///c:/Users/Dell/OneDrive/Desktop/Aryan/Web%20Dev/StudyNotion/src/components/core/Dashboard/Cart.jsx) |
| **Course Details & Schema** | Backend: [StudyNotion/server/models/course.js](file:///c:/Users/Dell/OneDrive/Desktop/Aryan/Web%20Dev/StudyNotion/server/models/course.js), [StudyNotion/server/controllers/course.js](file:///c:/Users/Dell/OneDrive/Desktop/Aryan/Web%20Dev/StudyNotion/server/controllers/course.js)<br>Frontend: [CourseDetails.jsx](file:///c:/Users/Dell/OneDrive/Desktop/Aryan/Web%20Dev/StudyNotion/src/pages/CourseDetails.jsx), [courseDetailsAPI.js](file:///c:/Users/Dell/OneDrive/Desktop/Aryan/Web%20Dev/StudyNotion/src/services/operations/courseDetailsAPI.js) |
| **Categories & Catalog Filtering** | Backend: [StudyNotion/server/controllers/category.js](file:///c:/Users/Dell/OneDrive/Desktop/Aryan/Web%20Dev/StudyNotion/server/controllers/category.js)<br>Frontend: [Catalog.jsx](file:///c:/Users/Dell/OneDrive/Desktop/Aryan/Web%20Dev/StudyNotion/src/pages/Catalog.jsx), [pagesAndComponent.js](file:///c:/Users/Dell/OneDrive/Desktop/Aryan/Web%20Dev/StudyNotion/src/services/operations/pagesAndComponent.js) |
| **Student Enrolled Courses View** | Backend: [StudyNotion/server/controllers/profile.js](file:///c:/Users/Dell/OneDrive/Desktop/Aryan/Web%20Dev/StudyNotion/server/controllers/profile.js) (`getEnrolledCourses`)<br>Frontend: [EnrolledCourses.jsx](file:///c:/Users/Dell/OneDrive/Desktop/Aryan/Web%20Dev/StudyNotion/src/components/core/Dashboard/EnrolledCourses.jsx), [profileAPI.js](file:///c:/Users/Dell/OneDrive/Desktop/Aryan/Web%20Dev/StudyNotion/src/services/operations/profileAPI.js) |
| **Email Templates & Mail sender** | Backend: [StudyNotion/server/utils/mailSender.js](file:///c:/Users/Dell/OneDrive/Desktop/Aryan/Web%20Dev/StudyNotion/server/utils/mailSender.js), [StudyNotion/server/mail/templates/](file:///c:/Users/Dell/OneDrive/Desktop/Aryan/Web%20Dev/StudyNotion/server/mail/templates) |
| **Global State (Redux Slices)** | Frontend: [StudyNotion/src/redux/slices/](file:///c:/Users/Dell/OneDrive/Desktop/Aryan/Web%20Dev/StudyNotion/src/redux/slices) (`authSlice.js`, `cartSlice.js`, `profileSlice.js`) |
| **Client API Route Map** | Frontend: [StudyNotion/src/services/APIs.js](file:///c:/Users/Dell/OneDrive/Desktop/Aryan/Web%20Dev/StudyNotion/src/services/APIs.js) |
