import { DBObject } from "../interfaces/db-object";

export class Task implements DBObject{

	// #region Attributes
	id: string;
	title: string;
	description: string;
	dueDate: string;
	priority: string;
	category: string;
	assignedTo: string;
	subtasks: boolean = true;
	// #endregion

	constructor({ id = '', title, description, dueDate, priority, category, assignedTo, subtasks }: {
		id: string,
		title: string,
		description: string,
		dueDate: string,
		priority: string,
		category: string,
		assignedTo: string,
		subtasks: boolean,
	}) {
		this.id = id;
		this.title = title;
		this.description = description;
		this.dueDate = dueDate;
		this.priority = priority;
		this.category = category;
		this.assignedTo = assignedTo;
		this.subtasks = subtasks;
	}

	/**
	 * Returns a plain JSON-compatible object representing the current Task instance.
	 *
	 * @returns {Object} An object containing all Task properties.
	 *
	 * @description
	 * - convert the Task into a JSON string.
	 * - || operator provides default fallback values if a property is `undefined` or empty.
	 * - ?? mullish operator ensures that `false` for `subtasks`
	 * - is preserved and not overwritten by the default value.
	 */
	toJSON(): object {
		return {
			id: this.id || "",
			title: this.title || "",
			description: this.description || "",
			dueDate: this.dueDate || "",
			priority: this.priority || "",
			category: this.category || "",
			assignedTo: this.assignedTo || "",
			subtasks: this.subtasks ?? true
		}
	}
}