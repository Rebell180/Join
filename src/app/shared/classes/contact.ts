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
        this.iconColor = iconColor
    }
}
