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
        reference.onMaterialize([](Nui::val const& element){
            // Right or Bottom edge possible.
            Nui::makeResizeable(element, ResizeableEdge::Right);
        })
    }()
}
```

:::caution

Requires 'nui/make_resizeable' to be imported somewhere in your javascript/typescript files.

:::

```js
import 'nui/make_resizeable';

// your code...
```