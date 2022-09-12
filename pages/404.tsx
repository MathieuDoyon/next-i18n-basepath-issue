import { useRouter } from 'next/router';

export default function Custom404() {
    const { basePath, locale, route, pathname } = useRouter();
    console.log({ basePath, locale, route, pathname });

    return (
        <div>
            <h1>404 - Page Not Found</h1>
            <code>
                {JSON.stringify({ basePath, locale, route, pathname }, null, 2)}
            </code>
        </div>
    );
}
