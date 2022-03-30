export enum VoucherType {
    Discount = 'discount'
}

export interface Voucher {
    _id: string
    owner: string
    label: string
    type: VoucherType
    value: number
    count: number
    limit: {
        min: number
        max: number
    }
    available: boolean
    createAt: Date
}