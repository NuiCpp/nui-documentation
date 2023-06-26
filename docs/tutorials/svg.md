# Svg

SVG elements and its children need to be within the xml namespace for SVG.
Because of this, svg elements are seperated from regular html elements and can be used like this:

```cpp
#include <nui/frontend/svg.hpp>

auto svgComponent()
{
    // SVG Attributes and Elements have several collisions with regular ones.
    namespace se = Nui::Elements::Svg;
    namespace sa = Nui::Attributes::Svg;

    return se::svg{
        sa::viewBox = "0 0 200 100"
    }(
        se::path{
            sa::fill = "none",
            sa::stroke = "lightgrey",
            sa::d = "M20,50 C20,-50 180,150 180,50 C180-50 20,150 20,50 z"
        }(),
        se::circle{
            sa::r = "5",
            sa::fill = "red"
        }(
            se::animateMotion{
                sa::dur = "3s",
                sa::repeatCount = "indefinite",
                sa::path = "M20,50 C20,-50 180,150 180,50 C180-50 20,150 20,50 z"
            }()
        )
    );
}
```