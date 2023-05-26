# UI Syntax

Nui defines a domain specific embedded language for the ui.
It combines a HTML like appearance with inline C++ code.

```cpp
// within frontend main:
const auto page = 
div{id = "divId"}
(
    button{}()
);

thread_local Nui::Dom::Dom dom;
dom.setBody(page);
```
The HTML equivalent would look like this:
```html
<div id="divId">
    <button></button>
</div>
```

A Ui Element breaks down to:
```cpp
// element name
div{
    /* attributes here, like class_, id, onClick, ... */
}(
    /* children here */
    /* These parenthesis may not be omitted */
)
```
This expression DOES NOT represent a div directly, but it creates a factory that is able to make divs.
These factories can then be composed and made into components.