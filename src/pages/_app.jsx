import Head from 'next/head';
import { MantineProvider, ColorSchemeProvider, AppShell } from '@mantine/core';
import { useState } from "react";
import { HeaderResponsive } from "@/header";
import { FooterCentered } from "@/footer";
import { usePathname } from 'next/navigation'
import Script from 'next/script'

export default function App(props) {
    const { Component, pageProps } = props;
    const pathname = usePathname()
    const [colorScheme, setColorScheme] = useState('dark');
    const toggleColorScheme = (value) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

    const header = (
        <HeaderResponsive />
    );
    const footer = (
        <FooterCentered />
    );
    if (pathname === "/show") {
        return (
            
            <ColorSchemeProvider colorScheme='dark' toggleColorScheme={toggleColorScheme}>
                <MantineProvider
                    withGlobalStyles
                    withNormalizeCSS
                    theme={{
                        colorScheme
                    }}
                >
                    <AppShell>

                <Component {...pageProps} />
                    <Script id="recaptcha" src={`https://www.google.com/recaptcha/api.js`} />
                </AppShell>
                </MantineProvider>
            </ColorSchemeProvider>
        )
    }
    return (
        <>
            <Head>
                <title>Silaeder Conference</title>
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
            </Head>

            <ColorSchemeProvider colorScheme='dark' toggleColorScheme={toggleColorScheme}>
                <MantineProvider
                    withGlobalStyles
                    withNormalizeCSS
                    theme={{
                        colorScheme
                    }}
                >
                    <AppShell
                        padding='md'
                        header={header}
                        footer={footer}
                    >
                    <Component {...pageProps} />

                    <Script id="recaptcha" src={`https://www.google.com/recaptcha/api.js`} />
                    </AppShell>
                </MantineProvider>
            </ColorSchemeProvider>
        </>
    );
}