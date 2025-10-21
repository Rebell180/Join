import { Timestamp } from "@angular/fire/firestore";
import { Category } from "../enums/category.enum";
import { Priority } from "../enums/priority.enum";
import { TaskStatusType } from "../enums/task-status-type";

export interface ContactObject {
    id: string,
    firstname: string,
    lastname: string,
    group: string,
    email: string,
    tel: string,
    iconColor: string
}

export interface SubTaskObject {
    id: string,
    taskId: string,
    name: string,
    finished: boolean
}

export interface TaskObject {
    id: string,
    title: string,
    description: string,
    dueDate: Timestamp,
    priority: Priority,
    category: Category,
    assignedTo: string[],
    hasSubtasks: boolean, 
    status: TaskStatusType
}