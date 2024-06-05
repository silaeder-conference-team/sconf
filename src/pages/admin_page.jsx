import {Button, Checkbox, Select, Tabs, Text} from '@mantine/core';
import { useForm } from '@mantine/form'
import {useEffect, useState} from "react";
import { Table } from '@mantine/core';

const Admin_page = () => {
    const [ users, setUsers ] = useState([]);
    const [ projects, setProjects ] = useState([]);
    const [ isAdmin, setAdmin ] = useState(false)
    const [ organizer, setOrganizer ] = useState(false)
    const [ tutor, setTutor ] = useState(false)
    const [ student, setStudent ] = useState(false)
    const form = useForm();

    useEffect(() => {
        const fetching = async () => {
            const x = await fetch('/api/getAllUsers')
            return x.json()
        }
        const fetchingProjects = async () => {
            const x = await fetch('/api/getAllProjects')
            return x.json()
        }
        const checkLogin = async () => {
            const x = await fetch('/api/check_login', {method: 'POST'})
            return x.json()
        }
        fetching().then((data) => {
            setUsers(data.data);
        })
        fetchingProjects().then((data) => {
            setProjects(data.data);
        })
        checkLogin().then((data) => {
            if (data.status === 'ok') {
                if (data.user.isOrganisator) {
                    setAdmin(true)
                } else {
                    window.location.href = '/auth'
                }
            } else {
                window.location.href = '/auth'
            }
        })
    }, []);
    async function handleSubmit (user) {
        await fetch('/api/changeUserStatus', {
            method: "POST",
            body: JSON.stringify({
                isOrg: organizer,
                isTut: tutor,
                isSt: student,
                id: user
            })
        })
        window.location.href = '/admin_page'
    }
    async function handleSubmitDelete (user) {
        await console.log(user)
        await fetch('/api/deleteUserByID', {
            method: "POST",
            body: JSON.stringify({
                id: user
            })
        })
        window.location.href = '/admin_page'
    }
    async function handleSubmitMove (project) {
        await fetch('/api/moveProjectToShowcase', {
            method: "POST",
            body: JSON.stringify({
                id: project
            })
        })
        window.location.href = '/admin_page'
    }
    console.log(users)
    return (
        <>
            {isAdmin && <>
            <Tabs>
                <Tabs.List>
                    <Tabs.Tab value={"show_users"}>Показать пользователей</Tabs.Tab>
                    <Tabs.Tab value={"change_status"}>Изменить права пользователей</Tabs.Tab>
                    <Tabs.Tab value={"delete_users"}>Удалить пользователей</Tabs.Tab>
                    <Tabs.Tab value={"move_projects_to_shower_case"}>Положить в витрину</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value={"change_status"}>
                    <form onSubmit={form.onSubmit((values) => handleSubmit(values.user))}>
                        <Select
                            label="Пользователи"
                            placeholder="Выберете пользователя для изменения статуса"
                            data={users}
                            searchable
                            {...form.getInputProps('user')}
                            required
                        />
                        <Checkbox
                            label="Сделать научным руководителем"
                            onChange={(e) => {setTutor(e.target.checked); }}
                        />
                        <Checkbox
                            label="Сделать администратором"
                            onChange={(e) => {setOrganizer(e.target.checked); }}
                        />
                        <Checkbox
                            label="Сделать учеником"
                            onChange={(e) => {setStudent(e.target.checked); }}
                        />
                        <Button type={ "submit" } color={'indigo.6'}>Сохранить</Button>
                    </form>
                </Tabs.Panel>
                <Tabs.Panel value={"delete_users"}>
                    <form onSubmit={form.onSubmit((values) => handleSubmitDelete(values.user))}>
                        <Select
                            label="Пользователи"
                            placeholder="Выберете пользователя для изменения статуса"
                            data={users}
                            searchable
                            {...form.getInputProps('user')}
                            required
                        />
                        <Button type={ "submit" } color={'indigo.6'}>Удалить навсегда аккаунт</Button>
                    </form>
                </Tabs.Panel>
                <Tabs.Panel value={"move_projects_to_shower_case"}>
                    <form onSubmit={form.onSubmit((values) => handleSubmitMove(values.project))}>
                        <Select
                            label="Проекты"
                            placeholder="Выберете проект"
                            data={projects}
                            searchable
                            {...form.getInputProps('project')}
                            required
                        />
                        <Button type={ "submit" } color={'indigo.6'}>Положить в витрину</Button>
                    </form>
                </Tabs.Panel>
                <Tabs.Panel value={"show_users"}>
                    <>
                        <br />
                        {
                            users.map((user) => (
                                <Text>{user.value} {user.label}</Text>
                            ))
                        }
                    </>
                </Tabs.Panel>
            </Tabs>
            </>
            }
        </>
    )
}

export default Admin_page;