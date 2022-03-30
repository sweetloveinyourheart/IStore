import { FunctionComponent, useCallback, useEffect, useState } from "react";
import { BiAddToQueue, BiChevronLeftCircle, BiChevronRightCircle, BiPlus, BiRefresh, BiX } from "react-icons/bi";
import { useAppDispatch } from "../../redux/hooks";
import { addProductList, BillItems, resetBill } from "../../redux/slices/billSlice";
import { BillState } from "../../types/bill";
import styles from './table.module.scss'

interface TableProps {
    close: () => void
    items: BillItems[]
}

interface TableList {
    id: string,
    items: BillItems[] | undefined
}

const Table: FunctionComponent<TableProps> = ({ close, items }) => {
    const [tableList, setTableList] = useState<TableList[]>([])
    const [selectedTable, setSelectedTable] = useState<string | undefined>()

    const dispatch = useAppDispatch()

    useEffect(() => {
        const tableCount = localStorage.getItem('tableCount') ?? 0

        let tables: TableList[] = [];
        for (let i = 0; i < Number(tableCount); i++) {
            const value = localStorage.getItem(`table_${i}`)
            tables.push({
                id: String(i),
                items: value ? JSON.parse(value).items : undefined
            })
        }
        setTableList(tables)
    }, [])

    const addNewTable = useCallback(() => {
        localStorage.setItem('tableCount', String(tableList.length + 1))
        setTableList(s => [...s, { id: String(tableList.length), items: undefined }])
    }, [tableList])

    const removeTable = useCallback(() => {
        localStorage.setItem('tableCount', String(tableList.length - 1))
        let newList = [...tableList]
        newList.splice(tableList.length - 1, 1)
        setTableList(newList)
    }, [tableList])

    const resetTableBill = useCallback(() => {
        if (selectedTable)
            localStorage.removeItem(`table_${selectedTable}`)

        let items = [...tableList]
        items[Number(selectedTable)].items = undefined
        setTableList(items)

    }, [selectedTable, tableList])

    const addBill = useCallback(() => {
        if (selectedTable) {
            dispatch(resetBill())

            let tableListItems = [...tableList]
            let tableItem = tableListItems[Number(selectedTable)].items

            if(tableItem) {
                tableListItems[Number(selectedTable)].items = [...tableItem, ...items]
            } else {
                tableListItems[Number(selectedTable)].items = items
            }
            setTableList(tableListItems)

            localStorage.setItem(
                `table_${selectedTable}`,
                JSON.stringify({
                    id: selectedTable,
                    items: tableListItems[Number(selectedTable)].items
                })
            )

            close()
        }
    }, [items, selectedTable, tableList])

    const payTheBill = useCallback(() => {
        if (selectedTable) {
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
            return (
                <div
                    className={styles.table}
                    key={index}
                    onClick={() => setSelectedTable(value.id)}
                >
                    <div
                        className={styles.table__icon + " " + (value.id === selectedTable ? styles[`table__icon--selected`] : '')}
                        style={{ backgroundColor: value.items ? "#ffa461" : "#fff" }}
                    >
                        {Number(value.id) + 1}
                    </div>
                </div>
            )
        })
    }

    return (
        <div>
            <div className={styles['table-head']}>
                <button
                    className={`${styles['table-head__btn']} ${styles['table-head__btn--green']}`}
                    onClick={() => close()}
                >
                    <BiChevronLeftCircle />
                </button>
                <h5> Danh sách bàn </h5>
                <div style={{ display: 'flex' }}>
                    <button
                        className={`${styles['table-head__btn']} ${styles['table-head__btn--pink']}`}
                        style={{ marginRight: 4 }}
                        onClick={() => removeTable()}>
                        <BiX />
                    </button>
                    <button
                        className={`${styles['table-head__btn']} ${styles['table-head__btn--pink']}`}
                        onClick={() => addNewTable()}>
                        <BiPlus />
                    </button>
                </div>
            </div>

            <div className={styles['table-list']}>
                {renderTables()}
            </div>

            {selectedTable
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
    );
}

export default Table;