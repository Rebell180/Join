export class Contact {

    // #region Attributes
    id: string;
    firstName: string;
    lastName: string;
    group: string;
    email: string;
    tel: string;
    selected: boolean = false;
    iconColor: string | null;
    // #endregion

    /**
     * Creates a contact.
     * @param id - Id of contact in database, empty, if not exiist in database.
     * @param firstName - First name of contact.
     * @param lastName - Last name of contact.
     * @param group - Group of letter in register.
     * @param email - E-Mail of contact.
     * @param tal - Phone number of contact.
     * @param iconColor - Background-Color of User-Icon, null for new contacts, who doesn't exists in database. 
     */
    constructor({id = '', firstName, lastName, group, email, tel, iconColor = null}: {
        id: string,
        firstName: string,
        lastName: string,
        group: string,
        email: string,
        tel: string,
        iconColor: string | null
    }) {
        this.id = id;
        this.firstName = firstName,
        this.lastName = lastName,
        this.group = group,
        this.email = email,
        this.tel = tel,
        this.iconColor = iconColor ? iconColor : Contact.getRandomIconColor();
    }

    // #region Methods
    /**
     * Compares this object, with another object
     * @param other - Instance for compare.
     * @returns true, it both objects are the same
     */
    equals(other:unknown):boolean {
        if (!(other instanceof Contact)) return false;
        return this.firstName == other.firstName && this.lastName == other.lastName;
    }
    // #endregion

    /**
     * Gets a random color for new Contacts
     * @returns - a random color.
     */
    static getRandomIconColor():string {
        const colors:string[] = ['orange', 'purple', 'blue', 'pink', 'yellow', 'green'];
        return colors[Math.floor(colors.length * Math.random())];
    }
}
