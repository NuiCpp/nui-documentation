# Integrating Bootstrap

## Install and Import Bootstrap

The following assumes the nui-template structure.

1. Install bootstrap

`npm i --save bootstrap @popperjs/core`

2. Import Bootstrap:

static/index.html:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nui</title>

    <!-- Import like this to achieve inlining -->
    <style>
        @import "./styles/main.scss";
    </style>

    <!-- Import like this to achieve inlining -->
    <script type="module" defer>
        // HERE
        import * as bootstrap from "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";
        import "../bin/index.js";
    </script>
</head>
<body>
</body>
```

static/styles/main.scss:
```scss
/* variables here */

@import "../../node_modules/bootstrap/scss/bootstrap.scss";
```

## Defining Custom Attributes For Bootstrap

You can define non standard attributes like this:
```cpp
#include <nui/frontend/attributes/impl/attribute.hpp>

constexpr auto dataBsTarget = Nui::Attributes::AttributeFactory("data-bs-target");

// =>
div{
    dataBsTarget = "#something"
}()
```