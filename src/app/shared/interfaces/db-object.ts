export interface DBObject {
    
    id: string;

    /**
     * Converts object data into JS - object.
     * @return - JSON-Data as JS-Object
     */
    toJSON():{};
}
