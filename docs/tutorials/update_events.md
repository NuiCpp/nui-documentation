# Update Events

Nui introduces a type called `Observed<T>` which alles for reactive automatic updates of the view.
Whenever an `Observed` variable is changed, the change gets first registered, but does not trigger a ui update immediately.
This is an optimization to avoid frequent rerenders, when multiple things are changed. All view elements that need changing are
flagged for redraw and then reproduced.

In this example, the change is registered, but will not cause any ui changes, because its never processed:
```cpp
Nui::Observed<T> divClass = "someClass";

auto ui = div{class_ = divClass}();

thread_local Nui::Dom::Dom dom;
dom.setBody(page);

// change is registered, but not performed:
divClass = "otherClass";
```

Only a call to `globalEventContext.executeActiveEventsImmediately();` will perform ui updates.
A call to this function is made automatically at the end of event handlers of ui elements:

The fixed example looks like this:
```cpp
Nui::Observed<T> divClass = "someClass";

auto ui = div{class_ = divClass}();

thread_local Nui::Dom::Dom dom;
dom.setBody(page);

// change is registered, but not performed yet:
divClass = "otherClass";
// highlight-start
// changes are performed:
globalEventContext.executeActiveEventsImmediately();
// highlight-end
```

Or alternatively from an event:
```cpp
Nui::Observed<T> divClass = "someClass";

const auto ui = div{}(
    div{class_ = divClass}(),
    button{onClick = [](){
        class_ = "someOtherId";
        // highlight-start
        // No need to call globalEventContext.executeActiveEventsImmediately() here, it is done for you.
        // highlight-end
    }}
);

```