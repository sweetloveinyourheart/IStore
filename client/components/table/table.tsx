import { FunctionComponent, useCallback, useEffect, useState } from "react";
import { BiAddToQueue, BiChevronLeftCircle, BiChevronRightCircle, BiPlus, BiRefresh, BiX } from "react-icons/bi";
import { useAppDispatch } from "../../redux/hooks";
import { addProductList, BillItems, resetBill } from "../../redux/slices/billSlice";
import { ShopTable } from "../../types/table";
import { TableArea } from "../manager/shopTable/shopTable";
import styles from './table.module.scss'

interface TableProps {
    close: () => void
    items: BillItems[]
}

const Table: FunctionComponent<TableProps> = ({ close, items }) => {
    const [selectedArea, setSelectedArea] = useState<string>('')
    const [tableList, setTableList] = useState<ShopTable[]>([])
    const [selectedTable, setSelectedTable] = useState<number | undefined>()
    const [area, setArea] = useState<TableArea[]>([])

    const dispatch = useAppDispatch()

    useEffect(() => {
        const areaList = localStorage.getItem('tableArea')
        if (areaList) {
            const list = JSON.parse(areaList)
            setArea(list)
            if (list.length !== 0) {
                let x = list[0].name
                setSelectedArea(x)
            }
        }
    }, [])

    useEffect(() => {
        if (selectedArea !== "") {
            const tableList = localStorage.getItem(`tableList__${selectedArea}`)
            if (tableList) {
                setTableList(JSON.parse(tableList))
            } else {
                setTableList([])
            }
        }
    }, [selectedArea])

    const resetTableBill = useCallback(() => {
        if (selectedTable !== undefined) {
            let tableListItems = [...tableList]

            tableListItems[selectedTable].items = []

            localStorage.setItem(
                `tableList__${selectedArea}`,
                JSON.stringify(tableListItems)
            )
            
            setTableList(tableListItems)
        }

    }, [selectedArea, selectedTable, tableList])

    const addBill = useCallback(() => {
        if (selectedTable !== undefined) {
            dispatch(resetBill())

            let tableListItems = [...tableList]
            let tableItem = tableListItems[Number(selectedTable)].items

            if (tableItem) {
                tableListItems[Number(selectedTable)].items = [...tableItem, ...items]
            } else {
                tableListItems[Number(selectedTable)].items = items
            }
            setTableList(tableListItems)

            localStorage.setItem(
                `tableList__${selectedArea}`,
                JSON.stringify(tableListItems)
            )

            close()
        }
    }, [items, selectedTable, tableList])

    const payTheBill = useCallback(() => {
        if (selectedTable !== undefined) {
            const theBill = tableList[Number(selectedTable)].items

            if (theBill) {
                dispatch(addProductList(theBill))
                resetTableBill()
                close()
            }
        }
    }, [items, selectedTable, tableList])

    const renderTables = () => {
        return tableList.map((value, index) => {

            let paymentAmount = 0;
            value.items.forEach((val) => {
                paymentAmount += (val.product.price[val.size] ?? 0) * val.quantity
            })

            return (
                <div
                    className={styles.table}
                    key={index}
                    onClick={() => setSelectedTable(index)}
                >
                    <div
                        className={styles.table__icon}
                        style={{
                            backgroundColor: value.items.length !== 0 ? "#78e631" : "#fff",
                            color: value.items.length !== 0 ? "#fff" : ""
                        }}
                    >
                        <div>
                            <div className={styles['table-name']}>{value.name}</div>
                            {paymentAmount !== 0 &&
                                <div className={styles['table-amount']}>
                                    {Intl.NumberFormat().format(paymentAmount)}
                                </div>
                            }
                        </div>
                    </div>
                </div>
            )
        })
    }

    const renderProduct = () => {
        if (selectedTable !== undefined)
            return tableList[selectedTable].items.map((value, index) => {
                const { quantity, product, size } = value
                const price = product.price[size] || 0

                return (
                    <tr key={index}>
                        <td>{product.name}</td>
                        <td >
                            <div className={styles['quantity']}>
                                {quantity}
                            </div>
                        </td>
                        <td>
                            {size}
                        </td>
                        <td>{Intl.NumberFormat().format(price)}</td>
                        <td>{Intl.NumberFormat().format(price * quantity)}</td>
                    </tr>
                )
            })
    }

    if (selectedTable !== undefined) {
        return (
            <div className={styles['viewing']}>
                <div className={styles['viewing__head']}>
                    <button onClick={() => setSelectedTable(undefined)}>
                        <BiX />
                    </button>
                    <h5> Danh sách order </h5>
                </div>
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
                {selectedTable !== undefined
                    && (
                        <div className={styles['table-foot']}>
                            <div>
                                <button
                                    className={`${styles['action__btn']} ${styles['action__btn--red']}`}
                                    onClick={() => resetTableBill()}
                                >
                                    <BiRefresh />
                                    <span>Reset</span>
                                </button>
                            </div>
                            <div className={styles['action']}>
                                <button
                                    className={`${styles['action__btn']} ${styles['action__btn--green']}`}
                                    onClick={() => addBill()}
                                >
                                    <BiAddToQueue />
                                    <span>Gán</span>
                                </button>
                                <button
                                    className={`${styles['action__btn']} ${styles['action__btn--blue']}`}
                                    onClick={() => payTheBill()}
                                >
                                    <BiChevronRightCircle />
                                    <span>Xuất</span>
                                </button>
                            </div>
                        </div>
                    )
                }
            </div>
        )
    }

    return (
        <div>
            <div className={styles['table-head']}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <button
                        className={`${styles['table-head__btn']} ${styles['table-head__btn--green']}`}
                        onClick={() => close()}
                    >
                        <BiChevronLeftCircle />
                    </button>
                    <h5> Danh sách bàn </h5>
                </div>

                <select value={selectedArea} onChange={e => setSelectedArea(e.target.value)} >
                    <option disabled value="">Chọn khu vực</option>
                    {area.map((val, ind) => {
                        return <option value={val.name} key={ind}> {val.name}  </option>
                    })}
                </select>
            </div>

            <div className={styles['table-list']}>
                {renderTables()}
            </div>

        </div>
    );
}

export default Table;