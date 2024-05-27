import {Grid, Textarea, Text, Title, MultiSelect, Container, Space, Divider, SimpleGrid, TextInput, Autocomplete,
    Button, Checkbox, NumberInput, Select, Flex, Image, Loader, Group, useMantineTheme, rem
} from '@mantine/core';
import { useForm } from '@mantine/form'
import {useEffect, useState} from "react";
import { ProjectCard } from "@/projectCard";
import { Item, Value } from "@/multiSelect";
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import {IconPhoto, IconUpload, IconX, IconPresentation, IconVideo, IconCheck} from "@tabler/icons-react";
import ReactPlayer from 'react-player/lazy';
import { useRouter } from 'next/router';

const Admin_page = () => {
    const [ users, setUsers ] = useState([]);
    const [ authorized, setAuthorized ] = useState(false);
    const [ isAdmin, setAdmin ] = useState(false)
    const [ organizer, setOrganizer ] = useState(false)
    const [ tutor, setTutor ] = useState(false)
    const [ student, setStudent ] = useState(false)
    const [ id, setID ] = useState(0)
    const form = useForm();
    const router = useRouter();

    useEffect(() => {
        const fetching = async () => {
            const x = await fetch('/api/getAllUsers')
            return x.json()
        }
        const checkLogin = async () => {
            const x = await fetch('/api/check_login', {method: 'POST'})
            return x.json()
        }
        fetching().then((data) => {
            setUsers(data.data);
        })
        checkLogin().then((data) => {
            if (data.status === 'ok') {
                setAuthorized(true)
                setID(data.user.id)
                if (data.user.isOrganisator) {
                    setAdmin(true)
                } else {
                    console.log(data.user)
                }
            } else {
                window.location.href = '/auth'
            }
        })
        // setCurrentProject(userProjects[0]);
    }, []);
    async function handleSubmit (user) {
        console.log(organizer, tutor, student, id)
        const res = await fetch('/api/changeUserStatus', {
            method: "POST",
            body: JSON.stringify({
                isOrg: organizer,
                isTut: tutor,
                isSt: student,
                id: user
            })
        })
    }
    return (
        <>
            {isAdmin &&
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
            }
        </>
    )
}

export default Admin_page;