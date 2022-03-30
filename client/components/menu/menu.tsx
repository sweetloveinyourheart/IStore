import Image from "next/image";
import { FunctionComponent, useState } from "react";
import useSWR from "swr";
import { Category } from "../../types/categories";
import { clientSideAPI, nextImageUrl } from "../../utils/img";
import { fetcher } from "../../utils/swr";
import styles from './menu.module.scss'

interface MenuProps {
  category: string,
  setCategory: (category: string) => void
}

const Menu: FunctionComponent<MenuProps> = ({ category, setCategory }) => {
  const [menu, setMenu] = useState<string>('')
  const { data } = useSWR<Category[]>(clientSideAPI + `/category/getCategories`, fetcher)

  const onSetMenu = (_id: string) => {
    setMenu(s => s === _id ? '' : _id)
    setCategory(menu === _id ? '' : _id)
  }

  const renderMenu = () => {
    if (!data) return;

    return data.map((value, index) => {
      return (
        <div className={styles['menu-item']} key={index} onClick={() => onSetMenu(value._id)}>
          <div className={styles['menu-item__img']} style={{ border: menu === value._id ? '2px solid #d12032' : '2px solid #fff' }}>
            <Image
              src={nextImageUrl(value.image)}
              width={40}
              height={40}
              alt="#"
            />
          </div>
          <div className={styles['menu-item__name']}> {value.name} </div>
        </div>
      )
    })
  }

  return (
    <div className={styles['menu']}>
      {renderMenu()}
    </div>
  );
}

export default Menu;