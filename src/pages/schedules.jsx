import React, {useEffect, useState} from "react";
import {Button, Center, Text} from '@mantine/core'
import {useRouter} from "next/router";
import {ScheduleCard} from '@/scheduleCard'
const Schedules = () => {
    const [ conferences, setConferences ] = useState([]);
    const [ permission, setPermission ] = useState(false)
    useEffect(() => {
        const fetchingConferences = async () => {
            const x = await fetch('/api/getAllConferencesForSchedules')
            return x.json()
        }
        fetchingConferences().then((data) => {
            setConferences(data.data)
        })
        fetch('/api/getUserPermission')
            .then(response => response.json())
            .then(data => {
                if (data.status === "ok") {
                    setPermission(data.permission)
                } else {
                    setPermission(false)
                }
            }).catch((e) => {
            router.push("/")
        })
    }, [conferences])
    const router = useRouter()
    const handleClick = () => {
        router.push('/make_conference')
    }
    return (
        <>
            {permission &&
                <Center>
                    <Button w={'35%'} color='indigo.8' onClick={handleClick}>
                        Создать новое расписание конференции
                    </Button>
                </Center>
            }

            { conferences.map((conference) => (<ScheduleCard key={conference.id} conference={conference} />))

            }
        </>
    )
};

export default Schedules;