import { useState } from 'react';
import {Button, Center, Flex, TextInput, Title} from '@mantine/core';
import {DateTimePicker} from '@mantine/dates';
import {useForm} from "@mantine/form";
import {useRouter} from "next/router";
const Make_conference = () => {
    const form = useForm()
    const [dateTime, setDateTime] = useState(null);
    const router = useRouter()
    const handleSubmit = async (event) => {
        event.preventDefault();

        
        const response = await fetch('/api/addConference', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(form.values)
        });
        
        if (response.ok) {
            console.log('Conference added successfully');
        } else {
            console.error('Failed to add conference');
        }
        await router.push('/schedules')

    }
    return (
        <>
        <Center mt={'1%'}>
            <Title order={1}>Создание расписания для новой конференции</Title>
        </Center>
        <form onSubmit={handleSubmit}>
            <TextInput mx={'auto'} mt={'1%'} w={'35%'} {...form.getInputProps('name')} required
                       label={'Напишите название конференции'} placeholder={'Конференция Силаэдер'} />
            <DateTimePicker mt={'1%'}
                value={dateTime}
                onChange={setDateTime}
                label="Выберете дату и время начала конференции"
                placeholder="Нажмите для выбора"
                w={'35%'}
                mx="auto"
                {...form.getInputProps('dateTime')}
                required
            />
            <Center>
                <Button w={'35%'} mt={'2%'} mx={'auto'} type={ "submit" } color={'indigo.8'}>Сохранить</Button>
            </Center>
        </form>
        </>
    );
}

export default Make_conference