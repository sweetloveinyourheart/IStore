export interface Product {
    _id: string
    image: string
    name: string
    price: {
        S?: number, 
        M?: number, 
        L?: number 
    }
    status: boolean
    category: string
}