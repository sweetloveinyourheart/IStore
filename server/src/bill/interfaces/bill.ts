import { Product } from "src/product/interfaces/product"
import { Voucher } from "src/voucher/interfaces/voucher"

export interface BillInterface {
    _id: string
    code: string
    customer: {
        name: string
        type: string
        username?: string
    }
    items: {
        product: Product
        quantity: number
    }[]
    voucher?: Voucher
    totalPrice: number
    createAt: Date
}