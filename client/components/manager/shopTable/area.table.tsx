import { FunctionComponent, useCallback, useEffect, useState } from "react";
import { BiEdit, BiSave, BiX } from "react-icons/bi";
import { TableArea } from "./shopTable";
import styles from './shopTable.module.scss'

interface TableAreaProps {
    item: TableArea
    index: number
}

const TableArea: FunctionComponent<TableAreaProps> = ({ item, index }) => {
    const [name, setName] = useState<string>('')
    const [isEdit, setIsEdit] = useState<boolean>(false)
    const [active, setActive] = useState(true)

    useEffect(() => {
        setName(item.name)
    }, [item])

    const onSaveChange = useCallback(() => {
        const x = localStorage.getItem('tableArea')
        if (x) {
            let current = JSON.parse(x)
            current[index] = { name }
            localStorage.setItem('tableArea', JSON.stringify(current))
            setIsEdit(false)
        }

    }, [name])

    const onDelete = useCallback(() => {
        const x = localStorage.getItem('tableArea')
        if (x) {
            let current = JSON.parse(x)
            current.splice(index, 1)
            localStorage.setItem('tableArea', JSON.stringify(current))
            setIsEdit(false)
            setActive(false)
        }
    }, [])

    if (!active) return null

    return (
        <div className={styles['sector']}>
            {isEdit
                ? <input type="text" value={name} onChange={e => setName(e.target.value)} />
                : <div className={styles['sector__name']}> {name} </div>
            }
            <div className={styles.action}>
                {isEdit
                    ? <button onClick={() => onSaveChange()}> <BiSave /> </button>
                    : <button onClick={() => setIsEdit(true)}> <BiEdit /> </button>
                }
                <button onClick={() => onDelete()}> <BiX /> </button>
            </div>
        </div>
    );
}

export default TableArea;