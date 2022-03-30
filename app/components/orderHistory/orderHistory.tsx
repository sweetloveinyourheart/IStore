import { useSession } from "next-auth/react";
import { FunctionComponent, useEffect, useState } from "react";
import useSWR from "swr";
import { Bill } from "../../types/bill";
import { fetcher } from "../../utils/swr";
import styles from './orderHistory.module.scss'
import Moment from 'react-moment'
import { useRouter } from "next/router";

interface OrderHistoryProps {}

const OrderHistory: FunctionComponent<OrderHistoryProps> = () => {
    const [orders, setOrders] = useState<Bill[]>([])

    const { data: session } = useSession()
    const router = useRouter()
    const { data } = useSWR<Bill[]>(session?.accessToken ? [`/bill/user`, session?.accessToken] : null, fetcher)

    useEffect(() => {
        if (data) {
            setOrders(data)
        }
    }, [data])

    const renderOrders = () => {
        return orders.map((value, index) => {
            return (
                <tr key={index}>
                    <td> {value.code} </td>
                    <td> {value.customer.name} </td>
                    <td> {value.items.length} </td>
                    <td> <Moment format="DD/MM/yy">{value.createAt}</Moment> </td>
                    <td> {Intl.NumberFormat().format(value.totalPrice)} đ </td>
                    <td>
                        <button onClick={() => router.push(`/bill/${value.code}`)}> Chi tiết </button>
                    </td>
                </tr>
            )
        })
    }

    return (
        <div className={styles.voucher}>
            <div className={styles['shop-vouchers']}>
                <div className={styles['vouchers-head']}>
                    <div className={styles['vouchers-head__title']}> Đơn hàng đã mua </div>
                </div>
                <div className={styles['vouchers-table']}>
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Mã đơn hàng</th>
                                <th>Khách hàng</th>
                                <th>Số lượng hàng</th>
                                <th>Ngày tạo</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderOrders()}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default OrderHistory;