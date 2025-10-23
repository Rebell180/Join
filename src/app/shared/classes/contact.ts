import { ContactObject } from "../interfaces/contact-object";
import { DBObject } from "../interfaces/db-object";

/**
 * Contains a single contact object.
 */
export class Contact implements DBObject {

    // #region properties

    /** id of contact in database, empty, if not exist in database */
    id: string = '';

    /** firstname of contact */
    firstname: string = '';

    /** lastname of contact */
    lastname: string = '';
    
    /** roup contains letter for register */
    group: string = '';
    
    /** email of contact */
    email: string = '';
    
    /** phonenumber of contact */
    tel: string = '';
    
    /** background-color of contact-icon */
    iconColor: string = this.getRandomIconColor();

    /** indicator for selection in contact-list */
    selected: boolean = false;
    
    // #endregion properties

    /**
     * @param data is optional and from @type object {
     *      id: string          => id of contact in database, empty, if not exist in database
     *      firstname: string   => firstname of contact
     *      lastname: string    => lastname of contact
     *      group: string       => group contains letter for register
     *      email: string       => email of contact
     *      tel: string         => phonenumber of contact
     *      iconColor: string   => background-color of contact-icon 
     * }
     */
    constructor(data?: ContactObject) {   
        if(data) {
            this.id = data.id;
            this.firstname = data.firstname,
            this.lastname = data.lastname,
            this.group = data.group,
            this.email = data.email,
            this.tel = data.tel,
            this.iconColor = data.iconColor;
        }
    }

    // #region Methods

    /**
     * Returns the complete name containing firstname and lastname.
     * @returns full name as string
     */
    getFullName(): string {
        return (this.firstname + ' ' + this.lastname);
    }
    
    /**
     * Compares this object, with another object
     * @param other - Instance for compare.
     * @returns true, it both objects are the same
     */
    equals(other: unknown): boolean {
        if (!(other instanceof Contact)) return false;
        return this.id == other.id;
    }
    
    /**
     * Returns a JSON-string from contact.
     * 
     * @returns - the contact data as JSON.
    */
    toJSON() {
        return {
            id: this.id,
            firstname: this.firstname,
            lastname: this.lastname,
            email: this.email,
            tel: this.tel,
            group: this.group,
            iconColor: this.iconColor
        };
    }

    /**
     * Gets a random color for new Contacts
      * @returns - a random color.
      */
    private getRandomIconColor(): string {
        const colors: string[] = ['orange', 'purple', 'blue', 'pink', 'yellow', 'green'];
        return colors[Math.floor(colors.length * Math.random())];
    }
    
    // #endregion methods
}