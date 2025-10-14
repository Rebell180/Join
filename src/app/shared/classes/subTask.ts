export class Subtask {
	id: string;
	taskId: string;
	name: string;
	finished: boolean;

	constructor({id = '', taskId = '', name = '', finished = false}:{
		id: string,
		taskId: string,
		name: string,
		finished: boolean
	}) {
		this.id = id;
		this.taskId = taskId;
		this.name = name;
		this.finished = finished;
	}

	toJson() {
		return {
			id: this.id || "",
			taskId: this.taskId || "",
			name: this.name || "",
			finished: this.finished || false,
		}
	}
}