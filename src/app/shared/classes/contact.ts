export class Contact {

    // #region Attributes
    id: string;
    firstname: string;
    lastname: string;
    group: string;
    email: string;
    tel: string;
    selected: boolean = false;
    iconColor: string | null;
    active: boolean = false;
    // #endregion

    /**
     * Creates a contact.
     * @param id - Id of contact in database, empty, if not exiist in database.
     * @param firstname - First name of contact.
     * @param lastname - Last name of contact.
     * @param group - Group of letter in register.
     * @param email - E-Mail of contact.
     * @param tel - Phone number of contact.
     * @param iconColor - Background-Color of User-Icon, null for new contacts, who doesn't exists in database. 
     */
    constructor({ id = '', firstname, lastname, group, email, tel, iconColor = null }: {
        id: string,
        firstname: string,
        lastname: string,
        group: string,
        email: string,
        tel: string,
        iconColor: string | null
    }) {
        this.id = id;
        this.firstname = firstname,
            this.lastname = lastname,
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
    equals(other: unknown): boolean {
        if (!(other instanceof Contact)) return false;
        return this.id == other.id;
    }
    /**
     * Gets a JSON-String from Contact.
     * @returns - Contact as JSON.
    */
    toJson() {
        return {
            id: this.id || "",
            firstname: this.firstname || "",
            lastname: this.lastname || "",
            email: this.email || "",
            tel: this.tel || "",
            group: this.group || "",
            iconColor: this.iconColor || Contact.getRandomIconColor()
        }
    }
    /**
     * Gets a random color for new Contacts
      * @returns - a random color.
      */
    static getRandomIconColor(): string {
        const colors: string[] = ['orange', 'purple', 'blue', 'pink', 'yellow', 'green'];
        return colors[Math.floor(colors.length * Math.random())];
    }
    // #endregion
}