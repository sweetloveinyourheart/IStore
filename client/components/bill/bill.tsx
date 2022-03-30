import Image from "next/image";
import { FunctionComponent, useCallback, useEffect, useRef, useState } from "react";
import { BiBookContent, BiCheck, BiRefresh, BiX } from "react-icons/bi";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { changeQuantity, changeSize, removeProduct, removeVoucher, resetBill, updateRootPrice } from "../../redux/slices/billSlice";
import { Bill, BillState } from "../../types/bill";
import { useReactToPrint } from 'react-to-print';
import styles from './bill.module.scss'
import Paper from "../paper/paper";
import Card from "../card/card";
import { useSession } from "next-auth/react";
import { clientSideAPI } from "../../utils/img";
import { Product } from "../../types/product";
import Moment from "react-moment";
import Table from "../table/table";

interface BillProps { }

const Bill: FunctionComponent<BillProps> = () => {
    const [bill, setBill] = useState<BillState>({
        customer: {
            name: 'Khách lẻ'
        },
        items: [],
        voucher: undefined,
        totalPrice: 0
    })
    const [tableActive, setTableActive] = useState<boolean>(false)

    const paperRef = useRef(null);

    const { data: session } = useSession()

    const { items, user, voucher } = useAppSelector(s => s.bill)
    const dispatch = useAppDispatch()

    useEffect(() => {
        let totalPrice = 0
        let rootTotalPrice = 0

        items.forEach(v => {
            let price = v.product.price[v.size]
            totalPrice += price ? price * v.quantity : 0
        })
        rootTotalPrice = totalPrice
        dispatch(updateRootPrice(rootTotalPrice))

        if (user) {
            if (voucher) {
                if (voucherChecker(voucher.shopVoucher.limit, rootTotalPrice)) {
                    totalPrice = totalPrice - (voucher.shopVoucher.value > 100 ? voucher.shopVoucher.value : totalPrice * voucher.shopVoucher.value / 100)
                } else {
                    dispatch(removeVoucher())
                }
            }
        }

        setBill(s => ({
            ...s,
            voucher,
            items,
            totalPrice: totalPrice > 0 ? totalPrice : 0,
            customer: {
                name: user ? user.name : 'Khách lẻ',
                username: user ? user.username : undefined
            }
        }))
    }, [items, voucher, user])

    const voucherChecker = useCallback((limit: { min: number, max: number }, applyPrice: number): boolean => {
        if ((applyPrice >= limit.min))
            if ((limit.max !== 0 && applyPrice <= limit.max) || limit.max == 0)
                return true

        return false
    }, [])

    const resetNewBill = useCallback(() => {
        dispatch(resetBill())
        setBill(s => ({
            ...s,
            customer: {
                name: 'Khách lẻ'
            },
            vouchers: undefined,
            preferential: 0
        }))
    }, [])

    const handlePrint = useReactToPrint({
        content: () => paperRef.current,
        onAfterPrint: async () => {
            try {
                const body = {
                    ...bill,
                    voucher: voucher?._id
                }

                const res = await fetch(clientSideAPI + '/bill/new', {
                    method: "POST",
                    headers: {
                        "Content-Type": 'application/json',
                        "Authorization": `Bearer ${session?.accessToken}`
                    },
                    body: JSON.stringify(body)
                })
                const result = await res.json()

                if (result?.statusCode >= 400) throw Error()

                resetNewBill()

            } catch (error) {
                alert('In thất bại, vui lòng thử lại !')
            }
        }
    });

    const onChangeTableStatus = useCallback(() => {
        setTableActive(s => !s)
    }, [tableActive])

    const payForTable = useCallback((tableBill: BillState) => {
        setBill(tableBill)
        setTableActive(false)
    }, [bill])

    const onSubmit = async () => {
        handlePrint()
    }

    const renderSizeOptions = (product: Product) => {
        const sizes = product.price
        return Object.keys(sizes).map((key, id) => {
            return <option value={key} key={id}> {key} </option>
        })
    }

    const renderProduct = () => {
        return bill.items.map((value, index) => {
            const { quantity, product, size } = value
            const price = product.price[size] || 0

            return (
                <tr key={index}>
                    <td>{product.name}</td>
                    <td >
                        <div className={styles['quantity']}>
                            <button
                                className={styles['quantity__desc']}
                                onClick={() => dispatch(changeQuantity({ index, quantity: quantity - 1 }))}
                            >
                                -
                            </button>
                            <input
                                type="number"
                                value={quantity}
                                onChange={e => dispatch(changeQuantity({ index, quantity: Number(e.target.value) }))}
                            />
                            <button
                                className={styles['quantity__incr']}
                                onClick={() => dispatch(changeQuantity({ index, quantity: quantity + 1 }))}
                            >
                                +
                            </button>
                        </div>
                    </td>
                    <td>
                        <select
                            value={size}
                            //@ts-ignore
                            onChange={e => dispatch(changeSize({ index, size: e.target.value }))}
                        >
                            {renderSizeOptions(product)}
                        </select>
                    </td>
                    <td>{Intl.NumberFormat().format(price)}</td>
                    <td>{Intl.NumberFormat().format(price * quantity)}</td>
                    <td onClick={() => dispatch(removeProduct({ index }))}> <BiX /> </td>
                </tr>
            )
        })
    }

    return (
        <div className={styles['bill']}>
            <div style={{ display: 'none' }}>
                <Paper
                    ref={paperRef}
                    width={320}
                    height={840}
                    bill={bill}
                />
            </div>

            {tableActive
                ? (
                    <Table 
                        close={onChangeTableStatus}
                        items={bill.items}
                    />
                )
                : (
                    <div>
                        <div className={styles['bill__head']}>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <Image
                                    src={"/logo.png"}
                                    width={150}
                                    height={150}
                                    alt="#"
                                />
                            </div>
                            <h6> Thông tin hóa đơn </h6>
                        </div>

                        <div className={styles['customer']}>
                            <div className={styles["customer__name"]}>
                                <label> Tên khách hàng: </label>
                                <span>{bill.customer.name}</span>
                            </div>
                        </div>

                        <div className={styles['customer__type']}>
                            <span> Thời gian: </span>
                            <Moment format="HH:mm - DD/MM/yy">{new Date()}</Moment>
                        </div>

                        <hr />
                        <div className={styles['products']}>
                            <div className={styles['products-table']}>
                                <table>
                                    <thead>
                                        <tr>
                                            <th> Sản phẩm </th>
                                            <th> SL </th>
                                            <th> Size </th>
                                            <th> Đơn giá </th>
                                            <th> Tổng </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {renderProduct()}
                                    </tbody>
                                </table>
                            </div>

                            <div className={styles['coupon-area']}>
                                <div className={styles['coupon-area__title']}>
                                    Voucher giảm giá:
                                </div>
                                {bill.voucher
                                    ? (
                                        <div className={styles['coupon-area__apply']}>
                                            <div className={styles["coupon"]}>
                                                <div className={`${styles["coupon__left"]}`}> 1 </div>
                                                <div className={`${styles["coupon__con"]}`}>
                                                    <div style={{ fontSize: 15, textTransform: "uppercase" }}>
                                                        {bill.voucher.shopVoucher.label}
                                                    </div>
                                                    <div style={{ borderTop: `1px dashed #fff`, fontSize: 14 }}>
                                                        Áp dụng
                                                        {bill.voucher.shopVoucher.limit.min ? ` từ ${Intl.NumberFormat().format(bill.voucher.shopVoucher.limit.min)} đ ` : ''}
                                                        {bill.voucher.shopVoucher.limit.max ? ` đến ${Intl.NumberFormat().format(bill.voucher.shopVoucher.limit.max)} đ` : ''}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                    : (
                                        <div className={styles['coupon-area__apply']}> Không áp dụng </div>
                                    )
                                }
                            </div>

                            <hr />
                            <div className={styles['total']}>
                                <div className={styles['total__title']}> Thành tiền: </div>
                                <div className={styles['total__cost']}>
                                    {Intl.NumberFormat().format(bill.totalPrice)} đ
                                </div>
                            </div>
                        </div>

                        <div className={styles['bill__foot']}>
                            <div>
                                <button
                                    className={`${styles['payment__btn']} ${styles['payment__btn--green']}`}
                                    onClick={() => onChangeTableStatus()}
                                >
                                    <BiBookContent />
                                    <span>Bàn</span>
                                </button>
                            </div>
                            <div className={styles['payment']}>
                                <button
                                    className={`${styles['payment__btn']} ${styles['payment__btn--red']}`}
                                    onClick={() => resetNewBill()}
                                >
                                    <BiRefresh />
                                    <span>Reset</span>
                                </button>
                                <button
                                    className={`${styles['payment__btn']} ${styles['payment__btn--blue']}`}
                                    onClick={() => onSubmit()}
                                >
                                    <BiCheck />
                                    <span>Xác nhận</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            <Card />
        </div>
    );
}

export default Bill;