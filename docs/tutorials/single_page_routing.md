# Single Page Routing

To create the illusion of multiple pages in a single page, 
its possible to use the url fragment for routing:

```cpp
#include <nui/core.hpp>
#include <nui/window.hpp>
#include <nui/frontend.hpp>

Nui::Observed<std::string> urlFragment;

// Option 1
Nui::ElementRenderer multiPage1() 
{
    if (urlFragment == "about")
        return span{}("About");
    else if (urlFragment == "")
        return span{}("Main Page");
    else
        return span{}("Default");
}

// Option2
Nui::ElementRenderer multiPage2() 
{
    return switch_(urlFragment_)(
        default_()(
            span{}("Default")
        ),
        case_("")(
            span{}("Main Page")
        ),
        case_("about")(
            span{}("About")
        )
    );
}

extern "C" void frontendMain() {
    thread_local Nui::Dom::Dom dom;

    Nui::listenToFragmentChanges(urlFragment);

    dom.setBody(body{}(
        a{href = "#"}("Main"),
        a{href = "#about"}("About"),
        a{href = "#oups"}("Into Default"),
        multiPage2()
    ));
}

EMSCRIPTEN_BINDINGS(nui_example_frontend) {
    emscripten::function("main", &frontendMain);
}
#include <nui/frontend/bindings.hpp>
```