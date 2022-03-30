import { Product } from "./product"
import { Voucher } from "./voucher"

export interface BillState {
    customer: {
        name: string
        username?: string
    }
    items: {
        product: Product
        quantity: number
        size: 'S' | 'M' | 'L'
    }[]
    voucher?: Voucher
    totalPrice: number
    createAt?: Date
}

export interface Bill {
    _id: string
    code: string
    customer: {
        name: string
        username?: string
    }
    items: {
        product: Product
        quantity: number
        size: 'S' | 'M' | 'L'
    }[]
    voucher?: Voucher
    totalPrice: number
    createAt: Date
}

export interface CardUser {
    name: string
    username: string
    age: number
    createAt: Date
}


export interface ApplyResponse {
    vouchers: Voucher[] | null
    user: CardUser
}