import { useSession } from "next-auth/react";
import { FunctionComponent, useEffect, useState } from "react";
import useSWR from "swr";
import { Voucher } from "../../types/voucher";
import { fetcher } from "../../utils/swr";
import styles from './voucher.module.scss';
import Moment from 'react-moment'

interface VoucherProps { }

const Voucher: FunctionComponent<VoucherProps> = () => {
    const [vouchers, setVouchers] = useState<Voucher[]>([])

    const { data: session } = useSession()
    const { data } = useSWR<Voucher[]>(session?.accessToken ? [`/voucher/user`, session?.accessToken] : null, fetcher)

    useEffect(() => {
        if (data) {
            setVouchers(data)
        }
    }, [data])

    const renderVouchers = () => {
        return vouchers.map((value, index) => {
            return (
                <tr key={index}>
                    <td> {index + 1} </td>
                    <td>
                        <div>{value.shopVoucher.label}</div>
                        <div className={styles.desc}>
                            Áp dụng {value.shopVoucher.limit.min ? ` từ ${Intl.NumberFormat().format(value.shopVoucher.limit.min)} VNĐ` : ''}
                            {value.shopVoucher.limit.max ? ` đến ${Intl.NumberFormat().format(value.shopVoucher.limit.max)} VNĐ` : ''}
                        </div>
                    </td>
                    <td> {Intl.NumberFormat().format(value.shopVoucher.value)} {value.shopVoucher.value <= 100 ? "%" : "đ"} </td>
                    <td> {value.count} </td>
                    <td> <Moment format="DD/MM/yyyy">{value.createAt}</Moment> </td>
                </tr>
            )
        })
    }

    return (
        <div className={styles.voucher}>
            <div className={styles['shop-vouchers']}>
                <div className={styles['vouchers-head']}>
                    <div className={styles['vouchers-head__title']}> Tất cả voucher </div>
                </div>
                <div className={styles['vouchers-table']}>
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Tên voucher</th>
                                <th>Giá trị</th>
                                <th>Số lượng</th>
                                <th>Ngày tạo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderVouchers()}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Voucher;