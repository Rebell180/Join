import { Timestamp } from "@angular/fire/firestore";
import { TaskStatusType } from "../enums/task-status-type";
import { Priority } from "../enums/priority.enum";
import { Category } from "../enums/category.enum";

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
