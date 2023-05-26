# Fragments

Sometimes you cannot wrap your components in another container like a div.
For that the fragment function is useful:

```cpp
auto returnsFragment() {
    using Nui::Elements::fragment;
    using Nui::Elements::div;

    // binds two elements together without introducing a wrapper container.
    return fragment(
        div{}(),
        div{}(),
    );
}
```

```cpp
div{}(
    returnsFragment()
)
```
-> results in
```html
<div>
    <div></div>
    <div></div>
</div>
```