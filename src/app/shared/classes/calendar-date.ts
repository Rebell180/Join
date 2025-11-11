export class CalendarDate {

    date: Date;
    inCurMonth: boolean = true;
    inNextMonth: boolean = false;
    inLastMonth: boolean = false;


    constructor(newDate: Date) {
        this.date = newDate;
    }   

    public setMonth(typeOfMonth?: 'last' | 'next') {
        this.inCurMonth = false;
        this.inNextMonth = false;
        this.inLastMonth = false;

        switch(typeOfMonth) {
            case 'last':
                this.inLastMonth = true;
                break;
            case 'next':
                this.inNextMonth = true;
                break;
            default: 
                this.inCurMonth = true;
                break;
        }
    }

}