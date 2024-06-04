import {Card, Text, Badge, Button, Group, Image, Flex} from '@mantine/core';
export function ProjectCardForShowcase({name, section, description, showFunc, openPresentation, projectId, remove}) {
    return (
        <Card shadow="sm" padding="lg" radius="md" sx={{width: "100%"}} withBorder>
            <Card.Section>
                <Image
                    src={"/image?prj_id=" + projectId.toString()}
                    height={'30%'}
                    alt={name}
                />
            </Card.Section>
            <Group mt={'3%'} position="apart" mb="xs">
                <Text weight={900}>{ name }</Text>
                <Badge color="pink" variant="light">
                    {section}
                </Badge>
            </Group>

            <Text size="sm" color="dimmed">
                {description.length > 100 ? description.slice(0, 80) + "...": description}
            </Text>

            <Button variant="light" w={'100%'} color="indigo.4" mt="md" radius="md" onClick={() => {showFunc(projectId)}}>
                Посмотреть проект подробнее
            </Button>
            <Flex align={'flex-end'}>
                <Button align={'flex-end'} w={'100%'} variant="light" color="indigo.4" mt="md" radius="md" onClick={() => {openPresentation(projectId)}}>
                    Просмотреть презентацию
                </Button>
            </Flex>
            { remove &&
            <Flex align={'flex-end'}>
                <Button align={'flex-end'} w={'100%'} variant="light" color="red.4" mt="md" radius="md" onClick={() => {remove(projectId)}}>
                    Убрать проект с витрины
                </Button>
            </Flex>
            }
        </Card>
    )
}