# Observed Rendering

Sometimes its necessary to generate and auto update elements based on observed variables.
This is possible through this syntax:
```cpp
#include <nui/frontend.hpp>

/*...*/

Nui::Observed<std::string> str{"test"};
Nui::Observed<int> number{0};

const auto ui = div{}(
    observe(str, number),
    // This function is recalled and regenerates its respective elements,
    // when 'str' or 'number' changes.
    [](std::string const& str, int number) -> Nui::ElementRenderer {
        const auto result = str + std::to_string(number);
        return span{}(result);
    }
)
```
Alternatively (generate function takes no arguments):
```cpp
Nui::Observed<std::string> str{"test"};
Nui::Observed<int> number{0};

const auto ui = div{}(
    observe(str, number),
    // This function is recalled and regenerates its respective elements,
    // when 'str' or 'number' changes.
    [&str, &number]() -> Nui::ElementRenderer {
        const auto result = *str + std::to_string(*number);
        return span{}(result);
    }
)
```

## shared_ptr of Observed

Sometimes Observed may expire while the element affected by it is still part of the DOM.
Nui can use weak_ptrs to avoid dangling pointers to expired Observed.
```cpp
#include <nui/frontend.hpp>

/*...*/

std::shared_ptr<Nui::Observed<std::string>> str = std::make_shared<Nui::Observed<std::string>>("test");

const auto ui = div{}(
    observe(str),
    // This function is recalled and regenerates its respective elements,
    // when 'str' changes. Unless str is expired.
    [weak = std::weak_ptr{str}]() -> Nui::ElementRenderer {
        if (auto str = weak.lock(); str)
        {
            return span{}(str->value());
        }
        return Nui::nil();
    }
)
```