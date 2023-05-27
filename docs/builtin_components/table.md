# Table

The table component is an example component for tables.
Manual table rendering is as easy as using the table component.

Usage:
```cpp
#include <nui/frontend/components/table.hpp>

/* ... */

struct TableEntry
{
    std::string firstName;
    std::string lastName;
    int age;
};

void renderTable(Nui::Observed<std::vector<TableEntry>>& tableModel)
{
    auto const table = Table<TableEntry>{{ // 2 braces, because Table takes a struct
        // All parameters except tableModel can be omited.
        .tableModel = tableModel,
        .caption = "Table",
        // called once for the header:
        .headerRenderer =
            []() {
                return Nui::Elements::tr{}(
                    Nui::Elements::th{}("First Name"),
                    Nui::Elements::th{}("Last Name"),
                    Nui::Elements::th{}("Age"));
            },
        // called for every row of data:
        .rowRenderer =
            [](long long, auto const& entry) {
                return Nui::Elements::tr{}(
                    Nui::Elements::td{}(entry.firstName),
                    Nui::Elements::td{}(entry.lastName),
                    Nui::Elements::td{}(entry.age));
            },
        // called once for the footer:
        .footerRenderer =
            []() {
                return Nui::Elements::tr{}(Nui::Elements::td{}("Footer"));
            },
        // forwarded attributes:
        .tableAttributes = {id = "table"},
        .captionAttributes = {id = "caption"},
        .headerAttributes = {id = "header"},
        .bodyAttributes = {id = "body"},
        .footerAttributes = {id = "footer"},
        }}();
}
```