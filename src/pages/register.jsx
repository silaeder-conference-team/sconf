import {
    TextInput,
    PasswordInput,
    Anchor,
    Paper,
    Title,
    Text,
    Container,
    Button,
    Checkbox,
    Space,
    Center,
    SegmentedControl,
} from '@mantine/core';
import {useForm} from "@mantine/form";
import {setCookie} from "cookies-next";
import MD5 from "crypto-js/md5";
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Auth() {
    const router = useRouter();
    const form = useForm({
        initialValues: {
            fio: '',
            email: '',
            password: ''
        },

        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            fio: (value) => (/^(?:[А-Я][а-я]*\s?){2,}$/.test(value) ? null : 'Invalid name'),
        },
    });

    async function register(fio, email, password) {
        const captureResponse = grecaptcha.getResponse();
        if (!captureResponse.length > 0) return

        let res = await fetch("/api/register", {
            method: "post",
            body: JSON.stringify({
                name: fio,
                email: email,
                password_hash:  MD5(password).toString(),
                captureResponse : captureResponse,
            })
        });

        let json = await res.json();

        const token = json.token;

        if ((typeof token === "string") && (token !== "")) {
            setCookie("auth_token", token, {maxAge: 31536000});

            window.location.href = "/";
        }
    }

    return (
        <Container size={420} my={40}>
            
            <Title
                align="center"
                sx={(theme) => ({fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900})}
            >
                Создайте аккаунт
            </Title>
            <Text color="dimmed" size="sm" align="center" mt={5}>
                Если вы уже использовали платформу то войдите в свой аккаунт, в противном случае создайте его.
            </Text>

            
                <Paper withBorder shadow="md" p={25} mt={30} radius="md">


                        <form onSubmit={form.onSubmit((values) => register(values.fio, values.email, values.password))}>
                    <TextInput label="ФИО" placeholder="Максим Таран Владимирович"
                        required {...form.getInputProps('fio')} />
                    <TextInput label="Эл. почта" placeholder="jhondoe@example.com"
                               required {...form.getInputProps('email')} />
                    <PasswordInput label="Пароль" placeholder="Password" required
                                   mt="md" {...form.getInputProps('password')} />
                    <Space h="lg"/>
                    <Checkbox
                        required
                        label="Я согласен на обработку персональных данных"
                    />
                    
                    <Space h="md" />
                        
                    <Center>
                        <div class="g-recaptcha" data-sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_TOKEN} />
                    </Center>
                    
                    <Button type="submit" fullWidth mt="xl" href={'/'} color={"indigo.4"}>
                        Создать Аккаунт
                    </Button>


                        </form>
			<Space h="sm" />
		     <Anchor component="button" size="sm" align="right">
                        <a href="/auth" style={{textDecoration: 'none', color: "#748FFC"}}>
                            У меня уже есть аккаунт
                        </a>
                    </Anchor>
                </Paper>
        </Container>
    );
}
