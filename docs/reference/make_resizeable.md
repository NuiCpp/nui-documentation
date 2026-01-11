# Make Elements Resizeable at the Edge

Utility that makes elements resizeable at the edge.
```cpp
#include <nui/frontend/extensions/make_resizeable.hpp>

#include <nui/frontend/elements.hpp>
#include <nui/frontend/attributes.hpp>

Nui::ElementRenderer func()
{
    using namespace Nui::Elements;
    using namespace Nui::Attributes;
    using Nui::Elements::div;

    return div{
        id = "Outer",
        reference.onMaterialize([](Nui::val const& element){
            // Right or Bottom edge possible.
            Nui::makeResizeable(element, ResizeableEdge::Right);
        })
    }(
        div{id = "Inner"}()
    )
}
```

:::warning

Requires 'nui/make_resizeable' to be imported somewhere in your javascript/typescript files.

:::

```js
import 'nui/make_resizeable';

// your code...
```

Now add some styling:
```css
/* Flip width and height when using the bottom edge */
#Outer {
  cursor: col-resize;
  background-color: $border-color;
  min-width: 5px;
}

#Inner {
  cursor: default;
  height: 100%;
  width: calc(100% - 5px);
}
```