const express = require('express')
const userRouter = express.Router()

const { registerUser, userLogin, userLogout, getMyProfile, getAllAuthors } = require('../controllers/userController')
const {authenticate} = require('../middlewares/auth')

userRouter.get("/", (req, res)=>{
    res.send("Hello blogs 2309")
});
userRouter.post("/user/register", registerUser);
userRouter.post("/user/login", userLogin);
userRouter.get("/user/logout", authenticate, userLogout);
userRouter.get("/user/profile", authenticate, getMyProfile);
userRouter.get("/user/authors", getAllAuthors);

module.exports = userRouter;