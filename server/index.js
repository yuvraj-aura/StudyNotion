const express = require("express");
const app = express();

// importing routes
const courseRoutes = require("./routes/Course");
const paymentRoutes = require("./routes/Payments");
const profileRoutes = require("./routes/Profile");
const userRoutes = require("./routes/User");

const cookieParser = require("cookie-parser");
const cors = require("cors");

// importing connections
const dbConnect = require("./config/database");
const { cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload")

require("dotenv").config();
const port = process.env.PORT || 3000;

// importing middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
)

app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp",
    })
)

// making routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);


app.get('/', (req, res) => {
    return res.status(200).json({
        success: true,
        message: 'Successfully loaded the home page babe',
    });
});

app.listen(port, () => {
    console.log(`App is successfully listening at port ${port}`);
})


// db connection
dbConnect();
cloudinaryConnect();