# Select

The select component wraps around HTML select and option.
Here is how to use it:
```cpp
using OptionType = Nui::Components::SelectOptions<int>;
Nui::Observed<std::vector<OptionType>> options = {
    OptionType{.label = "First", .value = 3},
    OptionType{.label = "Second", .value = 78},
};

using namespace Nui::Attributes;

const auto ui = Select({
    .model = options,
    .preSelectedIndex = 0, // pre select first element
    .onSelect = [](long long index, OptionType const& option) {
        std::cout << "Selected [" << index << "]: " << option.label << " = " << option.value << "\n";
    }
    .selectAttributes = {
        id = "mySelect"
    }
})
```

Renders to:
```html
<select id="mySelect" onSelect=...>
    <option value=3 selected>First</option>
    <option value=78>Second</option>
</select>
```