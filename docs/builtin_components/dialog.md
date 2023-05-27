# Dialog

The dialog component provides a simple dialog for simple use cases.
The dialog can be used like this:

```cpp
#include <nui/frontend/components/dialog.hpp>

/*...*/

using namespace Nui::Components;

DialogController controller{{
    .className = "dialogClass",
    .title = "Hey!",
    .body = "Hello, something happened!",
    .buttonClassName = "prettyButton",
    // Ok, OkCancel, YesNo, None
    .buttonConfiguration = DialogController::ButtonConfiguration::OkCancel,
    .onButtonClicked = [](Button btn){
        switch(btn)
        {
            case(DialogController::Button::Ok):
                std::cout << "ok was pressed\n";
                break;
            case(DialogController::Button::Cancel):
                std::cout << "cancel was pressed\n";
                break;
            case(DialogController::Button::Yes):
                std::cout << "yes was pressed\n";
                break;
            case(DialogController::Button::No):
                std::cout << "no was pressed\n";
                break;
        }
    }
}};

const auto dialog = Dialog(controller);

// somewhere else:
controller.show();
// controller.showModal();
// controller.hide();
```