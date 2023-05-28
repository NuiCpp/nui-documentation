// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

const organizationName = "NuiCpp";
const projectName = "nui-documentation";

const url = `https://${organizationName}.github.io`;
const baseUrl = `/${projectName}/`;

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: 'Nui',
    tagline: 'A C++ WebView User Interface Library',
    favicon: 'img/favicon.ico',

    // Set the production url of your site here
    url: url,
    // Set the /<baseUrl>/ pathname under which your site is served
    // For GitHub pages deployment, it is often '/<projectName>/'
    baseUrl: baseUrl,

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName,
    projectName,

    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',

    // Even if you don't use internalization, you can use this field to set useful
    // metadata like html lang. For example, if your site is Chinese, you may want
    // to replace "en" with "zh-Hans".
    i18n: {
        defaultLocale: 'en',
        locales: ['en'],
    },

    presets: [
        [
            'classic',
            /** @type {import('@docusaurus/preset-classic').Options} */
            ({
                docs: {
                    sidebarPath: require.resolve('./sidebars.js'),
                    editUrl: `https://github.com/${organizationName}/${projectName}/tree/main/`,
                },
                blog: {
                    showReadingTime: true,
                    editUrl: `https://github.com/${organizationName}/${projectName}/tree/main/`,
                },
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
            }),
        ],
    ],

    themeConfig:
        /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
        ({
            // Replace with your project's social card
            image: 'img/docusaurus-social-card.jpg',
            navbar: {
                title: 'Nui',
                logo: {
                    alt: 'Nui Logo',
                    src: 'img/logo.svg',
                },
                items: [
                    {
                        type: 'docSidebar',
                        sidebarId: 'documentationSidebar',
                        position: 'left',
                        label: 'Documentation',
                    },
                    {
                        href: `${url}${baseUrl}docs/doxygen`,
                        label: 'Doxygen'
                    },
                    { to: 'blog', label: 'Updates', position: 'left' },
                    {
                        href: 'https://github.com/NuiCpp/Nui',
                        label: 'GitHub',
                        position: 'right',
                    },
                ],
            },
            footer: {
                style: 'dark',
                links: [
                    {
                        title: 'Docs',
                        items: [
                            {
                                label: 'Getting Started',
                                to: '/docs/getting_started/installation',
                            },
                        ],
                    },
                    {
                        title: 'Community',
                        items: [],
                    },
                    {
                        title: 'More',
                        items: [],
                    },
                ],
            },
            prism: {
                theme: lightCodeTheme,
                darkTheme: darkCodeTheme,
            },
            defaultMode: 'dark',
            respectPrefersColorScheme: true,
        }),
};

module.exports = config;
