# Text Nodes
Sometimes it is necessary to have text nodes alongised regular html element children.
One of these examples is implicit label association:

```html
<label><input type=checkbox>Check This Out!</label>
```

In Nui this can look like this:
```cpp
using Nui::Elements::label;

label{}(
    input{
        type = "checkbox"
    },
    // highlight-start
    // Do not forget the () at the end. Even though text nodes cannot have children,
    // the parantheses are not optional for technical reasons.
    text{"Check This Out!"}()
    // highlight-end
)
```
Text content can also be dynamic using Nui::Observed<std::string>.