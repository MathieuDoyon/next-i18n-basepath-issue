const i18n = {
    locales: ['en', 'fr'],
    defaultLocale: 'en',
};

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    basePath: '/documents',
    i18n,
};

module.exports = nextConfig;
