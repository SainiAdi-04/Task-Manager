const Task = require("../models/Task");

const getTasks = async (req, res) => {
    try {
        const { status } = req.query;
        let filter = {};
        if (status) {
            filter.status = status;
        }

        const baseFilter = req.user.role === "admin" ? {} : { assignedTo: req.user._id };

        let tasks = await Task.find({ ...filter, ...baseFilter }).populate(
            "assignedTo",
            "name email profileImageUrl"
        );

        // Add completed todo count to each task
        tasks = await Promise.all(
            tasks.map(async (task) => {
                const completedCount = task.todoChecklist.filter(
                    (item) => item.completed
                ).length;
                return { ...task._doc, completedTodoCount: completedCount };
            })
        );

        // Status summary counts
        const allTasks = await Task.countDocuments(baseFilter);

        const pendingTasks = await Task.countDocuments({
            ...baseFilter,
            status: "Pending",
        });

        const inProgressTasks = await Task.countDocuments({
            ...baseFilter,
            status: "In Progress",
        });

        const completedTasks = await Task.countDocuments({
            ...baseFilter,
            status: "Completed",
        });

        res.json({
            tasks,
            statusSummary: {
                all: allTasks,
                pendingTasks,
                inProgressTasks,
                completedTasks,
            },
        });
    } catch (err) {
        res.status(500).json({ message: "server error", error: err.message });
    }
};




const getTaskById = async (req, res) => {
    try {
        const task=await Task.findById(req.params.id).populate(
            "assignedTo",
            "name email profileImageUrl"
        )

        if(!task) return res.status(404).json({message:"Task not found"})
        res.json(task)
    } catch (err) {
        res.status(500).json({ message: "server error", error: err.message })
    }
}




const createTask = async (req, res) => {
    try {
        const {
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            attachments,
            todoChecklist
        } = req.body;

        if (!Array.isArray(assignedTo)) {
            return res.status(400).json({ message: "assignedTo must be an array of user IDs" });
        }

        const task = await Task.create({
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            createdBy: req.user._id,
            todoChecklist,
            attachments
        })
        res.status(201).json({ message: "Task created successfuly", task })
    } catch (err) {
        res.status(500).json({ message: "server error", error: err.message })
    }
}




const updateTask = async (req, res) => {
    try {
        const task=await Task.findById(req.params.id);

        if(!task) return res.status(404).json({messagge:"Task not found"})

        task.title=req.body.title||task.title
        task.description=req.body.description||task.description;
        task.priority=req.body.priority||task.priority;
        task.dueDate=req.body.dueDate||task.dueDate;
        task.todoChecklist=req.body.todoChecklist||task.todoChecklist;
        task.attachments=req.body.attachments||task.attachments;

        if(req.body.assignedTo){
            if(!Array.isArray(req.body.assignedTo)){
                return res.status(400).json({message:"assignedTo must be an array of user IDs"})
            }
            task.assignedTo=req.body.assignedTo;
        }

        const updatedTask=await task.save();
        res.json({message:"Task updated successfully", updatedTask});

    } catch (err) {
        res.status(500).json({ message: "server error", error: err.message })
    }
}




const deleteTask = async (req, res) => {
    try {
        const task=await Task.findById(req.params.id);
        if(!task) return res.status(404).json({message:"task not found"});

        await task.deleteOne();
        res.json({message:"task deleted"})
    } catch (err) {
        res.status(500).json({ message: "server error", error: err.message })
    }
}




const updateTaskStatus = async (req, res) => {
    try {
        const task=await Task.findById(req.params.id);
        if(!task) return res.status(404).json({message:"Task not found"}) 

        const isAssigned=task.assignedTo.some(
            (userId)=>userId.toString()===req.user._id.toString()
        )    
        if(!isAssigned&&req.user.role!="admin"){
            return res.status(403).json({message:"Not Authorized"})
        }

        task.status=req.body.status||task.status;

        if(task.status==="Completed"){
            task.todoChecklist.forEach(item=> item.completed=true);
            task.progress=100
        }

        await task.save();
        res.json({message:"Task status updated",task})

    } catch (err) {
        res.status(500).json({ message: "server error", error: err.message })
    }
}




const updateTaskChecklist = async (req, res) => {
    try {
        const {todoChecklist}=req.body;
        const task=await Task.findById(req.params.id);

        if(!task) return res.status(404).json({message:"Task not found"})

        if(!task.assignedTo.includes(req.user._id)&&req.user.role!=="admin"){
            return res.status(403).json({message:"Not authorized to update checklist"})
        }

        task.todoChecklist=todoChecklist;//replace with updated task


        //auto-update progress based on checklist completion
        const completedCount=task.todoChecklist.filter(
            (item)=>item.completed
        ).length;
        const totalItems=task.todoChecklist.length;
        task.progress=totalItems>0?Math.round((completedCount/totalItems)*100):0;

        

        //auto mark task as completed if all items are checked
        if(task.progress===100){
            task.status="Completed"
        }
        else if(task.progress>0){
            task.status="In Progress"
        }
        else{
            task.status="Pending"
        }

        await task.save();
        const updatedTask=await Task.findById(req.params.id).populate(
            "assignedTo",
            "name email profileImageUrl"
        )

        res.json({message:"Task checklist updated",task:updatedTask})



    } catch (err) {
        res.status(500).json({ message: "server error", error: err.message })
    }
}




