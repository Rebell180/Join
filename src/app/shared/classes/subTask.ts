import { SubTaskObject } from "../interfaces/database-result";
import { DBObject } from "../interfaces/db-object";

/**
 * Contain a single subtask object
 */
export class SubTask implements DBObject{

	/** id of subtask in database, empty, if not exist in database */
	id: string = '';

	/** foreign key of task in database */
	taskId: string = '';

	/** name of subtask */
	name: string = '';

	/** current status of subtask , true is finished, false is unfinished */
	finished: boolean = false;

	/** State, if user wants to edit it. */
	editMode: boolean = false;

	/**
     * @param data is optional and from @type object {
     *      id: string          => iid of subtask in database, empty, if not exist in database
     *      taskId: string   	=> foreign key of task in database
     *      name: string    	=> name of subtask
     *      finished: boolean   => current status of subtask , true is finished, false is unfinished 
     * }
     */
	constructor(data?: SubTaskObject){
		if(data) {
			this.id = data.id;
			this.taskId = data.taskId;
			this.name = data.name;
			this.finished = data.finished;
		}
	}

	/**
     * Returns a JSON-string from subtask.
     * 
     * @returns - the subtask data as JSON.
    */
	toJSON() {
		return {
			id: this.id,
			taskId: this.taskId,
			name: this.name,
			finished: this.finished
		}
	}
}