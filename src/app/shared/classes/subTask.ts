export class Subtask {
	id: string;
	taskId: string;
	name: string;
	finished: string;

	constructor({id = '', taskId = '', name, finished}:{
		id: string,
		taskId: string,
		name: string,
		finished: string
	}) {
		this.id = id;
		this.taskId = taskId;
		this.name = name;
		this.finished = finished;
	}

	toJsonSubTask() {
		return {
		id: this.id || "",
		taskId: this.taskId || "",
		name: this.name || "",
		finished: this.finished || "",
		}
	}
}