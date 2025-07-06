const express=require('express');
const { adminsOnly, protect } = require('../middlewares/authMiddleware');
const {getUsers, getUserById}=require("../controllers/userController")
const router=express.Router()



router.get("/", protect, adminsOnly, getUsers); //get all users (admins only)
router.get("/:id",protect, getUserById); //get a specific user


module.exports=router;