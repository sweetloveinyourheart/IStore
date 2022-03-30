import { useSession } from "next-auth/react";
import Image from "next/image";
import { FormEvent, FunctionComponent, useCallback, useEffect, useState } from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import ReactImageUploading, { ImageListType, ImageType } from "react-images-uploading";
import useSWR from "swr";
import { Category } from "../../../types/categories";
import { Product } from "../../../types/product";
import { clientSideAPI, nextImageUrl } from "../../../utils/img";
import { fetcher } from "../../../utils/swr";
import styles from './product.module.scss'

interface ProductManagerProps { }

interface ProductState {
    name: string,
    price: { S?: number, M?: number, L?: number },
    category: string
}

const ProductManager: FunctionComponent<ProductManagerProps> = () => {
    const [shopProducts, setShopProducts] = useState<Product[]>([])
    const [images, setImages] = useState<ImageType[]>([]);
    const [product, setProduct] = useState<ProductState>({
        name: '',
        price: {},
        category: ''
    })
    const [responseMsg, setResponseMsg] = useState({
        message: '',
        success: false,
        active: false
    })
    const [cursor, setCursor] = useState<number>(0)

    const { data: categories } = useSWR<Category[]>(clientSideAPI + `/category/getCategories`, fetcher)
    const { data: products } = useSWR<Product[]>(clientSideAPI + `/product/getAll?cursor=${cursor}`, fetcher)

    const { data: session } = useSession()

    useEffect(() => {
        if (products) {
            setShopProducts(products)
        }
    }, [products])

    const onImageChange = (imageList: ImageListType, addUpdateIndex?: number[] | undefined) => {
        // data for submit
        setImages(imageList);
    };

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const { name, category, price } = product

        if (name === "" || category === "" || price === {} || images.length === 0) return;

        let formData = new FormData()
        formData.append('name', name)
        formData.append('price', JSON.stringify(price))
        formData.append('category', category)
        images[0].file && formData.append('image', images[0].file)

        const res = await fetch(clientSideAPI + '/product/create', {
            method: 'POST',
            body: formData
        })
        const result = await res.json()

        if (result?.statusCode >= 400) throw new Error

        setResponseMsg({ message: 'Thêm sản phẩm thành công !', success: true, active: true })
        setProduct({
            name: '',
            price: {},
            category: ''
        })
        setImages([])
    }

    const pageChange = (step: 'prev' | 'next') => {
        if (step === 'prev' && cursor >= 10)
            setCursor(s => s - 10)

        if (step === 'next' && shopProducts.length === 10)
            setCursor(s => s + 10)
    }

    const onChangeStatus = useCallback(async (productId: string, status: boolean, currentIndex: number) => {
        try {
            const res = await fetch(clientSideAPI + `/product/changeStatus/${productId}?status=${!status}`, {
                method: 'PUT',
                headers: {
                    "Authorization": `Bearer ${session?.accessToken}`
                }
            })
            const result = await res.json()

            if (result?.statusCode >= 400) throw new Error

            let items = [...shopProducts]
            items[currentIndex].status = !status
            setShopProducts(items)

            alert("Cập nhật trạng thái sản phẩm thành công !")
        } catch (error) {
            alert('Cập nhật trạng thái thất bại!')
        }
    }, [shopProducts])

    const onSetPrice = (size: 'S' | 'M' | "L") => {
        let state = product.price
        if (state[size] !== undefined) {
            delete state[size]
            setProduct(s => ({
                ...s,
                price: state
            }))
            return;
        }
        setProduct(s => ({
            ...s,
            price: {
                ...s.price,
                [size]: 0
            }
        }))
    }

    const onDeleteProduct = async (id: string, currentIndex: number) => {
        try {
            const res = await fetch(clientSideAPI + `/product/delete/${id}`, {
                method: 'DELETE'
            })
            const result = await res.json()

            if (result?.statusCode >= 400) throw new Error

            let items = [...shopProducts]
            items.splice(currentIndex, 1)
            setShopProducts(items)

            alert('Sản phẩm đã xóa !')

        } catch (error) {
            alert('Xóa sản phẩm thất bại!')
        }
    }

    const renderProduct = () => {
        return shopProducts.map((value, index) => {
            return (
                <tr key={index}>
                    <td> {index + cursor + 1} </td>
                    <td>
                        <Image
                            height={40}
                            width={40}
                            src={nextImageUrl(value.image)}
                            alt={value.name}
                        />
                    </td>
                    <td> {value.name} </td>
                    <td>
                        {value.price?.S && <div>(S): {Intl.NumberFormat().format(value.price.S)} đ</div>}
                        {value.price?.M && <div>(M): {Intl.NumberFormat().format(value.price.M)} đ</div>}
                        {value.price?.L && <div>(L): {Intl.NumberFormat().format(value.price.L)} đ</div>}
                    </td>
                    <td>
                        <button
                            className={`${styles['btn']} ${value.status ? `${styles['btn--green']}` : `${styles['btn--red']}`}`}
                            onClick={() => onChangeStatus(value._id, value.status, index)}
                        >
                            {value.status ? "Còn hàng" : "Hết hàng"}
                        </button>
                        &nbsp;
                        <button className={`${styles['btn']}`} onClick={() => onDeleteProduct(value._id, index)}>
                            Gỡ bỏ
                        </button>
                    </td>
                </tr>
            )
        })
    }

    const renderCategories = () => {
        if (!categories) return;

        return categories.map((value, index) => {
            return (
                <option value={value._id} key={index}> {value.name} </option>
            )
        })
    }

    return (
        <div className={styles.product}>
            <div className={styles['shop-products']}>
                <div className={styles['products-head']}>
                    <div className={styles['products-head__title']}> Tất cả sản phẩm </div>
                    <div className={styles['products-head__page']}>
                        <button onClick={() => pageChange('prev')}> <BiChevronLeft /> </button>
                        <button onClick={() => pageChange('next')}> <BiChevronRight /> </button>
                    </div>
                </div>
                <div className={styles['products-table']}>
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Hình ảnh</th>
                                <th>Tên sản phẩm</th>
                                <th>Giá sản phẩm</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderProduct()}
                        </tbody>
                    </table>
                </div>

            </div>
            <div className={styles['create-product']}>
                <div className={styles['create-product__head']}> Thêm sản phẩm mới </div>
                <form
                    onSubmit={(e) => onSubmit(e)}
                    className={styles['product-form']}
                >
                    {responseMsg.active
                        && (
                            <h5
                                className={styles['response-msg']}
                                style={{ color: responseMsg.success ? '#06e763' : '#f30606' }}
                            > {responseMsg.message} </h5>
                        )
                    }
                    <div className={styles['form-item']}>
                        <div className={styles['form-item__label']}> Tên sản phẩm * </div>
                        <input
                            type="text"
                            onChange={e => setProduct(s => ({ ...s, name: e.target.value }))}
                            value={product.name}
                        />
                    </div>
                    <div className={styles['form-item']}>
                        <div className={styles['form-item__label']}> Giá sản phẩm (VNĐ) </div>
                        <div className={styles['price']}>
                            <label className={styles["container"]}>
                                Nhỏ (S)
                                <input
                                    type="checkbox"
                                    onChange={() => onSetPrice('S')}
                                    checked={product.price.S !== undefined ? true : false}
                                />
                                <span className={styles["checkmark"]}></span>
                            </label>
                            {product.price?.S !== undefined
                                ? (
                                    <input
                                        type="number"
                                        onChange={e => setProduct(s => ({
                                            ...s,
                                            price: {
                                                ...s.price,
                                                S: Number(e.target.value)
                                            }
                                        }))}
                                        value={product.price.S}
                                    />
                                )
                                : <div></div>
                            }
                        </div>
                        <div className={styles['price']}>
                            <label className={styles["container"]}>
                                Vừa (M)
                                <input
                                    type="checkbox"
                                    onChange={() => onSetPrice('M')}
                                    checked={product.price.M !== undefined ? true : false}
                                />
                                <span className={styles["checkmark"]}></span>
                            </label>
                            {product.price?.M !== undefined
                                && (
                                    <input
                                        type="number"
                                        onChange={e => setProduct(s => ({
                                            ...s,
                                            price: {
                                                ...s.price,
                                                M: Number(e.target.value)
                                            }
                                        }))}
                                        value={product.price.M}
                                    />
                                )
                            }
                        </div>
                        <div className={styles['price']}>
                            <label className={styles["container"]}>
                                Lớn (L)
                                <input
                                    type="checkbox"
                                    onChange={() => onSetPrice('L')}
                                    checked={product.price.L !== undefined ? true : false}
                                />
                                <span className={styles["checkmark"]}></span>
                            </label>
                            {product.price?.L !== undefined
                                && (
                                    <input
                                        type="number"
                                        onChange={e => setProduct(s => ({
                                            ...s,
                                            price: {
                                                ...s.price,
                                                L: Number(e.target.value)
                                            }
                                        }))}
                                        value={product.price.L}
                                    />
                                )
                            }
                        </div>
                    </div>
                    <div className={styles['form-item']}>
                        <div className={styles['form-item__label']}> Danh mục sản phẩm * </div>
                        <select
                            onChange={e => setProduct(s => ({ ...s, category: e.target.value }))}
                            value={product.category}
                        >
                            <option value="" disabled> Chọn danh mục </option>
                            {renderCategories()}
                        </select>
                    </div>
                    <div className={styles['image-upload']}>
                        <div className={styles['image-upload__label']}> Hình ảnh sản phẩm (300x300) </div>
                        <ReactImageUploading
                            multiple
                            value={images}
                            onChange={onImageChange}
                            maxNumber={1}
                            dataURLKey="data_url"
                        >
                            {({
                                imageList,
                                onImageUpload,
                                onImageRemoveAll,
                                onImageUpdate,
                                onImageRemove,
                                isDragging,
                                dragProps,
                            }) => (
                                // write your building UI
                                <div className={styles['upload']}>
                                    <div className={styles['upload__actions']}>
                                        <button
                                            style={isDragging ? { color: 'red' } : undefined}
                                            onClick={onImageUpload}
                                            {...dragProps}
                                        >
                                            Chọn hình ảnh
                                        </button>
                                        &nbsp;
                                        <button onClick={onImageRemoveAll}>Gỡ bỏ hình ảnh</button>
                                    </div>
                                    {imageList.map((image, index) => (
                                        <div key={index} className="image-item">
                                            <Image src={image['data_url']} alt="" width={300} height={300} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ReactImageUploading>
                    </div>

                    <div className={styles['form-item']}>
                        <button> Tạo sản phẩm mới </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ProductManager;