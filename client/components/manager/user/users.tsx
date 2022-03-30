import { useSession } from "next-auth/react";
import { FormEvent, FunctionComponent, useCallback, useEffect, useState } from "react";
import styles from './users.module.scss'
import { clientSideAPI } from "../../../utils/img";
import useSWR from "swr";
import { fetcher } from "../../../utils/swr";
import { UserInterface } from "../../../types/user";
import Moment from "react-moment";

interface UsersProps { }

const User: FunctionComponent<UsersProps> = () => {
    const [AEForm, setAEForm] = useState({
        username: '',
        name: '',
        password: '',
        retypedPassword: '',
        age: 0
    })

    const [users, setUsers] = useState<UserInterface[]>([])

    const [responseMsg, setResponseMsg] = useState({
        message: '',
        success: false,
        active: false
    })

    const { data: session } = useSession()

    const { data: userData } = useSWR<UserInterface[]>(session?.accessToken ? [clientSideAPI + `/user/getAll`, session.accessToken] : null, fetcher)

    useEffect(() => {
        
        
        if (userData) {
            setUsers(userData)
        }
    }, [userData])

    const onCreateUser = useCallback(async (e: FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault()

            if (!AEForm.username || !AEForm.password || !(AEForm.password === AEForm.retypedPassword)) {
                setResponseMsg({
                    message: "Thông tin không hợp lệ !",
                    success: false,
                    active: true
                })
                return;
            }

            const body = {
                name: AEForm.name,
                username: AEForm.username,
                password: AEForm.password,
                age: AEForm.age > 0 ? AEForm.age : undefined
            }

            const res = await fetch(clientSideAPI + `/user/create`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${session?.accessToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            })
            const data = await res.json()

            if (data?.statusCode >= 400) {
                throw new Error()
            }

            setResponseMsg({
                message: "Thêm người dùng thành công !",
                success: true,
                active: true
            })

            setAEForm({
                username: '',
                password: '',
                retypedPassword: '',
                age: 0,
                name: ''
            })

        } catch (error) {
            alert('Thêm người dùng thất bại !');
        }
    }, [AEForm])

    const renderUsers = () => {
        return users.map((value, index) => {
            return (
                <tr key={index}>
                    <td> {index + 1} </td>
                    <td> {value.username} </td>
                    <td> {value.name}</td>
                    <td> {value.age} </td>
                    <td> <Moment format="DD/MM/yy">{value.createAt}</Moment> </td>
                </tr>
            )
        })
    }

    return (
        <div className={styles['users']}>
            <div style={{ display: "flex" }}>
                <div className={styles['user-list']}>
                    <div className={styles['AE-head']}>
                        <div className={styles['AE-head__title']}> Danh sách thành viên </div>
                    </div>
                    <div className={styles['AE-table']}>
                        <table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Username</th>
                                    <th>Tên khách hàng</th>
                                    <th>Tuổi</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {renderUsers()}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className={styles['AE']}>
                    <div className={styles['AE-head']}>
                        <div className={styles['AE-head__title']}> Thêm người dùng </div>
                    </div>
                    <div className={styles['AE-table']}>
                        <form onSubmit={onCreateUser}>
                            {responseMsg.active
                                && (
                                    <h5
                                        className={styles['response-msg']}
                                        style={{ color: responseMsg.success ? '#06e763' : '#f30606' }}
                                    > {responseMsg.message} </h5>
                                )
                            }
                            <div className={styles['user-info']}>
                                <div className={styles['user-info__label']}> Username: </div>
                                <div className={styles['user-info__value']}>
                                    <input
                                        type="text"
                                        value={AEForm.username}
                                        onChange={e => setAEForm(s => ({ ...s, username: e.target.value }))}
                                        placeholder="username"
                                    />
                                </div>
                            </div>
                            <div className={styles['user-info']}>
                                <div className={styles['user-info__label']}> Tên người dùng: </div>
                                <div className={styles['user-info__value']}>
                                    <input
                                        type="text"
                                        value={AEForm.name}
                                        onChange={e => setAEForm(s => ({ ...s, name: e.target.value }))}
                                        placeholder="name"
                                    />
                                </div>
                            </div>
                            <div className={styles['user-info']}>
                                <div className={styles['user-info__label']}> Mật khẩu: </div>
                                <div className={styles['user-info__value']}>
                                    <input
                                        type="password"
                                        value={AEForm.password}
                                        onChange={e => setAEForm(s => ({ ...s, password: e.target.value }))}
                                        placeholder="Mật khẩu"
                                    />
                                </div>
                            </div>
                            <div className={styles['user-info']}>
                                <div className={styles['user-info__label']}> Nhập lại mật khẩu: </div>
                                <div className={styles['user-info__value']}>
                                    <input
                                        type="password"
                                        value={AEForm.retypedPassword}
                                        onChange={e => setAEForm(s => ({ ...s, retypedPassword: e.target.value }))}
                                        placeholder="Nhập lại mật khẩu"
                                    />
                                </div>
                            </div>
                            <div className={styles['user-info']}>
                                <div className={styles['user-info__label']}> Tuổi: </div>
                                <div className={styles['user-info__value']}>
                                    <input
                                        type="number"
                                        value={AEForm.age}
                                        onChange={e => setAEForm(s => ({ ...s, age: Number(e.target.value) }))}
                                    />
                                </div>
                            </div>
                            <div className={styles['user-info']}>
                                <button type="submit"> Thêm người dùng mới </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default User;