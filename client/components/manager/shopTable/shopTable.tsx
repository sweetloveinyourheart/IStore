import { FunctionComponent, useCallback, useEffect, useState } from "react";
import { BiEdit, BiPlusCircle, BiX } from "react-icons/bi";
import { ShopTable } from "../../../types/table";
import TableArea from "./area.table";
import TableItem from "./item.table";
import styles from './shopTable.module.scss'

interface ShopTableProps { }

export interface TableArea {
    name: string
}

const ShopTable: FunctionComponent<ShopTableProps> = () => {
    const [area, setArea] = useState<TableArea[]>([])
    const [table, setTable] = useState<ShopTable[]>([])
    const [selectedArea, setSelectedArea] = useState<string>('')

    useEffect(() => {
        const areaList = localStorage.getItem('tableArea')
        if (areaList) {
            setArea(JSON.parse(areaList))
        }
    }, [])

    useEffect(() => {
        if (selectedArea !== "") {
            const tableList = localStorage.getItem(`tableList__${selectedArea}`)
            if (tableList) {
                setTable(JSON.parse(tableList))
            } else {
                setTable([])
            }
        }
    }, [selectedArea])

    const addArea = useCallback(() => {
        const areaList = localStorage.getItem('tableArea')
        if (areaList) {
            let item = [...JSON.parse(areaList), { name: "Khu vực ..." }]
            localStorage.setItem('tableArea', JSON.stringify(item))
            setArea(item)
        } else {
            let item = [{ name: "Khu vực ..." }]
            localStorage.setItem(`tableList__${selectedArea}`, JSON.stringify(item))
            setArea(item)
        }
    }, [])

    const addTable = useCallback(() => {
        if (selectedArea !== '') {
            const tableList = localStorage.getItem(`tableList__${selectedArea}`)

            if (tableList) {
                let item = [...JSON.parse(tableList), { name: "Bàn số ...", area: selectedArea, items: [] }]
                localStorage.setItem(`tableList__${selectedArea}`, JSON.stringify(item))
                setTable(item)
            } else {
                let item = [{ name: "Bàn số ...", area: selectedArea, items: [] }]
                localStorage.setItem(`tableList__${selectedArea}`, JSON.stringify(item))
                setTable(item)
            }
        }

    }, [selectedArea])

    const renderAreaList = () => {
        return area.map((value, index) => {
            return <TableArea key={index} index={index} item={value} />
        })
    }

    const renderTableList = () => {
        return table.map((value, index) => {
            if (value.area === selectedArea) {
                return <TableItem key={index} index={index} item={value} />
            }
        })
    }

    return (
        <div className={styles.area}>
            <div className={styles['table-list']}>
                <div className={styles['table-list__head']}>
                    <h5> Danh sách bàn</h5>
                    <select value={selectedArea} onChange={e => setSelectedArea(e.target.value)} >
                        <option disabled value=''>Chọn khu vực</option>
                        {area.map((val, ind) => {
                            return <option value={val.name} key={ind}> {val.name}  </option>
                        })}
                    </select>
                    <button onClick={() => addTable()}>
                        <BiPlusCircle />
                    </button>
                </div>
                <div className={styles['table-list__content']}>
                    {renderTableList()}
                </div>
            </div>
            <div className={styles['manager']}>
                <div className={styles['manager__head']}>
                    <h5>Danh sách khu vực</h5>
                    <button
                        onClick={() => addArea()}
                    >
                        <BiPlusCircle />
                    </button>
                </div>
                <div className={styles['manager__body']}>
                    {renderAreaList()}
                </div>
            </div>
        </div>
    );
}

export default ShopTable;