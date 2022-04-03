import { BillItems } from "../redux/slices/billSlice"

export interface ShopTable {
    name: string
    items: BillItems[]
    area: string
}