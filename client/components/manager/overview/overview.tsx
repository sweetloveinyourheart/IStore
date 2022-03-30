import { useRouter } from "next/router";
import { FunctionComponent, useCallback, useEffect, useState } from "react";
import { BiBandAid, BiChevronLeft, BiChevronRight, BiDollarCircle, BiStoreAlt, BiWalletAlt } from "react-icons/bi";
import Moment from "react-moment";
import useSWR from "swr";
import { Bill } from "../../../types/bill";
import { clientSideAPI } from "../../../utils/img";
import { fetcher } from "../../../utils/swr";
import styles from './overview.module.scss'

interface OverViewProps { }

enum TimeStampEnum {
    day = 'day',
    week = "week",
    month = "month",
    year = "year"
}

const OverView: FunctionComponent<OverViewProps> = () => {
    const [cursor, setCursor] = useState<number>(0)
    const [shopBills, setShopBills] = useState<Bill[]>([])
    const [orderStat, setOrderStat] = useState({
        day: 0,
        week: 0,
        month: 0,
        year: 0,
        all: 0
    })
    const [filter, setFilter] = useState<TimeStampEnum | undefined>(undefined)

    const { data: billData } = useSWR<Bill[]>(!filter ? [clientSideAPI + `/bill/getAll?cursor=${cursor}`] : null, fetcher)
    const { data: filterData } = useSWR<Bill[]>(filter ? [clientSideAPI + `/bill/getByTimestamp?timestamp=${filter}&cursor=${cursor}`] : null, fetcher)
    const { data: orderStatData } = useSWR(clientSideAPI + `/bill/getOrderStatistics`, fetcher)

    const router = useRouter()

    useEffect(() => {
        if (billData) {
            setShopBills(billData)
        }
    }, [billData])

    useEffect(() => {
        if (filterData) {
            setShopBills(filterData)
        }
    }, [filterData])

    useEffect(() => {
        if (orderStatData) {
            setOrderStat({
                day: orderStatData.day[0]?.value ?? 0,
                week: orderStatData.week[0]?.value ?? 0,
                month: orderStatData.month[0]?.value ?? 0,
                year: orderStatData.year[0]?.value ?? 0,
                all: orderStatData.all[0]?.value ?? 0,
            })
        }
    }, [orderStatData])

    const pageChange = (step: 'prev' | 'next') => {
        if (step === 'prev' && cursor >= 10)
            setCursor(s => s - 10)

        if (step === 'next' && shopBills.length === 10)
            setCursor(s => s + 10)
    }

    const onTriggerFilter = useCallback((type: TimeStampEnum | undefined) => {
        setFilter(type)
    }, [filter])

    const renderShopBills = () => {
        return shopBills.map((value, index) => {
            return (
                <tr key={index}>
                    <td> {index + cursor + 1} </td>
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
        <div className={styles.overview}>
            <div className={styles['statistical']}>
                <div
                    className={styles['statistical-item']}
                    onClick={() => onTriggerFilter(TimeStampEnum.day)}
                    style={{
                        background: filter === TimeStampEnum.day ? "#e6e9ff" : "#fff"
                    }}
                >
                    <div className={`${styles['statistical-item__icon']} ${styles['statistical-item__icon--orange']}`}>
                        <BiWalletAlt />
                    </div>
                    <div className={styles['statistical-item__value']}>
                        {Intl.NumberFormat().format(orderStat.day)} đ
                    </div>
                    <div className={styles['statistical-item__name']}>
                        Doanh thu ngày
                    </div>
                </div>
                <div
                    className={styles['statistical-item']}
                    onClick={() => onTriggerFilter(TimeStampEnum.week)}
                    style={{
                        background: filter === TimeStampEnum.week ? "#e6e9ff" : "#fff"
                    }}
                >
                    <div className={styles['statistical-item__icon']}>
                        <BiStoreAlt />
                    </div>
                    <div className={styles['statistical-item__value']}>
                        {Intl.NumberFormat().format(orderStat.week)} đ
                    </div>
                    <div className={styles['statistical-item__name']}>
                        Doanh thu trong tuần
                    </div>
                </div>
                <div 
                    className={styles['statistical-item']}
                    onClick={() => onTriggerFilter(TimeStampEnum.month)}
                    style={{
                        background: filter === TimeStampEnum.month ? "#e6e9ff" : "#fff"
                    }}
                >
                    <div className={`${styles['statistical-item__icon']} ${styles['statistical-item__icon--light-blue']}`}>
                        <BiBandAid />
                    </div>
                    <div className={styles['statistical-item__value']}>
                        {Intl.NumberFormat().format(orderStat.month)} đ
                    </div>
                    <div className={styles['statistical-item__name']}>
                        Doanh thu tháng
                    </div>
                </div>
                <div 
                    className={styles['statistical-item']}
                    onClick={() => onTriggerFilter(undefined)}
                >
                    <div className={`${styles['statistical-item__icon']} ${styles['statistical-item__icon--red']}`}>
                        <BiDollarCircle />
                    </div>
                    <div className={styles['statistical-item__value']}>
                        {Intl.NumberFormat().format(orderStat.all)} đ
                    </div>
                    <div className={styles['statistical-item__name']}>
                        Tổng doanh thu
                    </div>
                </div>
            </div>
            <div className={styles['orders']}>
                <div className={styles['orders-head']}>
                    <div className={styles['orders-head__title']}> Tất cả đơn hàng </div>
                    <div className={styles['orders-head__page']}>
                        <button onClick={() => pageChange('prev')}> <BiChevronLeft /> </button>
                        <button onClick={() => pageChange('next')}> <BiChevronRight /> </button>
                    </div>
                </div>
                <div className={styles['orders-table']}>
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Mã đơn hàng</th>
                                <th>Khách hàng</th>
                                <th>Sản phẩm</th>
                                <th>Ngày mua</th>
                                <th>Tổng cộng</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderShopBills()}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default OverView;