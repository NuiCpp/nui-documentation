/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
    // But you can create a sidebar manually
    documentationSidebar: [
        {
            type: 'category',
            label: 'Getting Started',
            collapsible: true,
            collapsed: false,
            items: [
                {
                    type: 'doc',
                    id: 'getting_started/installation',
                    label: 'Installation',
                },
                {
                    type: 'doc',
                    id: 'getting_started/installation_windows',
                    label: 'Installation on Windows',
                },
                {
                    type: 'doc',
                    id: 'getting_started/installation_linux',
                    label: 'Installation on Linux',
                }
            ]
        },
        {
            type: 'category',
            label: 'Tutorials',
            collapsible: true,
            collapsed: true,
            items: [
                {
                    type: 'doc',
                    id: 'tutorials/basics',
                    label: 'Basics',
                },
                {
                    type: 'doc',
                    id: 'tutorials/ui_syntax',
                    label: 'Ui Syntax',
                },
            ]
        }
    ],
};

module.exports = sidebars;
