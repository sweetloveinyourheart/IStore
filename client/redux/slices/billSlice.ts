import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CardUser } from "../../types/bill";
import { Product } from "../../types/product";
import { Voucher } from "../../types/voucher";

export interface BillItems {
    product: Product,
    size: 'S' | 'M' | 'L'
    quantity: number
}

export interface InitialState {
    items: BillItems[]
    rootPrice: number
    voucher?: Voucher
    user?: CardUser
}

const initialState: InitialState = {
    items: [],
    rootPrice: 0
}

const billSlice = createSlice({
    name: 'bill',
    initialState,
    reducers: {
        addProduct: (state, actions: PayloadAction<BillItems>) => {
            let currentState = [...state.items]

            state.items = [...currentState, actions.payload]
        },

        addProductList: (state, actions: PayloadAction<BillItems[]>) => {
            state.items = actions.payload
        },

        changeQuantity: (state, actions: PayloadAction<{ index: number, quantity: number }>) => {
            if (actions.payload.quantity === 0) {
                return;
            }

            state.items[actions.payload.index].quantity = actions.payload.quantity      
        },

        changeSize: (state, actions: PayloadAction<{ index: number, size: "S" | "M" | "L" }>) => {
            state.items[actions.payload.index].size = actions.payload.size
        },

        removeProduct: (state, actions: PayloadAction<{ index: number }>) => {
            let currentState = [...state.items]

            state.items = currentState.filter((v, i) => i !== actions.payload.index)
        },

        resetBill: (state) => {
            state.items = []
            state.voucher = undefined
            state.user = undefined
        },

        applyVoucherCard: (state, actions: PayloadAction<{ user: CardUser, voucher?: Voucher }>) => {
            state.user = actions.payload.user
            state.voucher = actions.payload.voucher
        },

        updateRootPrice: (state, actions: PayloadAction<number>) => {
            state.rootPrice = actions.payload
        },

        removeVoucher: (state) => {
            state.voucher = undefined
        }
    }
})

export const {
    addProduct,
    changeQuantity,
    changeSize,
    removeProduct,
    resetBill,
    applyVoucherCard,
    updateRootPrice,
    removeVoucher,
    addProductList
} = billSlice.actions

export default billSlice.reducer
