import { Report } from "./report.model"

export interface Task{
    _id?: string
    title?: string
    type?: string
    priority?: string
    description?: string
    dateCreation?: Date
    progres?: Number
    client?: string
    seen?: Boolean
    technicien?: string
    username?: string
    report: Report
}