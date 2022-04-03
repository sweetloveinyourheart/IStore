import { FunctionComponent, useCallback, useEffect, useState } from "react";
import { BiEdit, BiPlusCircle, BiSave, BiX } from "react-icons/bi";
import { ShopTable } from "../../../types/table";
import styles from './shopTable.module.scss'

interface TableItemProps {
    index: number
    item: ShopTable
}

const TableItem: FunctionComponent<TableItemProps> = ({ index, item }) => {
    const [name, setName] = useState<string>('')
    const [isEdit, setIsEdit] = useState<boolean>(false)
    const [active, setActive] = useState(true)

    useEffect(() => {
        setName(item.name)
    }, [item])

    const onSaveChange = useCallback(() => {
        const x = localStorage.getItem(`tableList__${item.area}`)
        if (x) {
            let current = JSON.parse(x)
            current[index] = { ...current[index], name }
            localStorage.setItem(`tableList__${item.area}`, JSON.stringify(current))
            setIsEdit(false)
        }

    }, [name])

    const onDelete = useCallback(() => {
        const x = localStorage.getItem(`tableList__${item.area}`)
        if (x) {
            let current = JSON.parse(x)
            current.splice(index, 1)
            localStorage.setItem(`tableList__${item.area}`, JSON.stringify(current))
            setIsEdit(false)
            setActive(false)
        }
    }, [])

    if (!active) return null

    return (
        <div className={styles['list-item']}>
            <div className={styles['table']}>
                <div className={styles.description}>
                    <div className={styles.name}>
                        {isEdit
                            ? <input type="text" value={name} onChange={e => setName(e.target.value)} />
                            : <div className={styles['sector__name']}> {name} </div>
                        }
                    </div>
                    <div className={styles.action}>
                        {isEdit
                            ? <button onClick={() => onSaveChange()}> <BiSave /> </button>
                            : <button onClick={() => setIsEdit(true)}> <BiEdit /> </button>
                        }
                        <button onClick={() => onDelete()}> <BiX /> </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TableItem;