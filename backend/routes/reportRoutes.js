const express=require('express');
const { protect, adminsOnly } = require('../middlewares/authMiddleware');
const {exportTasksReport, exportUsersReport} = require("../controllers/reportController");
const router=express.Router()

router.get("/export/tasks",protect,adminsOnly,exportTasksReport);
router.get("/export/users",protect, adminsOnly, exportUsersReport);

module.exports=router;