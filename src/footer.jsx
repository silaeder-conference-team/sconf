import { createStyles, Text, Group, ActionIcon, rem } from '@mantine/core';
import {
    IconBrandGithub,
    IconBrandTelegram
} from '@tabler/icons-react';

const useStyles = createStyles((theme) => ({
    footer: {
        marginTop: rem(120),
        borderTop: `${rem(1)} solid ${
            theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
        }`,
    },

    inner: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: `${theme.spacing.md} ${theme.spacing.md}`,

        [theme.fn.smallerThan('sm')]: {
            flexDirection: 'column',
        },
    },

    links: {
        [theme.fn.smallerThan('sm')]: {
            marginTop: theme.spacing.lg,
            marginBottom: theme.spacing.sm,
        },
    },
}));

export function FooterCentered() {
    const { classes } = useStyles();

    return (
        <div className={classes.footer}>
            <div className={classes.inner}>

                <Group>
                    <Text size="sm" color="dimmed">
                        ©2023 Silaeder Conference. All rights reserved.
                    </Text>
                </Group>

                <Group spacing="xs" position="right" noWrap>
                    <ActionIcon size="lg" variant="default" radius="xl">
                        <a href="https://github.com/silaedr-info" style={{color: 'black'}} target="_blank">
                            <IconBrandGithub size="1.05rem" stroke={1.5} />
                        </a>
                    </ActionIcon>
                    <ActionIcon size="lg" variant="default" radius="xl">
                        <a href='https://t.me/vlppz' style={{color: "black"}} target="_blank">
                            <IconBrandTelegram size="1.05rem" stroke={1.5} />
                        </a>
                    </ActionIcon>

                </Group>
            </div>
        </div>
    );
}