import {
    createStyles,
    Menu,
    Header,
    Container,
    Group,
    Burger,
    Avatar,
    Paper,
    Transition,
    rem,
    ActionIcon,
    useMantineColorScheme,
    useMantineTheme, PasswordInput, Anchor, Button, Modal, Title, Center
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconLogout, IconArrowsLeftRight, IconSun, IconMoonStars } from "@tabler/icons-react";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";

const useStyles = createStyles((theme) => ({
    dropdown: {
        position: 'absolute',
        top: rem(60),
        left: 0,
        right: 0,
        zIndex: 0,
        borderTopRightRadius: 0,
        borderTopLeftRadius: 0,
        borderTopWidth: 0,
        overflow: 'hidden',

        [theme.fn.largerThan('md')]: {
            display: 'none',
        },
    },
    inner: {
        height: rem(60),
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    links: {
        [theme.fn.smallerThan('sm')]: {
            display: 'none',
        },
    },

    burger: {
        [theme.fn.largerThan('sm')]: {
            display: 'none',
        },
    },

    link: {
        display: 'block',
        lineHeight: 1,
        padding: `${rem(8)} ${rem(12)}`,
        borderRadius: theme.radius.sm,
        textDecoration: 'none',
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
        fontSize: theme.fontSizes.sm,
        fontWeight: 500,

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        },
    },

    linkLabel: {
        marginRight: rem(5),
    },
}));

export function HeaderResponsive() {
    const [anotherOpened, changeOpened] = useState(false);
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const theme = useMantineTheme();
    const { classes } = useStyles();
    const [opened, { toggle }] = useDisclosure(false);
    const [username, set_username] = useState('')
    const router = useRouter()
    const [user, setUser] = useState()
    const [links, setLinks] = useState([
        {label: "Авторизация", link: '/auth'},
        {label: "Витрина проектов", link: '/showcase'},
        {label: "Расписание конференции", link: '/schedules'},
    ])
    useEffect(() => {
        const fetching = async () => {
            const x = await fetch('/api/getUserByID')
            return x.json()
        }
        fetching().then((data) => {
            if (data.user) {
                set_username(data.user.name);
                setUser(data.user)
                setLinks([
                    {label: "Свои проекты", link: '/'},
                    {label: "Витрина проектов", link: '/showcase'},
                    {label: "Расписание конференции", link: '/schedules'},
                ])
            } else {
                setUser(undefined)
                setLinks([
                    {label: "Авторизация", link: '/auth'},
                    {label: "Витрина проектов", link: '/showcase'},
                    {label: "Расписание конференции", link: '/schedules'},
                ])
            }
        })
    }, [])
    const linkItems = links.map((link) => {
        return (
            <a
                key={link.label}
                href={link.link}
                className={classes.link}
            >
                {link.label}
            </a>
        )
    })


    const handleClick = async () => {
        await fetch('/api/logout')
        setLinks([
            {label: "Авторизация", link: '/auth'},
            {label: "Витрина проектов", link: '/showcase'},
            {label: "Расписание конференции", link: '/schedules'},
        ])
        await router.push('/auth')
    }


    return (
        <Header height={rem(60)} mb={100}>
            <Modal opened={anotherOpened} onClose={() => { changeOpened(false) }} title="" centered>
                <Container size={350} my={10}>
                    <Title
                        align="center"
                        sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}
                    >
                        Смена пароля
                    </Title>

                    <PasswordInput label="Старый пароль" placeholder="Your last password" required mt="md" />
                    <PasswordInput label="Новый пароль" placeholder="Your new password" required mt="md" />
                    <PasswordInput label="Подтвердите пароль" placeholder="Your new password" required mt="md" />
                    <Group position="apart" mt="lg">
                        <Anchor component="button" size="sm" color={"indigo.4"}>
                            Забыли пароль?
                        </Anchor>
                    </Group>
                    <Button fullWidth mt="xl" color={"indigo.4"}>
                        Заменить
                    </Button>
                </Container>
            </Modal>
            <Container className={classes.inner} fluid>
                <Group>
                    <Burger opened={opened} onClick={toggle} className={classes.burger} size="sm" />

                    <a href='/' style={{ textDecoration: 'none', color: '#C1C2C5' }}><h3>Silaeder Conference</h3></a>
                </Group>


                <Center className={classes.links} >
                    <Group spacing={60}>
                        {linkItems}
                    </Group>
                </Center>

                <Group>

                    <Menu shadow="md" width={200} transitionProps={{ transition: 'pop', duration: 250 }}>
                        <Group my="xl">
                            <ActionIcon
                                onClick={() => toggleColorScheme()}
                                size="lg"
                                sx={(theme) => ({
                                    backgroundColor:
                                        theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                                    color: theme.colors.indigo[4],
                                })}
                            >
                                {theme.colorScheme === 'dark' && <IconSun size="1.2rem" />}
                                {theme.colorScheme === 'light' && <IconMoonStars size="1.2rem" />}
                            </ActionIcon>
                        </Group>
                        { user &&
                            <>
                                <Menu.Target>
                                    <Avatar src={null} alt="no image here" color="indigo" radius="lg" />
                                </Menu.Target>
                                <Menu.Dropdown>
                                    <Menu.Label>{username}</Menu.Label>
                                    <Menu.Item icon={<IconArrowsLeftRight size={14} />} onClick={() => { changeOpened(true) }}>Сменить пароль</Menu.Item>
                                    <Menu.Item onClick={handleClick} color="red" icon={<IconLogout size={14} />}>Выйти</Menu.Item>
                                </Menu.Dropdown>
                            </>
                        }
                    </Menu>
                </Group>

                <Transition transition="slide-right" duration={200} mounted={opened}>
                    {(styles) => (
                        <Paper className={classes.dropdown} withBorder style={styles}>
                            {linkItems}
                        </Paper>
                    )}
                </Transition>
            </Container>
        </Header>
    )
}
