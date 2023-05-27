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
    [&str, &number](){
        const auto result = *str + std::to_string(*number);
        return span{}(result);
    }
)
```