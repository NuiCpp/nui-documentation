# Attributes

HTML elements can have attributes for different purposes.
Like the id attribute that can be referenced by CSS.

## Regular Attributes

A literal can be assigned to an attribute:
```cpp
using namespace Nui::Attributes;
// unfortunately there is a lot of name spill and overlap between C++ symbols, HTML elements and attributes.
// Its is generally better to use 'using Nui::Elements::X' instead of the entire namespace to avoid ambiguities.
// using namespace Nui::Elements;
using Nui::Elements::span;

span{id = "mySpan"}()
```

Attributes can also be C++ variables.
There are two fundamental different ways to have C++ variables become attribute values.

The first one is static on first render, and never changes the view when the variable is changed.
```cpp
std::string spanId = "mySpan";

const auto ui = span{id = spanId}();

spanId = "bla"; // does nothing!
```

## Observed Attributes

The second one requires you to wrap the variable in the `Nui::Observed` class:
```cpp
Nui::Observed<std::string> spanId = "mySpan";

const auto ui = span{id = spanId}();
```

Now when a new spanId is assigned, and the changes are processed (more on [Update Events](/docs/tutorials/update_events)), the view is automatically updated.

```cpp
Nui::Observed<std::string> spanId = "mySpan";

const auto ui = div{}(
    span{id = spanId}(),
    button{onClick = [](){
        id = "someOtherId"; // -> span id is now "someOtherId"
    }}
);
```

You have to make sure that these `Observed<T>` never get destroyed before the associated ui elements do,
how you do that is up to you (proper lifetimes, static variables, thread_local variables, globally managed state).

## Properties

Some attributes are not reactive and therefore do not infer any change from updates.
One of these attributes is the checked property of checkbox inputs.
To mitigate this shortcoming, you can set element properties directly instead of setting an attribute.

```cpp
Nui::Observed<bool> isChecked{true};

const auto ui = input{
    type = "checkbox",
    // for setting the attribute initially:
    checked = isChecked.value(),

    // This will act like: 'theInput.checked = isChecked', instead of 'isChecked.setAttribute("checked", "")'
    checked = property(isChecked)

    // Alternatively:
    // "checked"_prop = isChecked
}();
```

## Events

Some elements can invoke events, like buttons with their onClick event:
```cpp
const auto ui = button{
    onClick = [](Nui::val event){
        // The event parameter has the same content as the javascript equivalent would.
    }
}
```
The event paramter is a [Val](/docs/reference/val) of type [Mouse Event](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent).

Events always process view updates when the function scope is left. So if you change an `Observed<T>` the view will be automatically updated.

## Observed Value Generator

Sometimes you want to process observed values before rendering.
You can do this like this with attributes:

```cpp
Nui::Observed<std::vector<std::string>> spanClasses = {"mySpan", "prettySpan"};
Nui::Observed<int> spanSubclass = 0;

const auto ui = span{
    // Observe changes on the passed Nui::Observed<T> and generate a class from that
    class_ = observe(spanClasses, spanSubclass).generate([&spanClasses, &spanSubclass](){
        // use .value to access the underlying wrapped value of a Nui::Observed:
        auto classes = std::accumulate(
            std::begin(spanClasses.value()),
            std::end(spanClasses.value()),
            std::string{},
            [](auto accum, auto const& elem){
                accum = std::move(accum) + " " + elem;
            }
        );
        if (!accum.empty())
            accum.erase(accum.begin());
        accum += " spanSubclass" + std::to_string(spanSubclass.value());
        return accum;
    })
}();
```
For properties this looks as follows:
```cpp
Nui::Observed<int> num{3};

input{
    checked = observe(num).generateProperty([&num](){
        return num.value() % 2;
    })

    // Or:
    // "checked"_prop = observe(num).generate(/*...*/)
}()
```

## Custom Attributes

To define an attribute that is non standard, you can do the following:

```html
<a class="dropdown-toggle" data-bs-toggle="dropdown">
```
```cpp
// Option 1:
constexpr auto dataBsToggle = Nui::Attributes::AttributeFactory("data-bs-toggle");

auto foo()
{
    // for Option 2:
    using namespace Nui::Attributes::Literals;

    return a{
        class_ = "dropdown-toggle",
        // Can be used here now:
        dataBsToggle = "dropdown",

        // Option 2:
        "data-bs-toggle"_attr = "dropdown"
    }();
}
```

## Styles

In general, it is recommended to use seperate CSS files to style elements, because inline styles do have an impact on the WASM size if used frequently.

Styles can be passed like other attributes as a plain string:
```cpp
using Nui::Attributes::style;

const auto ui = div{
    style = "background-color: red; color: black"
}();
```

Styles can also be observed strings:
```cpp
Nui::Observed<std::string> theStyle;

const auto ui = div{
    style = theStyle
}();
```

Styles can also be passed like this:
```cpp
using Nui::Attributes::style;
using Nui::Attributes::Style;
using Nui::Attributes::Literals; // for _style

Nui::Observed<int> widthPixels = 200;

const auto ui = div{
    style = Style{
        "width"_style = observe(widthPixels).generate([&withPixels]{ return std::to_string(widthPixels) + "px"; }),
        "background-color"_style = "red",
        "color"_style = "black"
    }
}();
```

## References
There is a special reference attribute that allows you to get a handle to the real DOM element:
```cpp
using Nui::Elements::span;
using Nui::Attributes::reference;

Nui::val mySpan;

// When you want to store the reference, do so by weak_ptr to avoid dangling pointers.
// The weak_ptr becomes invalid when the element is removed from the DOM.
std::weak_ptr<Nui::Dom::BasicElement> lifetimeSafe;

const auto ui = span{
    // highlight-start
    reference = mySpan,
    // highlight-end
};
// or alternatively:
const auto ui2 = span{
    // highlight-start
    reference = [&mySpan](auto&& weakElement){ mySpan = weakElement.lock()->val(); }
    // highlight-end
};
// or
const auto ui3 = span{
    // highlight-start
    reference = lifetimeSafe
    // highlight-end
};
// and finally:
const auto ui4 = span{
    // highlight-start
    reference.onMaterialize([&mySpan](Nui::val val){mySpan = val})
    // highlight-end
};
```
The passed reference is filled when the element is rendered.
You can also pass a function if you want to perform something on render.

## Optional Attributes
Attributes can be optional (std::optional in fact).
```cpp
using Nui::Elements::input;
using Nui::Attributes::value;

std::optional<std::string> maybeAString = std::nullopt;

const auto ui = input{
    // will not be set at all if maybeAString is nullopt:
    value = maybeAString
};
```

## Delayed Attributes
Sometimes you want to set an attribute after the element is inserted into the DOM.
This can be done with the exclamation mark:
```cpp
using namespace Nui::Elements;
using namespace Nui::Attributes;
using Nui::Elements::div;

const auto d = div{
    !reference = [](Nui::val elem){
        // elem satisfies isConnected here https://developer.mozilla.org/en-US/docs/Web/API/Node/isConnected
    }
}();
```

