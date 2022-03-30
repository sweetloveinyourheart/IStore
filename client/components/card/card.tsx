import { FunctionComponent, useCallback, useEffect, useState } from "react";
import { BiCheckCircle, BiXCircle } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { useSocket } from "../../contexts/Socket";
import { useAppSelector } from "../../redux/hooks";
import { applyVoucherCard } from "../../redux/slices/billSlice";
import { ApplyResponse, CardUser } from "../../types/bill";
import { Voucher } from "../../types/voucher";
import styles from './card.module.scss'

interface CardProps { }

const Card: FunctionComponent<CardProps> = () => {
    const [user, setUser] = useState<CardUser>()
    const [vouchers, setVouchers] = useState<Voucher[]>([])
    const [selectedVoucher, setSelectedVoucher] = useState<Voucher>()

    const socket = useSocket()
    const dispatch = useDispatch()

    const { rootPrice } = useAppSelector(s => s.bill)

    useEffect(() => {
        socket.on('sendApplyRequest', (data: ApplyResponse) => {
            setUser(data.user)
            if (data.vouchers) {
                setVouchers(data.vouchers)
            }
        })
    }, [])

    const voucherChecker = useCallback((limit: { min: number, max: number }, applyPrice: number): boolean => {
        if ((applyPrice >= limit.min))
            if ((limit.max !== 0 && applyPrice <= limit.max) || limit.max == 0)
                return true

        return false
    }, [])

    const onSelectVoucher = useCallback((voucher: Voucher) => {
        if (voucherChecker(voucher.shopVoucher.limit, rootPrice))
            setSelectedVoucher(voucher)
    }, [vouchers])

    const setCouponStyle = useCallback((voucher: Voucher) => {
        if (voucher._id === selectedVoucher?._id) {
            return {
                left: `${styles["coupon__left"]} ${styles["coupon__left--active"]}`,
                con: `${styles["coupon__con"]} ${styles["coupon__con--active"]}`
            }

        }

        if (voucherChecker(voucher.shopVoucher.limit, rootPrice)) {
            return {
                left: `${styles["coupon__left"]}`,
                con: `${styles["coupon__con"]}`
            }
        }

        return {
            left: `${styles["coupon__left"]} ${styles["coupon__left--disable"]}`,
            con: `${styles["coupon__con"]} ${styles["coupon__con--disable"]}`
        }
    }, [selectedVoucher, rootPrice])

    const onCancel = useCallback(() => {
        setUser(undefined);
        setVouchers([]);
        setSelectedVoucher(undefined)
    }, [])

    const onAccept = useCallback(() => {
        if (!user) return;

        dispatch(applyVoucherCard({ user, voucher: selectedVoucher }))
        onCancel()
    }, [user, selectedVoucher])

    const renderVoucher = () => {
        if (!vouchers) return;

        return vouchers.map((value, index) => {
            return (
                <div className={styles["coupon"]} key={index} onClick={() => onSelectVoucher(value)}>
                    <div className={setCouponStyle(value).left}> x{value.count} </div>
                    <div className={setCouponStyle(value).con}>
                        <div style={{ fontSize: 15, textTransform: "uppercase" }}> {value.shopVoucher.label} </div>
                        <div style={{ borderTop: `1px dashed #fff`, fontSize: 14 }}>
                            Áp dụng
                            {value.shopVoucher.limit.min ? ` từ ${Intl.NumberFormat().format(value.shopVoucher.limit.min)} đ ` : ''}
                            {value.shopVoucher.limit.max ? ` đến ${Intl.NumberFormat().format(value.shopVoucher.limit.max)} đ` : ''}
                        </div>
                    </div>
                </div>
            )
        })
    }

    if (!user) return null

    return (
        <div className={styles['card']}>
            <h1> Áp dụng thẻ voucher </h1>
            <div className={styles['customer']}>
                <div className={styles["customer__name"]}>
                    <label> Tên khách hàng: </label>
                    <span>{user.name}</span>
                </div>
                <div className={styles["customer__type"]}>
                    <label> Tuổi: </label>
                    <span> {user.age} </span>
                </div>
                <div className={styles["customer__type"]}>
                    <label> Username: </label>
                    <span>{user.username}</span>
                </div>
            </div>
            <div className={styles['coupon-area']}>
                <div className={styles['coupon-area__title']}>
                    Voucher giảm giá:
                </div>
                <div className={styles['coupon-area__main']}>
                    {renderVoucher()}
                </div>
            </div>
            <div className={styles['submit']}>
                <button
                    className={`${styles['submit__btn']} ${styles['submit__btn--red']}`}
                    onClick={() => onCancel()}
                >
                    <BiXCircle />
                    <span>Hủy bỏ</span>
                </button>
                <button
                    className={`${styles['submit__btn']} ${user && styles['submit__btn--blue']}`}
                    disabled={user === undefined}
                    onClick={() => onAccept()}
                >
                    <BiCheckCircle />
                    <span>Xác nhận</span>
                </button>
            </div>
        </div>
    );
}

export default Card;