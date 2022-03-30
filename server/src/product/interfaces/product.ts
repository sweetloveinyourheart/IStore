import { Category } from "src/category/models/category.model"

export interface Product {
    _id: string
    image: string
    name: string
    price: {
        S?: number | undefined,
        M?: number | undefined,
        L?: number | undefined
    }
    status: boolean
    category: Category
}