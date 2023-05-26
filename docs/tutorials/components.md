# Components

"Components" is the idea to group basic elements together in logical reusable ui components. 
Nui does not have a special syntax for components, but provides them automatically by design.


## Function Component
The simplest form of a component can be made by having a named function:
```cpp
auto myBox(Nui::Observed<bool>& boxIsBlack) -> Nui::ElementRender /* needed if you have multiple return statements */
{
    using namespace Nui::Elements;
    using namespace Nui::Attributes;
    using Nui::Elements::div; // there is a global name div in the STL :(

    if (boxIsBlack)
        return div{style = "background-color: black; width: 200px; height: 200px"}();
    else
        return div{style = "background-color: white; width: 200px; height: 200px"}();
}
```
As you can see you can have any logic in this function and are not bound to any unnecessary syntax constraints.

You can now use this component like so:
```cpp
Nui::Observed<bool> boxIsBlack = true;

const auto ui = div{}
(
    myBox(boxIsBlack),
    myBox(boxIsBlack),
    span{}()
);
```

## Class Components
Having stateful classes be components is a little bit trickier, because there are lifetime pitfalls.
The following demonstrates an issue that you might stumble over:
```cpp
class MyComponent
{
public:
    Nui::ElementRenderer operator()() const
    {
        return div{class_ = m_divClass}(
            button{
                onClick = [this](){
                    // highlight-start
                    // access to already destroyed member:
                    m_divClass = "anotherClass";
                    // highlight-end
                }
            }
        );
    }

private:
    Nui::Observed<std::string> m_divClass = "default";
};

void frontendMain() {
    MyComponent component;

    auto page = body{
        // The lifetime of "component" is NOT bound to the body.
        component()
    };

    thread_local Nui::Dom::Dom dom;
    dom.setBody(page);

    // oops: component ran out of scope!
}
```

The ui change in the onClick handler of the button of the class is capturing this and will
be using an already destroyed `m_divClass`. You have to be mindful of component classes surving the UI they produce.

One way to safeguard yourself that a component is still alive is to use std::shared_from_this:
```cpp
// highlight-start
class MyComponent : public std::enable_shared_from_this<MyComponent>
// highlight-end
{
public:
    Nui::ElementRenderer operator()() const
    {
        return div{class_ = m_divClass}(
            button{
                // highlight-start
                onClick = [weak = weak_from_this()](){
                // highlight-end
                    const auto self = weak.lock();
                    if (!self)
                        return; // I was destroyed!
                    
                    self->m_divClass = "bla";
                }
            }
        );
    }

private:
    Nui::Observed<std::string> m_divClass = "default";
};

void frontendMain() {
    const auto component = std::make_shared<MyComponent>();

    const auto page = body{
        component()
    };

    thread_local Nui::Dom::Dom dom;
    dom.setBody(page);

    // oops: component ran out of scope! But at least I am safe by using a weak_ptr
    // You naturally would want to preserve the lifetime of "component" by lifting it out of "frontendMain()"
}
```
You obviously should manage your component lifetimes correctly though, but sometimes there are valid use cases where a component
might get destroyed and you have to able to detect it.

## Final Words
All in all, component design is entirely up to you. Nui does not enforce any way of writing them or is in any way opinionated.
Just make sure that you dont run into issues with C++ object lifetimes.