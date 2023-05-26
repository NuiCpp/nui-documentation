# What is Nui?

Nui is a GUI library for the desktop written in C++ for C++ Developers.
It provides a UI language to seamlessly write C++ frontend code and integrate with existing styling frameworks like bootstrap,
making it easy to create beautiful UIs für C++ applications.

# Why Nui?

Why pick Nui for your UI?
- Ever used and liked Electron but were unhappy with the volatile JavaScript ecosystem?
- You like React and wished something similar would exist for C++.
- You want a UI library that does not come with a huge set of libraries or a Runtime (java, qt, ...)
- You do not want to settle for shabby old, 1990 like, UI.
- You want to leverage the vast set of existing JavaScript libraries for UI tasks.
- You want to marry existing C++ with a modern looking UI.

Why not to pick Nui
- You intend to build Web + WebView applications. Nui produces a WASM file that is usually a bit too big for web apps (maybe not for your use case?).
- You want a native OS look & feel.
- You need to support MacOS (might be solved in the future, looking for contributor for a few lines of code).
- Your existing codebase that is in need of a UI does not compile on, or support, clang or cmake.

# Comparison With Other UI Solutions

## Qt
Qt is a huge framework that requires you to install Qt onto your system or ship several hundred megabytes of libraries with your application.
Qt is also not free like Nui.
Qt has its own rendering and also supports CSS styling with a WYSIWYG editor.
Its arguably a great UI library with broad platform support, but its bulky and is costly for proprietary use.

## Electron with React/Vue.js
Nui actually compares itself with a completely different Tech Stack, because its very similar in idea and design.
Nui is essentially this, but in C++ with C++ integrations.

## Tauri
Tauri is also similar in concept, but for Rust. And Tauri does not do any UI work directly. But it pairs with well Svelte.

# What Does The Future Hold for Nui?

There are some areas that could be explored for nui expanding its scope:
- Support for MacOS
  - ^looking for a contributor that ports nuis WebView extension to MacOS.
- Support for Android and iOS
  - Maybe if the underlying webview library gets more attention for this feature: https://github.com/webview/webview/issues/871
- SSR to bring blazingly fast nui applications into the web without a WASM file download overhead.