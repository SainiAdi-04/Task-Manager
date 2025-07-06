const Task = require("../models/Task");
const User = require("../models/User");
const bcrypt = require("bcryptjs");


// @desc get all users (admins only)
// @route GET/api/users/
// @access Private(Admin)
const getUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'member' }).select("-password");

        const userWithTaskCounts = await Promise.all(users.map(async (user) => {
            const pendingTasks = await Task.countDocuments({ assignedTo: user._id, status: "Pending" });
            const infoProgressTasks = await Task.countDocuments({ assignedTo: user._id, status: "In Progress" });
            const completedTasks = await Task.countDocuments({ assignedTo: user._id, status: "Completed" });

            return {
                ...user._doc,
                pendingTasks,
                infoProgressTasks,
                completedTasks
            }
        }))

        res.json(userWithTaskCounts)

    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message })
    }
}


// @desc Get user by id
// @route GET/api/users/:id
// @access Private
const getUserById = async (req, res) => {
    try {
        const user=await User.findById(req.params.id).select("-password");
        if(!user)
            return res.status(400).json({message:"user not found"})

        res.json(user);

    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message })
    }

}


module.exports = { getUsers, getUserById}
