# Standalone Element

A standalone element is an element that is not part of the Nui::Dom.
These elements can be used to pass them to javascript libraries expecting HTML elements.

```cpp
#include <nui/frontend/elements.hpp>
#include <nui/frontend/attributes.hpp>
#include <nui/frontend/dom/element.hpp>

struct MyComponent::Implementation
{
    std::shared_ptr<Nui::Dom::Element> element{};
};

Nui::ElementRenderer MyComponent::render()
{
    using namespace Nui::Elements;
    using namespace Nui::Attributes;

    return div{
        id = "my-component",
        !reference.onMaterialize([this](Nui::val const& element){
            // Create a standalone element
            impl_->element = Nui::Dom::makeStandaloneElement(div{}("Hello World!"));

            Nui::val::global("assignElementToJavascriptFramework")(element->val());
        })
    }();
}
```