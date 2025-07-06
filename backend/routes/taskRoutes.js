const express=require('express');
const {protect, adminsOnly}= require("../middlewares/authMiddleware");
const { getTasks, getTaskById, createTask, updateTask, deleteTask, updateTaskStatus, updateTaskChecklist, getUserDashboardData, getDashboardData } = require('../controllers/taskController');

const router=express.Router();

router.get("/dashboard-data",protect, getDashboardData);
router.get("/user-dashboard-data", protect, getUserDashboardData);
router.get("/", protect, getTasks);
router.get("/:id",protect, getTaskById);
router.post("/", protect, adminsOnly, createTask);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, adminsOnly, deleteTask);
router.put("/:id/status", protect, updateTaskStatus);
router.put("/:id/todo", protect, updateTaskChecklist);

module.exports=router;