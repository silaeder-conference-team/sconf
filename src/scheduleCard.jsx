import {Calendar, DateTimePicker} from '@mantine/dates';
import {Button, Card, Center, Indicator, Text, Title} from "@mantine/core";
import {useRouter} from "next/router";
export function ScheduleCard({conference}) {
    const calendarDate = new Date(conference.value[1])
    const router = useRouter()


    const handleClick = (id) => {
        router.push(`/schedule/${id}`)
    }


    return (
            <Card mt={'1%'} mx={'auto'} shadow="sm" padding="lg" radius="md" sx={{width: "35%"}} withBorder>
                <Title mx={'auto'}>{conference.label}</Title>
                <DateTimePicker mt={'1%'}
                                disabled
                                value={calendarDate}
                                label="Дата конференции"
                                w={'35%'}
                                mx="auto"
                                required
                />
                <Center mt={'3%'}>
                    <Button color={'indigo.8'} onClick={() => handleClick(conference.value[0])}>Перейти к конференции</Button>
                </Center>
            </Card>
    )
}
