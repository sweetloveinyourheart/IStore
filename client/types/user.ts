export enum UserRoles {
    Teacher = 'teacher',
    Student = 'student'
}

export interface UserInterface {
    username: string
    name: string
    age: number
    createAt: Date
}
