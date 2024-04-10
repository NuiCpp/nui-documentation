# Tailwind CSS

## Install

In your project root directory, run the following command to add Tailwind CSS to your project:
```bash
npx add-dependencies tailwindcss postcss dotenv
```

## Configure

Create a `tailwind.config.js` file in your project root directory with the following content:
```javascript
require('dotenv').config()

module.exports = {
    content: {
        files: [
            // Adapt this to your needs, this works with a project created from the NUI template.
            `${process.env.NUI_PROJECT_ROOT}/frontend/**/*.{cpp,hpp}`,
            `${process.env.NUI_PROJECT_ROOT}/static/**/*.{html,js}`
        ]
    },
    theme: {
        extend: {},
    },
    plugins: [],
}
```

Create a `.postcssrc` file in your project root directory with the following content:
```json
{
  "plugins": {
    "tailwindcss": {}
  }
}
```

Add the Tailwind directives to your CSS file:
nui-template/static/styles/main.css:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Enable in CMake

In your backend CMakeLists.txt in your `nui_add_emscripten_target` call, add the ENABLE_TAILWIND option:
```cmake
nui_add_emscripten_target(
    ...
    ENABLE_TAILWIND
)
```

## Use in Your Application

```cpp
#include <frontend/main_page.hpp>

#include <nui/frontend/elements.hpp>
#include <nui/frontend/attributes.hpp>

Nui::ElementRenderer MainPage::render()
{
    using namespace Nui;
    using namespace Nui::Elements;
    using namespace Nui::Attributes;
    using Nui::Elements::div; // because of the global div.

    // use of the tailwind classes:
    return body{}(h1{class_ = "text-3xl font-bold underline"}("Hello, Tailwind!"));
}
```