# Rendering Ranges

## Observed Ranges
To render a list of things, you can use the range syntax:
```cpp
#include <fmt/format.h>

struct Person
{
    std::string name;
    int age;
};

auto foo() {
    Nui::Observed<std::vector<Person>> people = /*...*/;

    return div{}(
        // highlight-start
        // Indicates that the following function is to be rendered for each element in people.
        // The range is rerendered optimally, when people is changed.
        people.map(
        // highlight-end
            [](long long index, auto const& currentElement){
                return span{}(fmt::format("{} is {} years old!", currentElement.name, currentElement.age));
            }
        )
    )
}
```

This range is also reactive. Changing the people vector causes (re)renders of modified, erased or inserted elements.
There are optimizations in place if only some elements are changed.
But if you want to transform the entire range or replace it entirely, than these optimizations are detrimental instead of helpful.
This code snippet shows the two ways of modifying the range and what you should do to bypass modification optimizations:
```cpp
auto foo() {
    thread_local Nui::Observed<std::vector<int>> numbers = {1, 2, 3, 4, 5};

    return fragment(
        div{}(
            // map data to view elements:
            numbers.map([](long long index, auto currentElement){
                return div{}(currentElement);
            })
            // Additional elements at the end here or at the front are currently not supported within
            // the same container element.
        ),
        button{
            onClick = [&numbers](){
                // inserting elements at the end: is fastest through the wrapper
                numbers.push_back(9);

                // modifying a single element or a few elements: is fastest through the wrapper
                numbers[0] = 17;
            }
        }(),
        button{
            onClick = [&numbers]() {
                // modifying the entire range: faster if not through the wrapper:
                // .modify creates an RAII proxy that when deleted, creates an update event for the entire range:
                auto proxy = numbers.modify();

                std::transform(proxy->begin(), proxy->end(), proxy->begin(), [](int elem){
                    return elem * 2;
                });

                // You can also work directly on the value and call modify later:
                auto& value = numbers.value();
                std::transform(value.begin(), value.end(), value.begin(), [](int elem){
                    return elem * 2;
                });

                // modifyNow also calls the eventContext executeActiveEventsImmendiately.
                // This is not necessary from event attributes, because its called at the end anyway.
                numbers.modifyNow();
            }
        }()
    );
}
```

## Static Ranges
Static ranges are ranges that are not reactive. They are only rendered once and never unless the parent element is rerendered.
There is another exception, passing an observed as a second argument makes the range rerenderable when the observed changes.
This case is not optimized though, so only use it for small ranges.

```cpp
#include <fmt/format.h>

struct Person
{
    std::string name;
    int age;
};

std::vector<Person> people = /*...*/;

auto foo() {

    return div{}(
        // highlight-start
        range(people),
        // highlight-end
        [](long long index, auto const& currentElement){
            return span{}(fmt::format("{} is {} years old!", currentElement.name, currentElement.age));
        }
    )
}
```

### Static Range with Observed
```cpp
#include <fmt/format.h>

struct Person
{
    std::string name;
    int age;
};

std::vector<Person> people = /*...*/;
Nui::Observed<bool> trigger;

auto foo() {
    return div{}(
        // highlight-start
        // The second argument is an observed, so the range is rerendered when trigger changes.
        range(people, trigger),
        // highlight-end
        [](long long index, auto const& currentElement){
            return span{}(fmt::format("{} is {} years old!", currentElement.name, currentElement.age));
        }
    )
}
```

## Notes about the Optimization
The ranges optimization that is applied to `Nui::Observed<std::vector>` and `Nui::Observed<std::deque>` makes it so that only the changed/inserted elements are rerendered and only erased elements are removed and nothing else is rerendered.
This is done by tracking the changes using some algorithms on an interval tree.

Insertions, modifications and erasures are only ever tracked alone, so if you switch from inserting elements to modifying elements a rerender is forced.
If you erase something after modifying, all erased elements that were previously modified will not be rerendered only if the erasure happens at the end.
If you erase something after inserting, all erased elements that were previously inserted will not be rerendered only if the erasure happens at the end.

All wisdoms about modifying a vector apply to these optimizations. It is optimal to only ever add or erase from the end of the vector.
The most detrimental thing you can do is inserting at every odd position or erasing at every odd position, this will defeat the optimization and it will
be much better to just rerender the entire range.
