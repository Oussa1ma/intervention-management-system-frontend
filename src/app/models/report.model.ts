export interface Report {
    _id?: string
    title?: string
    content?: string
    dateCreation?: string
    owner?: string // report's owner id
    task?: string // related task id
}