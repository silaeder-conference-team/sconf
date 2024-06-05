import {
    Grid, Textarea, Text, Title, MultiSelect, Container, Space, Divider, SimpleGrid, TextInput, Autocomplete,
    Button, Checkbox, NumberInput, Select, Flex, Image, Loader, Group, useMantineTheme, rem, Center
} from '@mantine/core';
import { useForm } from '@mantine/form'
import {useEffect, useState} from "react";
import { ProjectCard } from "@/projectCard";
import { Item, Value } from "@/multiSelect";
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import {IconPhoto, IconUpload, IconX, IconPresentation, IconVideo, IconCheck} from "@tabler/icons-react";
import ReactPlayer from 'react-player/lazy';
import { useRouter } from 'next/router';

const Index = () => {
    const [ users, setUsers ] = useState([]);
    const [ conferences, setConferences ] = useState([]);
    const [ tutors, setTutor ] = useState([]);
    const [ authorized, setAuthorized ] = useState(false);
    const [ userProjects, setUserProjects ] = useState([])
    const [ projects, setProjects ] = useState([])
    const [ isAdmin, setAdmin ] = useState(false)
    const form = useForm();
    const router = useRouter();

    useEffect(() => {
        const fetchingConferences = async () => {
            const x = await fetch('/api/getAllConferencesForProjects')
            return x.json()
        }
        const fetchingProjects = async () => {
            const x = await fetch('/api/getUserProjects');
            return await x.json()
        }
        const fetchingAllProjects = async () => {
            const x = await fetch('/api/getNotUserProjects');
            return await x.json()
        }
        const fetchingTutors = async () => {
            const x = await fetch('/api/getAllTutors')
            return x.json()
        }
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
        fetchingConferences().then((data) => {
            setConferences(data.data)
        })
        fetchingTutors().then((data) => {
            setTutor(data.data)
        })
        fetchingProjects().then((data) => {
            setUserProjects(data.projects)
        })
        fetchingAllProjects().then((data) => {
            setProjects(data.projects)
        })
        checkLogin().then((data) => {
            if (data.status === 'ok') {
                setAuthorized(true)
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
    }, [userProjects]);
    const [ currentProject, setCurrentProject ] = useState(-1)
    const [ disabled, setDisabled ] = useState(true);
    const [ projectInformation, setProjectInformation] = useState()
    const [image, setImage] = useState([]);
    const [presentation, setPresentation] = useState([]);
    const [video, setVideo] = useState([]);

    const addProject = async (values, wasProject) => {
        let users = values.users;
        const body = {
            name: values.name,
            description: values.description,
            section: values.section,
            grade: values.grade,
            time_for_speech: 5,
            conference_id: values.conference,
            tutor_id: values.tutor,
            members: users,
            additional_users: values.additional_users,
        }
        const files = [image[0], video[0], presentation[0]];
        console.log(wasProject);
        if (wasProject === false) {
            const res = await fetch('/api/createEmptyProject', {
                method: "post"

            });

            let json = await res.json();

            body.project_id = json.project_id;
        } else {
            body.project_id = currentProject;
            files.forEach(async (file, index) => {
                console.log(file);
                let body2 = new FormData();
                body2.append("file", file);
                body2.append("prj_id", currentProject);
                body2.append("type", index === 0 ? 'images' : index === 1 ? 'videos' : 'presentations');
                body2.append("wasProject", 1);
                console.log(body2);
                await fetch(
                    process.env.NEXT_PUBLIC_FILEUPLOADER_URL+"/upload",
                    {
                        method: 'post',
                        body: body2,
                    }
                ).catch(() => {});
            })
        }
        await fetch(
            '/api/modifyProject', {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify(body)
            }
        )
        change_state(false)
    }
    function handleClick() {
        change_state(true)
        changePoint(false)
    }
    const [wasProject, changePoint] = useState(false)
    async function deleteProject(project_id) {
        await fetch('/api/deleteProjectByID', {
            method: "POST",
            body: JSON.stringify({
                id: project_id
            })
        });
    }
    async function redact(id) {
        change_state(true);
        setCurrentProject(id);
        changePoint(true);
        const res = await fetch('/api/getProjectById', {
            method: 'post',
            body: JSON.stringify({
                id: id
            })
        });
        const tutorsraw = await fetch("/api/getAllTutors");
        let tutors = Array([]);
        let tutors_hig = await tutorsraw.json();
        tutors_hig.data.forEach((x) => {
            tutors.push(x.value);
        })
        const json = await res.json();
        // console.log(json);
        let current_tutor = json.project.tutorId;
        let users = Array([]);
        // console.log(json.project);
        json.project.users.forEach((x) => {
            users.push(x.userId);
        })
        let new_json = Object.assign(json.project, {"conference": json.project.conferenceId.value, "users": users, "tutor": current_tutor, "additional_users": json.project.additionalUsers})
        json.project = new_json;
        return json;
    }
    const [new_project, change_state] = useState(false)
    const theme = useMantineTheme();
    const previewsImage = image.map((file, index) => {
        const imageUrl = URL.createObjectURL(file);
        return (
            <Image
                key={index}
                src={imageUrl}
                imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
                alt={'Input'}
            />
        );
    });
    const [videoFile, setVideoFile] = useState()
    const [url, setUrl] = useState('')
    const previewsVideo = video.map((file, index) => {
        if (file !== videoFile) {
            setVideoFile(file);
            try {
                const videoUrl = URL.createObjectURL(file);
                setUrl(videoUrl)
            } catch (e) {}
        }
        try {
            return (
                <ReactPlayer key={index} url={url} playing={true} loop={true}/>
            );
        } catch (e) {}
    });
    return (
        <>
            {authorized ? <>
            <Title
                align="center"
                sx={(theme) => ({ fontFamily: `Greycliff sans-serif, ${theme.fontFamily}`, fontWeight: 900 })}
            >
                
            </Title>
            <Space h="xl" />
            <Grid grow>
                { new_project &&
                    <Container sx={{width: '70%'}}>
                        { projectInformation ?
                    <Title align='center'>{ projectInformation.name }</Title> :
                            <Title align='center'>*Название проекта*</Title>

                        }
                    <Text color="dimmed" size="sm" align='center' mt={5}>Заполните информацию о проекте. В описании
                        напишите хотя бы 1 абзац, загрузите картинку проекта. <br />При вводе участиков, начните писать имя
                        участника и начнется поиск по всем ученикам Силаэдра. В список участников руководитель не входит! <br />Так же, если человек не из Силаэдра или
                        у него нет аккаунта, то можно добавить человека без аккаунта. <br />
                        При вводе секции попробуйте найти свой предмет. Если будет что-то, соответсветствующее вашему проекта, выбирайте это, <br />
                        при полном несоответствии секциям можете написать свой вариант. <br />
                        Конференции будут называться в соответствии с времением делания проектов, например, Летняя практика 2024. <br />
                        Если ничего похожего нет, нужно выбрать вариант "Никакая конференция".
                    </Text>
                    <Space h="xl" />
                    <form onSubmit={form.onSubmit((values) => addProject(values, wasProject))}>
                    <TextInput label="Название проекта" placeholder="Silaeder Conference" {...form.getInputProps('name')} required/>
                    <Textarea
                        placeholder="Напишите хотя бы один абзац. Например: Наш проект предостовляет совокупность сервисов, позволяющих быстро и без задержек показывать презентации и организовывать расписание."
                        label="Описание"
                        withAsterisk
                        {...form.getInputProps('description')}
                    />
                    <Select data={tutors} searchable label="Научный руководитель" placeholder="Старунова Ольга Александровна" {...form.getInputProps('tutor')} required />
                    <Autocomplete
                        label="Секция"
                        placeholder="Начните писать"
                        data={['Информатика и программирование', 'Биология, география и химия', 'Математика',
                            'История, социология и политология', 'Филология и лингвистика', 'Экономика', 'Английский язык']}
                        {...form.getInputProps('section')}
                        required
                    />
                    <Select
                        label="Конференция"
                        placeholder="Выберите конференцию, на которую вы хотите загрузить проект"
                        data={conferences}
                        {...form.getInputProps('conference')}
                        searchable
                        required
                    />
                    <NumberInput label="Класс главного участника"
                               placeholder="Запишите класс"
                               {...form.getInputProps('grade')}
                               required />
                    <MultiSelect

                        {...form.getInputProps('users')}
                        data={users}
                        limit={20}
                        valueComponent={Value}
                        itemComponent={Item}
                        searchable
                        placeholder="Начните писать ФИО"
                        label="Участники (включая научного руководителя и себя)"
                        required
                    />
                    <Space h='lg' />
                    <Checkbox
                        label="Человека нет в списке"
                        onChange={(e) => {setDisabled(!e.target.checked); }}
                    />
                    <TextInput label="ФИО" placeholder="Напишите ФИО недостающих через запятую" disabled={disabled}
                               {...form.getInputProps('additional_users')}
                    />
                    <Space h="lg" />
                    <Text color="dimmed">Загрузите ниже фото или скрин вашего проекта. Это должно быть самым красивым, самым главным,
                        что хотелось бы показать. Данное вами изображение будет на странице вашего проекта и, если повезёт,
                        на витрине проекта, поэтому есть ограничение. Изображение должно быть горизонтальным и формы листа А5.</Text>
                    <Dropzone mb={'2%'} aria-required
                        onDrop={(files) => {setImage(files)}}
                        maxSize={3 * 1024 ** 2}
                        maxFiles={1}
                        accept={IMAGE_MIME_TYPE}>
                        <Group position="center" spacing="xl" style={{ minHeight: rem(100), pointerEvents: 'none' }}>
                            {previewsImage.length === 0 &&
                             <>
                            <Dropzone.Accept>
                                <IconUpload
                                    size="3.2rem"
                                    stroke={1.5}
                                    color={theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6]}
                                />
                            </Dropzone.Accept>
                            <Dropzone.Reject>
                                <IconX
                                    size="3.2rem"
                                    stroke={1.5}
                                    color={theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]}
                                />
                            </Dropzone.Reject>
                            <Dropzone.Idle>
                                <IconPhoto size="3.2rem" stroke={1.5} />
                            </Dropzone.Idle>
                            </>
                            }
                            <div>
                                <Text size="xl" inline>
                                    Переместите сюда изображение или нажмите, чтобы выбрать файл
                                </Text>
                                <Text size="sm" color="dimmed" inline mt={7}>
                                    Файл не должен весить более 3мб
                                </Text>
                                <SimpleGrid
                                    cols={4}
                                    breakpoints={[{ maxWidth: 'sm', cols: 1 }]}
                                    mt={previewsImage.length > 0 ? 'xl' : 0}
                                >
                                    {previewsImage}
                                </SimpleGrid>
                            </div>
                        </Group>
                    </Dropzone>
                    <Text color="dimmed">Это видео будет храниться и показываться отдельно от презенации. В самой презентации также могут
                        быть видео. Но здесь, как и в случае изображения должно быть самое главное.</Text>
                    <Dropzone mb={'2%'}
                              onDrop={(files) => {setVideo(files)}}
                              maxSize={20 * 1024 ** 2}
                              maxFiles={1}
                              accept={{
                                  'video/*': []
                              }}>
                        <Group position="center" spacing="xl" style={{ minHeight: rem(100), pointerEvents: 'none' }}>
                            {previewsVideo.length === 0 &&
                                <>
                                    <Dropzone.Accept>
                                        <IconUpload
                                            size="3.2rem"
                                            stroke={1.5}
                                            color={theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6]}
                                        />
                                    </Dropzone.Accept>
                                    <Dropzone.Reject>
                                        <IconX
                                            size="3.2rem"
                                            stroke={1.5}
                                            color={theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]}
                                        />
                                    </Dropzone.Reject>
                                    <Dropzone.Idle>
                                        <IconVideo size="3.2rem" stroke={1.5} />
                                    </Dropzone.Idle>
                                </>
                            }
                            <div>
                                <Text size="xl" inline>
                                    Переместите сюда видео или нажмите, чтобы выбрать файл
                                </Text>
                                <Text size="sm" color="dimmed" inline mt={7}>
                                    Файл не должен весить более 20мб
                                </Text>
                                {previewsVideo &&
                                    <SimpleGrid
                                        cols={4}
                                        breakpoints={[{ maxWidth: 'sm', cols: 1 }]}
                                        mt={previewsVideo.length > 0 ? 'xl' : 0}
                                    >
                                        {previewsVideo}
                                    </SimpleGrid>
                                }
                            </div>
                        </Group>
                    </Dropzone>
                    <Text color="dimmed">Загрузите ниже презентацию. Она будет показана на конференции. После загрузки можно будет посмотреть на
                        вид получившейся презентации.</Text>
                    <Dropzone mb={'2%'} maxFiles={1}
                              onDrop={setPresentation}
                              accept={[
                                  'application/vnd.openxmlformats-officedocument.presentationml.presentation']}>
                        <Group position="center" spacing="xl" style={{ minHeight: rem(100), pointerEvents: 'none' }}>
                            {presentation.length === 0 ?
                                <>
                                    <Dropzone.Accept>
                                        <IconUpload
                                            size="3.2rem"
                                            stroke={1.5}
                                            color={theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6]}
                                        />
                                    </Dropzone.Accept>
                                    <Dropzone.Reject>
                                        <IconX
                                            size="3.2rem"
                                            stroke={1.5}
                                           v color={theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]}
                                        />
                                    </Dropzone.Reject>
                                    <Dropzone.Idle>
                                        <IconPresentation size="3.2rem" stroke={1.5} />
                                    </Dropzone.Idle>
                                </>
                            : <IconCheck size="3.2rem"
                                         stroke={1.5}
                                         color={theme.colors.green[theme.colorScheme === 'dark' ? 4 : 6]} />}
                            <div>
                                <Text size="xl" inline>
                                    Переместите сюда презентацию или нажмите, чтобы выбрать файл
                                </Text>
                                <Text size="sm" color="dimmed" inline mt={7}>
                                    Файл не должен весить более 3мб
                                </Text>
                            </div>
                        </Group>
                    </Dropzone>
                    <Button type={ "submit" } color={'indigo.6'}>Сохранить</Button>
                    </form>
                </Container>
                }
                <Divider orientation="vertical"/>
                <Container sx={{width: '50vh'}}>
                    { isAdmin &&
                    <Button mb={'5%'} color={'orange.4'} fullWidth onClick={() => router.push('/admin_page')}> Перейти на панель администратора </Button>
                    }
                    <Button mb={'5%'} color={'indigo.3'} fullWidth onClick={handleClick}> Создать новый проект </Button>
                    <Center m={'3%'}><Title>Ваши проекты</Title></Center>
                    {userProjects.length === 0 && <Center><Title>. . .</Title></Center>}
                    <SimpleGrid cols={1} spacing="xs" verticalSpacing="xs">
                        { userProjects.map(project => (
                            <ProjectCard key={project.id} name={project.name} description={project.description} projectId={project.id}
                                         section={project.section} editFunc={async (id) => {const result = (await redact(id)).project; setProjectInformation(result); form.setValues(result)}}
                                         openPresentation={(project_id) => {router.push("/show?prj_id="+project_id)}}
                                         deleteProject={(project_id) => deleteProject(project_id)}
                            />
                        ))}

                    </SimpleGrid>
                    { isAdmin &&
                        <>
                            <Center m={'3%'}>
                                <Title>Не ваши проекты</Title>
                            </Center>
                        <SimpleGrid cols={1} spacing="xs" verticalSpacing="xs">
                    { projects.map(project => (
                        <ProjectCard key={project.id} name={project.name} description={project.description} projectId={project.id}
                        section={project.section} editFunc={async (id) => {const result = (await redact(id)).project; setProjectInformation(result); form.setValues(result)}}
                        openPresentation={(project_id) => {router.push("/show?prj_id="+project_id)}}
                        />

                        ))}
                        </SimpleGrid>
                        </>
                        }
                </Container>
            </Grid>
            </> : <>
                <Flex w="100%" h="100%" mx="auto" align="center" justify="center">
                    <Flex align="center" direction="column">
                        <Loader mb="10px" size="xl" variant="bars" />
                        <Text size="xl">Пожалуйста подождите</Text>
                    </Flex>
                </Flex>
            </> }
            </>
    );
}

export default Index
