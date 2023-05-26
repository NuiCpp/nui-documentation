# Nil

The nil expresion will render to no ui elements at all.
Useful if a conditional render produces just nothing:
```cpp
Nui::ElementRenderer myComponent(bool shallRender)
{
    if (shallRender)
        return div{}();
    else
        return nil();
}
```