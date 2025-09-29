export class Contact {

    id: string = "";
    firstname: string = "";
    lastname: string = "";
    email: string = "";
    telnr: string = "";
    group: string = "*";
    bgcolor: string = "lightgrey";



    constructor() {

    }

    toJson() {
        return {
            id: this.id || "",
            firstname: this.firstname || "",
            lastname: this.lastname || "",
            email: this.email || "",
            telnr: this.telnr || "",
            group: this.firstname[0] || "*",
            bgcolor: this.bgcolor
        }
    }
}
