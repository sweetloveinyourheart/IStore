import Image from "next/image";
import { useRouter } from "next/router";
import { FormEvent, FunctionComponent, useCallback, useEffect, useState } from "react";
import { BiAddToQueue, BiMenu, BiSearch } from "react-icons/bi";
import useSWR from "swr";
import { useAppDispatch } from "../../redux/hooks";
import { addProduct } from "../../redux/slices/billSlice";
import { Product } from "../../types/product";
import { clientSideAPI, nextImageUrl } from "../../utils/img";
import { fetcher } from "../../utils/swr";
import styles from './products.module.scss'

interface ProductsProps {
    category: string
}

const Products: FunctionComponent<ProductsProps> = ({ category }) => {
    const [products, setProducts] = useState<Product[]>([])
    const [search, setSearch] = useState<string>('')

    const { data } = useSWR<Product[]>(clientSideAPI + `/product/getByCategory?category=${category}`, fetcher)

    const dispatch = useAppDispatch()
    const router = useRouter()

    useEffect(() => {
        if (search.length > 0 && data) {
            let current = [...data]
            let keyword = new RegExp(search, 'ig')

            const result = current.filter((value) => {
                if (keyword.test(value.name)) {
                    return value
                }
            })
            return setProducts(result)
        }

        if (data) {
            setProducts(data)
        }

    }, [search, data])

    const onFind = async (e: FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault()
            const res = await fetch(clientSideAPI + `/product/getByName?name=${search}`)
            const data = await res.json()

            if (data?.statusCode >= 400) throw new Error()

            setProducts(data)

        } catch (error) {
            setSearch("")
        }
    }

    const onSelectProduct = useCallback((product: Product) => {
        if (product.status) {
            //@ts-ignore
            dispatch(addProduct({ product, quantity: 1, size: Object.keys(product.price)[0] }))
        }
    }, [])

    const renderProduct = () => {
        return products.map((value, index) => {
            return (
                <div
                    className={`${styles['product']} ${!value.status && `${styles['product--disable']}`}`}
                    key={index}
                    onClick={() => onSelectProduct(value)}
                >
                    <div className={styles['product__img']}>
                        <Image
                            src={nextImageUrl(value.image)}
                            width={300}
                            height={300}
                            alt="#"
                        />
                    </div>
                    <div className={styles['product__name']}> {value.name} </div>
                    <div className={styles['product__price']}>
                        {value.price?.S
                            && (
                                <div style={{ display: "flex", justifyContent: 'space-between' }}>
                                    <span>Nhỏ:</span> {Intl.NumberFormat().format(value.price.S)} đ
                                </div>
                            )
                        }
                        {value.price?.M
                            && (
                                <div style={{ display: "flex", justifyContent: 'space-between' }}>
                                    <span>Vừa:</span> {Intl.NumberFormat().format(value.price.M)} đ
                                </div>
                            )
                        }{value.price?.L
                            && (
                                <div style={{ display: "flex", justifyContent: 'space-between' }}>
                                    <span>Lớn:</span> {Intl.NumberFormat().format(value.price.L)} đ
                                </div>
                            )
                        }
                    </div>
                    <div className={styles['product__selector']} >
                        <BiAddToQueue />
                    </div>
                </div>
            )
        })
    }

    return (<div className={styles['product-area']}>
        <div className={styles['navigation']}>
            <div className={styles['search']}>
                <form className={styles['search__form']} onSubmit={e => onFind(e)}>
                    <input
                        type="text"
                        placeholder='Tìm kiếm sản phẩm'
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <button>
                        <BiSearch />
                    </button>
                </form>
            </div>
            <div className={styles['menu']}>
                <button className={styles['menu__item']} onClick={() => router.push('/manager')}>
                    <BiMenu />
                </button>
            </div>
        </div>

        <hr />

        <div className={styles['stall']}>
            <div className={styles['products']}>
                {renderProduct()}
            </div>
        </div>
    </div>);
}

export default Products;