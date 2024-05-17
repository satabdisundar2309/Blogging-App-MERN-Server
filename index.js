const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("dotenv").config();
const port = process.env.PORT || 8000;

const cors = require("cors");
app.use(cors());

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const fileupload = require("express-fileupload");
app.use(
  fileupload({
    useTempFiles: true,
    tempFileDir: "/temp/",
  })
);

// ! Data base connection
const dbConnection = require("./config/dbConnection");
dbConnection();

// ! cloudinary connection
const cloudinaryConnection = require("./config/cloudinaryConnection");
cloudinaryConnection();
//! importing and mounting routes
const userRouter = require("./routes/userRoutes");
const blogRouter = require("./routes/blogRoutes");
app.use("/api/v1", userRouter);
app.use("/api/v1/blogs", blogRouter);

// ! Importing error middleware
const { errorMiddleware } = require("./middlewares/error");
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`App is listening at port ${port}`);
});
