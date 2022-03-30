import { forwardRef } from "react";
import { BillState } from "../../types/bill";
import styles from './paper.module.scss'
import Moment from 'react-moment';

interface PaperProps {
    width: number
    height: number
    bill: BillState
}

const Paper = forwardRef(({ width, height, bill }: PaperProps, ref: any) => {
    const renderProduct = () => {
        return bill.items.map((value, index) => {
            const { quantity, product, size } = value
            const price = product.price[size] || 0

            return (
                <tr key={index}>
                    <td>{product.name}</td>
                    <td> {quantity} </td>
                    <td>{Intl.NumberFormat().format(price)}</td>
                    <td>{Intl.NumberFormat().format(price * quantity)}</td>
                </tr>
            )
        })
    }

    return (
        <div className={styles.paper} style={{ width, height }} ref={ref}>
            <div className={styles['shop-info']}>
                <div className={styles['shop-info__name']}>
                    B.Education
                </div>
                <div className={styles['shop-info__address']}>
                    560 Lê Duẩn - P. Ea Tam - TP. BMT - Đắk Lắk
                </div>
            </div>
            <h5> Phiếu thanh toán </h5>
            <div className={styles['customer']}>
                <div className={styles['customer__info']}>
                    <span> Tên khách hàng: </span>
                    <p>{bill.customer.name}</p>
                </div>
                <div className={styles['customer__info']}>
                    <span> Thời gian: </span>
                    <Moment format="HH:mm - DD/MM/yy">{bill.createAt ? bill.createAt : new Date()}</Moment>
                </div>
                {bill.voucher
                    && (
                        <div className={styles['customer__info']}>
                            <span> Voucher áp dụng: </span>
                            <p>{bill.voucher.shopVoucher.label}</p>
                        </div>
                    )
                }
                <div className={styles['products']}>
                    <table>
                        <thead>
                            <tr>
                                <th> Sản phẩm </th>
                                <th> SL </th>
                                <th> Đơn giá </th>
                                <th> Tổng </th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderProduct()}
                        </tbody>
                    </table>
                </div>
                <div className={styles['total']}>
                    <div className={styles['total__title']}>Thành tiền: </div>
                    <div className={styles['total__cost']}>
                        {Intl.NumberFormat().format(bill.totalPrice)} đ
                    </div>
                </div>
                <div className={styles['welcome']}> Chúc quý khách vui vẻ, hẹn gặp lại ! </div>
            </div>
        </div>
    );
})

Paper.displayName = "Paper";

export default Paper;
