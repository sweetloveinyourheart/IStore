export enum VoucherType {
    Discount = 'discount'
}

export interface Voucher {
    _id: string
    owner: string
    shopVoucher: ShopVoucher
    count: number
    createAt: Date
}

export interface ShopVoucher {
    _id: string
    label: string
    type: VoucherType
    value: number
    limit: {
        min: number
        max: number
    }
    createAt: Date
}