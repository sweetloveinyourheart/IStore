import Image from "next/image";
import { FormEvent, FunctionComponent, useEffect, useState } from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import ReactImageUploading, { ImageListType, ImageType } from "react-images-uploading";
import styles from './category.module.scss'
import useSWR from 'swr'
import { Category } from "../../../types/categories";
import { fetcher } from "../../../utils/swr";
import { clientSideAPI, nextImageUrl } from "../../../utils/img";

interface CategoryManagerProps { }

const CategoryManager: FunctionComponent<CategoryManagerProps> = () => {
    const [shopCategories, setShopCategories] = useState<Category[]>([])
    const [images, setImages] = useState<ImageType[]>([]);
    const [name, setName] = useState<string>('')
    const [cursor, setCursor] = useState<number>(0)
    const [responseMsg, setResponseMsg] = useState({
        message: '',
        success: false,
        active: false
    })

    const { data } = useSWR<Category[]>(clientSideAPI + `/category/getAll?cursor=${cursor}`, fetcher)

    useEffect(() => {
        if (data) {
            setShopCategories(data)
        }
    }, [data])

    const onImageChange = (imageList: ImageListType) => {
        // data for submit
        setImages(imageList);
    };

    const pageChange = (step: 'prev' | 'next') => {
        if (shopCategories.length < 20) return;

        (step === 'prev' && cursor !== 0) && setCursor(s => s - 20)
        step === 'next' && setCursor(s => s + 20)
    }

    const onDeleteCategory = async (id: string, currentIndex: number) => {
        try {
            const res = await fetch(clientSideAPI + `/category/remove/${id}`, {
                method: 'DELETE'
            })
            const result = await res.json()

            if (result?.statusCode >= 400) throw new Error

            let items = [...shopCategories]
            items.splice(currentIndex, 1)
            setShopCategories(items)

            alert('Danh mục đã xóa !')
        } catch (error) {
            alert('Xóa danh mục thất bại!')
        }
    }

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault()
            if (images.length === 0 || name.length === 0) return;

            let formData = new FormData()
            formData.append('name', name)
            images[0].file && formData.append('image', images[0].file)

            const res = await fetch(clientSideAPI + '/category/new', {
                method: 'POST',
                body: formData
            })
            const result = await res.json()

            if (result?.statusCode >= 400) throw new Error

            setResponseMsg({ message: 'Thêm danh mục thành công !', success: true, active: true })
            setName('')
            setImages([])

        } catch (error) {
            setResponseMsg({ message: 'Thêm danh mục thất bại!', success: false, active: true })
        }
    }

    const renderCategories = () => {
        return shopCategories.map((value, index) => {
            return (
                <tr key={index}>
                    <td> {index + 1} </td>
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
                        <button onClick={() => onDeleteCategory(value._id, index)}> Gỡ bỏ </button>
                    </td>
                </tr>
            )
        })
    }

    return (
        <div className={styles.category}>
            <div className={styles['shop-categories']}>
                <div className={styles['categories-head']}>
                    <div className={styles['categories-head__title']}> Tất cả danh mục </div>
                    <div className={styles['categories-head__page']}>
                        <button onClick={() => pageChange('prev')}>
                            <BiChevronLeft />
                        </button>
                        <button onClick={() => pageChange('next')}>
                            <BiChevronRight />
                        </button>
                    </div>
                </div>
                <div className={styles['categories-table']}>
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Hình ảnh</th>
                                <th>Tên danh mục</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderCategories()}
                        </tbody>
                    </table>
                </div>

            </div>
            <div className={styles['create-category']}>
                <div className={styles['create-category__head']}> Thêm danh mục mới </div>
                <form
                    onSubmit={(e) => onSubmit(e)}
                    className={styles['category-form']}
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
                        <div className={styles['form-item__label']}> Tên danh mục * </div>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className={styles['image-upload']}>
                        <div className={styles['image-upload__label']}> Hình ảnh danh mục (100x100) </div>
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
                                isDragging,
                                dragProps,
                            }) => (
                                // write your building UI
                                <div className={styles['upload']}>
                                    <div className={styles['upload__actions']}>
                                        {imageList.length === 0
                                            && (
                                                <button
                                                    type="button"
                                                    style={isDragging ? { color: 'red' } : undefined}
                                                    onClick={onImageUpload}
                                                    {...dragProps}
                                                >
                                                    Chọn hình ảnh
                                                </button>
                                            )
                                        }
                                        &nbsp;
                                        <button type="button" onClick={onImageRemoveAll}>Gỡ bỏ hình ảnh</button>
                                    </div>
                                    {imageList.map((image, index) => (
                                        <div key={index} className="image-item">
                                            <Image src={image['data_url']} alt="" width={100} height={100} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ReactImageUploading>
                    </div>

                    <div className={styles['form-item']}>
                        <button> Tạo danh mục mới </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CategoryManager;