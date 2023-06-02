# Stabilize

Stabilize is a helper function that can be used to prevent elements from being rerendered.
This is useful if elements are taken over by JavaScript libraries and these elements must remain in the DOM.

Example:
```cpp
#include <nui/frontend/utility/stabilize.hpp>

struct Parameters
{
    Nui::Observed<bool> toggle = true;
    Nui::StableElement stable;
}

auto foo(Parameters& params) 
{
    return div{}(
        observe(params.toggle),
        [&params]() -> Nui::ElementRenderer{
            if (!*params.toggle)
                return nil();
            else
            {
                static std::string once = "once";
                static std::string onceClass = "onceClass";
                const auto s = stabilize(
                    params.stable, 
                    span{id = once}(button{class_ = onceClass}())
                );
                // These will never be the id and class_, because the element is stable.
                // unless stable.reset() is used.
                once = "X";
                onceClass = "Y";
                return s;
            }
        }
    );
}
```

In this example, the `StableElement` exists outside this document subtree.
It will not be deleted and rerendered when toggle changes.
It will be reinserted when toggle switches from false back to true.

The `StableElement` can be reset with `StableElement::reset()`. It will then rerender on the next render.
And it can be deleted directly with `StableElement::destroy()`.

## Caveats

StableElements can not be created from fragments or nil().
fragments are auto-wrapped by a div, and nil() renderer produce a div.

```cpp
stabilize(stable, fragment(div{}(), span{}()));
```
will become
```html
<div> <!-- auto introduced wrapper, because fragments are invalid stable elements -->
    <div></div>
    <span></span>
</div>
```

```cpp
stabilize(stable, nil());
```
will become
```html
<div> <!-- instead of nothing -->
</div>
```
