import React, {useEffect, useState} from "react";
import {Button, Center, Select, SimpleGrid, Text, Title} from '@mantine/core'
import {useRouter} from "next/router";
import {ProjectCardForShowcase} from '@/projectCardForShowcase'
import {ProjectCard} from "@/projectCard";
import {useForm} from "@mantine/form";
const Showcase = () => {
    const [ projects, setProjects ] = useState([]);
    const [ conferences, setConferences ] = useState([]);
    const sections = ['Информатика и программирование', 'Биология, география и химия', 'Математика',
        'История, социология и политология', 'Филология и лингвистика', 'Экономика', 'Английский язык', 'Другое']
    const [ permission, setPermission ] = useState(false)
    const [ method, setMethod ] = useState([])
    const form = useForm()
    useEffect(() => {
        const fetchingProjects = async () => {
            const x = await fetch('/api/getShowingProjects')
            return x.json()
        }
        const fetchingConferences = async () => {
            const x = await fetch('/api/getAllConferencesForProjects')
            return x.json()
        }
        fetchingConferences().then((data) => {
            setConferences(data.data.reverse())
        })
        fetchingProjects().then((data) => {
            setProjects(data.data)
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
    }, [projects])
    const router = useRouter()
    const remove = async (project) => {
        await fetch('/api/removeProjectFromShowcase', {
            method: "POST",
            body: JSON.stringify({
                id: project
            })
        })
    }
    return (
        <>
            <Center mb={"2%"}><Title>Здесь находятся лучшие проекты Силаэдра</Title></Center>
            <Center mb={"2%"}><Title>Выберете метод сортировки проектов</Title></Center>
            <Center mb={"2%"}><Select defaultValue={'По конференции'} w={'30%'}
                                      data={[{value: 'conferences', label: 'По конференции'}, {value: 'sections', label: 'По секции'}]}
                                      onChange={(data, option) => {data === 'conferences' ? setMethod(conferences) : data === 'sections' && setMethod(sections)}}
                                      /></Center>
            { JSON.stringify(method) === JSON.stringify(conferences) ? conferences.map((conference) => (
                <>
                    <Center m={'1%'}><Title>{conference.label}</Title></Center>
                    <SimpleGrid cols={3} spacing="xs" verticalSpacing="xs">
                        {permission ?  projects.map((project) => ( project.conferenceId === conference.value &&
                                <ProjectCardForShowcase key={project.id} name={project.name}
                                                        description={project.description} projectId={project.id}
                                                        section={project.section} showFunc={() => {router.push(`/project/${project.id}`)}}
                                                        openPresentation={() => {router.push("/show?prj_id="+project.id.toString())}}
                                                        remove={() => {remove(project.id)}}
                                />
                            ))  :  projects.map((project) => ( project.conferenceId === conference.value &&
                                <ProjectCardForShowcase key={project.id} name={project.name}
                                                        description={project.description} projectId={project.id}
                                                        section={project.section} showFunc={() => {router.push(`/project/${project.id}`)}}
                                                        openPresentation={() => {router.push("/show?prj_id="+project.id.toString())}}
                                />
                            )) }

                </SimpleGrid>
                </>
            )) : JSON.stringify(method) === JSON.stringify(sections) && sections.map((section) => (
                <>
                    <Center m={'1%'}><Title>{section}</Title></Center>
                    <SimpleGrid cols={3} spacing="xs" verticalSpacing="xs">
                        {permission ?  projects.map((project) => ( (project.section === section || (!(sections.includes(project.section)) && section === 'Другое')) &&
                            <ProjectCardForShowcase key={project.id} name={project.name}
                                                    description={project.description} projectId={project.id}
                                                    section={project.section} showFunc={() => {router.push(`/project/${project.id}`)}}
                                                    openPresentation={() => {router.push("/show?prj_id="+project.id.toString())}}
                                                    remove={() => {remove(project.id)}}
                            />
                        ))  :  projects.map((project) => ( project.conferenceId === conference.value &&
                            <ProjectCardForShowcase key={project.id} name={project.name}
                                                    description={project.description} projectId={project.id}
                                                    section={project.section} showFunc={() => {router.push(`/project/${project.id}`)}}
                                                    openPresentation={() => {router.push("/show?prj_id="+project.id.toString())}}
                            />
                        )) }

                    </SimpleGrid>
                </>
            )) }
        </>
    )
};

export default Showcase;