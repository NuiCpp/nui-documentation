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
            type: 'doc',
            id: 'what_is_nui',
            label: 'What is Nui?',
        },
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
                    label: 'UI Syntax',
                },
                {
                    type: 'doc',
                    id: 'tutorials/attributes',
                    label: 'Attributes',
                },
                {
                    type: 'doc',
                    id: 'tutorials/update_events',
                    label: 'Update Events',
                },
                {
                    type: 'doc',
                    id: 'tutorials/components',
                    label: 'Components',
                },
                {
                    type: 'doc',
                    id: 'tutorials/observed_rendering',
                    label: 'Observed Rendering',
                },
                {
                    type: 'doc',
                    id: 'tutorials/range_rendering',
                    label: 'Range Rendering',
                }
            ]
        },
        {
            type: 'category',
            label: 'Builtin Components',
            collapsible: true,
            collapsed: true,
            items: [
                {
                    type: 'doc',
                    id: 'builtin_components/table',
                    label: 'Table',
                },
                {
                    type: 'doc',
                    id: 'builtin_components/dialog',
                    label: 'Dialog',
                },
                {
                    type: 'doc',
                    id: 'builtin_components/select',
                    label: 'Select',
                }
            ]
        },
        {
            type: 'category',
            label: 'Reference',
            collapsible: true,
            collapsed: true,
            items: [
                {
                    type: 'doc',
                    id: 'reference/val',
                    label: 'Val',
                },
                {
                    type: 'doc',
                    id: 'reference/fragment',
                    label: 'Fragments',
                },
                {
                    type: 'doc',
                    id: 'reference/nil',
                    label: 'Nil',
                },
            ]
        }
    ],
};

module.exports = sidebars;
