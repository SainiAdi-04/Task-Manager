import {
    LuLayoutDashboard,
    LuUsers,
    LuClipboardCheck,
    LuSquarePlus,
    LuLogOut
} from "react-icons/lu";

export const SIDE_MENU_DATA=[
    {
        id:"01",
        label:"Dashboard",
        icon:LuLayoutDashboard,
        path: "/admin/dashboard",
    },
    {
        id:"02",
        label:"Manage Tasks",
        icon:LuClipboardCheck,
        path: "/admin/tasks",
    },
    {
        id:"03",
        label:"Create Tasks",
        icon:LuSquarePlus,
        path: "/admin/create-tasks",
    },
    {
        id:"04",
        label:"Team Members",
        icon:LuUsers,
        path: "/admin/users",
    },
    {
        id:"05",
        label:"Logout",
        icon:LuLogOut,
        path: "/admin/logout",
    }
];

export const SIDE_MENU_USER_DATA=[
    {
        id:"01",
        label:"Dashboard",
        icon:LuLayoutDashboard,
        path: "/user/dashboard",
    },
    {
        id:"02",
        label:"My Tasks",
        icon:LuClipboardCheck,
        path:"/user/my-tasks",
    },
    {
        id:"05",
        label:"Logout",
        icon:LuLogOut,
        path:"/login",
    }
];

export const PRIORITY_DATA=[
    {label: "Low", value:"Low"},
    {label: "Medium", value:"Medium"},
    {label: "High", value:"High"}
]

export const STATUS_DATA=[
    {label:"Pending", value:"Pending"},
    {label:"In Progress", value:"In Progress"},
    {label:"Completed", value:"Completed"},
]