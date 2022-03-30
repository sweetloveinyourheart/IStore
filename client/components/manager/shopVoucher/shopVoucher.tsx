import { useSession } from "next-auth/react";
import { FormEvent, FunctionComponent, useEffect, useState } from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import useSWR from "swr";
import { ShopVoucher, Voucher, VoucherType } from "../../../types/voucher";
import { clientSideAPI } from "../../../utils/img";
import { fetcher } from "../../../utils/swr";
import styles from './voucher.module.scss'

interface VoucherProps { }

const ShopVoucher: FunctionComponent<VoucherProps> = () => {
    const [shopVouchers, setShopVouchers] = useState<ShopVoucher[]>([])
    const [cursor, setCursor] = useState<number>(0)
    const [voucher, setVoucher] = useState({
        label: '',
        value: 0,
        limit: {
            min: 0,
            max: 0 
        }
    })
    const [responseMsg, setResponseMsg] = useState({
        message: '',
        success: false,
        active: false
    })

    const { data } = useSWR<ShopVoucher[]>(clientSideAPI + `/voucher/getShopVouchers`, fetcher)
    const { data: session } = useSession()

    useEffect(() => {
        if (data) {
            setShopVouchers(data)
        }
    }, [data])

    const onCreateShopVoucher = async (e: FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault()

            if (voucher.label === '') return;

            const res = await fetch(clientSideAPI + '/voucher/new/shop', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${session?.accessToken}`
                },
                body: JSON.stringify(voucher)
            })
            const result = await res.json()

            if (result?.statusCode >= 400) throw new Error()

            setResponseMsg({
                active: true,
                message: 'Thêm voucher thành công',
                success: true
            })

        } catch (error) {
            setResponseMsg({
                active: true,
                message: 'Thêm voucher thất bại',
                success: false
            })
        }
    }

    const onDeleteVoucher = async (id: string, currentIndex: number) => {
        try {
            const res = await fetch(clientSideAPI + `/voucher/shopVoucher/delete/${id}`, {
                method: 'DELETE'
            })
            const result = await res.json()

            if (result?.statusCode >= 400) throw new Error

            let items = [...shopVouchers]
            items.splice(currentIndex, 1)
            setShopVouchers(items)

            alert('Đã gỡ voucher !')

        } catch (error) {
            alert('Xóa voucher thất bại!')
        }
    }

    const renderShopVouchers = () => {
        return shopVouchers.map((value, index) => {
            return (
                <tr key={index}>
                    <td> {index + 1} </td>
                    <td>
                        <div>{value.label}</div>
                        <div className={styles.desc}>
                            Áp dụng {value.limit.min ? ` từ ${Intl.NumberFormat().format(value.limit.min)} VNĐ` : ''}
                            {value.limit.max ? ` đến ${Intl.NumberFormat().format(value.limit.max)} VNĐ` : ''}
                        </div>
                    </td>
                    <td> {Intl.NumberFormat().format(value.value)} {value.value <= 100 ? "%" : "đ"} </td>
                    <td>
                        <button onClick={() => onDeleteVoucher(value._id, index)}> Loại bỏ </button>
                    </td>
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
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderShopVouchers()}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className={styles['create-voucher']}>
                <div className={styles['create-voucher__head']}> Thêm voucher mới </div>
                <form onSubmit={(e) => onCreateShopVoucher(e)} className={styles['voucher-form']}>
                    {responseMsg.active
                        && (
                            <h5
                                className={styles['response-msg']}
                                style={{ color: responseMsg.success ? '#06e763' : '#f30606' }}
                            > {responseMsg.message} </h5>
                        )
                    }
                    <div className={styles['form-item']}>
                        <div className={styles['form-item__label']}> Tên voucher * </div>
                        <input
                            type="text"
                            value={voucher.label}
                            onChange={e => setVoucher(s => ({ ...s, label: e.target.value }))}
                        />
                    </div>
                    <div className={styles['form-item']}>
                        <div className={styles['form-item__label']}> Giá trị voucher </div>
                        <div>
                            <input
                                type="number"
                                value={voucher.value}
                                onChange={e => setVoucher(s => ({
                                    ...s,
                                    value: (Number(e.target.value))
                                }))}
                            />
                            &nbsp;
                            <span> {voucher.value <= 100 ? "%" : "VNĐ"} </span>
                        </div>
                    </div>
                    <div className={styles['form-item']}>
                        <div className={styles['form-item__label']}> Giới hạn voucher </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div>
                                <div> Min: </div>
                                <input
                                    type="number"
                                    value={voucher.limit.min}
                                    onChange={e => setVoucher(s => ({
                                        ...s,
                                        limit: {
                                            ...s.limit,
                                            min: (Number(e.target.value))
                                        }
                                    }))}
                                />
                                &nbsp;đ
                            </div>
                            <div>
                                <div> Max: </div>
                                <input
                                    type="number"
                                    value={voucher.limit.max}
                                    onChange={e => setVoucher(s => ({
                                        ...s,
                                        limit: {
                                            ...s.limit,
                                            max: (Number(e.target.value))
                                        }
                                    }))}
                                />
                                &nbsp;đ
                            </div>
                        </div>
                    </div>
                    <div className={styles['form-item']}>
                        <button > Tạo voucher mới </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ShopVoucher;