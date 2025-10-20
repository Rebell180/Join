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