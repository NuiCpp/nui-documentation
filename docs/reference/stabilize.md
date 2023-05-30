# Stabilize

Stabilize is a helper function that can be used to prevent elements from being rerendered.
This is useful if elements are taken over by JavaScript libraries and these elements must remain in the DOM.

Example:
```cpp
#include <nui/frontend/utility/stabilize.hpp>

struct Parameters
{
    Nui::Observed<bool> toggle = true;
    StableElements stable;
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
                return stabilize(
                    params.stable, 
                    span{id = once}(button{class_ = onceClass}())
                );
                once = "X";
                onceClass = "Y";
            }
        }
    );
}
```

In this example, the StableElement exists outside this document subtree.
It will not be deleted and rerendered when toggle changes.
It will be reinserted when toggle switches from false back to true.