const getDashboardData = async (req, res) => {
    try {
        const totalTasks=await Task.countDocuments();
        const pendingTasks=await Task.countDocuments({status:"Pending"});
        const completedTasks=await Task.countDocuments({status:"Completed"});
        const overdueTasks=await Task.countDocuments({
            status:{$ne:"Completed"},
            dueDate:{$lt:new Date()}
        })

        //ensure all possible statuses are included
        const taskStatuses=["Pending","In Progress","Completed"]
        const taskDistributionRaw=await Task.aggregate([
            {
                $group:{
                    _id:"$status",
                    count:{$sum:1}
                }
            }
        ])
        const taskDistribution=taskStatuses.reduce((acc,status)=>{
            const formattedKey=status.replace(/\s+/g,""); //remove spaces for response key
            acc[formattedKey]=
            taskDistributionRaw.find((item)=>item._id===status)?.count||0;
            return acc
        },{})
        taskDistribution["All"]=totalTasks;  //add total count to taskDistribution

        //ensure all priority levels are included
        const taskPriorities=["Low","Medium","High"];
        const taskPriorityLevelRaw=await Task.aggregate([
            {
                $group:{
                    _id:"$priority",
                    count:{$sum:1}
                }
            }
        ])

        const taskPriorityLevels=taskPriorities.reduce((acc,priority)=>{
            acc[priority]=
            taskPriorityLevelRaw.find((item)=>item._id===priority)?.count||0;
            return acc;
        },{})

        //fetch recent 10 tasks
        const recentTasks=await Task.find()
        .sort({createdAt:-1})
        .limit(10)
        .select("title status priority dueDate createdAt")


        res.status(200).json({
            statistics:{
                totalTasks,
                pendingTasks,
                completedTasks,
                overdueTasks
            },
            charts:{
                taskDistribution,
                taskPriorityLevels
            },
            recentTasks
        })
    } catch (err) {
        res.status(500).json({ message: "server error", error: err.message })
    }
}




const getUserDashboardData = async (req, res) => {
    try {
        const userId=req.user._id;

        //fetch statistics for user-specific tasks
        const totalTasks=await Task.countDocuments({assignedTo:userId});
        const pendingTasks=await Task.countDocuments({assignedTo:userId, status:"Pending"})
        const completedTasks=await Task.countDocuments({assignedTo:userId, status:"Completed"})
        const overdueTasks=await Task.countDocuments({assignedTo:userId,
            status:{$ne:"Completed"},
            dueDate:{$lt:new Date()}
        });

        //Task distribution by status
        const taskStatuses=["Pending","In Progress","Completed"];
        const taskDistributionRaw=await Task.aggregate([
            {$match:{assignedTo:userId}},
            {$group:{_id:"$status", count:{$sum:1}}}
        ])

        const taskDistribution=taskStatuses.reduce((acc,status)=>{
            const formattedKey=status.replace(/\s+/g,"")
            acc[formattedKey]=
            taskDistributionRaw.find((item)=>item._id==status)?.count||0;
            return acc
        },{});
        taskDistribution["All"]=totalTasks;

        //Task distribution by priority
        const taskPriorities=["Low","Medium","High"];
        const taskPriorityLevelsRaw=await Task.aggregate([
            {$match:{assignedTo:userId}},
            {$group:{_id:"$priority", count:{$sum:1}}}
        ])

        const taskPriorityLevels=taskPriorities.reduce((acc,priority)=>{
            acc[priority]=
            taskPriorityLevelsRaw.find((item)=>item._id===priority)?.count||0;
            return acc
        },{})

        //fetch recent 10 tasks for the logged-in user
        const recentTasks=await Task.find({assignedTo:userId})
        .sort({createdAt:-1})
        .limit(10)
        .select("title status priority dueDate createdAt")

        res.status(200).json({
            statistics:{
                totalTasks,
                pendingTasks,
                completedTasks,
                overdueTasks
            },
            charts:{
                taskDistribution,
                taskPriorityLevels
            },
            recentTasks
        })
    } catch (err) {
        res.status(500).json({ message: "server error", error: err.message })
    }
}




module.exports = {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    updateTaskChecklist,
    getDashboardData,
    getUserDashboardData
}