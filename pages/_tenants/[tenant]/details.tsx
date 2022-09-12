import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import type { GetServerSideProps } from 'next';

import styles from '@styles/Home.module.css';
import React from 'react';

interface PageProps {
    tenant: string;
    locale: string;
}

export const Page: React.FC<PageProps> = ({ tenant, locale: serverLocale }) => {
    const { asPath, locale } = useRouter();

    return (
        <div className={styles.container}>
            <Head>
                <title>{tenant}</title>
            </Head>
            <main className={styles.main}>
                <h1 className={styles.title}>Details page</h1>
                <Link href={asPath} locale={locale === 'en' ? 'fr' : 'en'}>
                    <a className={styles.card}>
                        Toggle language to {locale === 'en' ? 'FR' : 'EN'}
                    </a>
                </Link>

                <div>
                    <p>Server locale: {serverLocale}</p>
                    <p>tenant: {tenant}</p>
                </div>
            </main>
        </div>
    );
};
export const getServerSideProps: GetServerSideProps = async (context) => {
    const { locale, params } = context;

    return {
        props: { locale, tenant: params?.tenant },
    };
};

export default Page;
