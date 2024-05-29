import { Card, Text, Badge, Button, Group } from '@mantine/core';
export function ProjectCard({name, section, description, editFunc, openPresentation, projectId, deleteProject}) {
    return (
        <Card shadow="sm" padding="lg" radius="md" sx={{width: "100%"}} withBorder>

            <Group position="apart" mb="xs">
                <Text weight={900}>{ name }</Text>
                <Badge color="pink" variant="light">
                    {section}
                </Badge>
            </Group>

            <Text size="sm" color="dimmed">
                {description}
            </Text>

            <Group align='right' sx={{width: '100vh'}}>
                <Button variant="light" color="indigo.4" mt="md" radius="md" onClick={() => {editFunc(projectId)}}>
                    Редактировать проект
                </Button>
            </Group>

            <Button variant="light" color="indigo.4" mt="md" radius="md" onClick={() => {openPresentation(projectId)}}>
                    Просмотреть презентацию
                </Button>
            {deleteProject &&
            <Button variant="light" color="red.3" mt="md" radius="md" onClick={() => {deleteProject(projectId)}}>
                 Удалить проект
            </Button>
            }
        </Card>
    )
}