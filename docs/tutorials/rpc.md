# Frontend \<\-\> Backend Communication

Nui provides a way to communicate between frontend and the main process running the WebView.
This intentionally does not use async in the frontend, because using Asyncify comes with a considerable
size overhead and some quirky behaviour that nui does not want to enforce. Instead a callback style is used.

## Setup RPC in the Main Process

```cpp
#include <nui/backend/rpc_hub.hpp>
#include <nui/core.hpp>
#include <nui/window.hpp>

#include <index.hpp>

int main()
{
    Window window{"Minecraft Modpack Maker", true /* may open debug window */};
    window.setSize(1200, 800, WebViewHint::WEBVIEW_HINT_NONE);
    window.setHtml(index());

    // highlight-start
    // Create RpcHub class responsible for communication:
    RpcHub hub{window};

    // Convenience function to enable all extensions. Prefer to enable only what you need.
    hub.enableAll();
    // highlight-end

    window.run();
}
```

RpcHub comes with some extensions what can be enabled.
All are disabled by default for security reasons.

### Usage

#### Backend
Registering a function that is callable from the frontend:
```cpp
#include <nui/backend/rpc_hub.hpp>
#include <nui/core.hpp>
#include <nui/window.hpp>

#include <index.hpp>

int main()
{
    Window window{"Minecraft Modpack Maker", true /* may open debug window */};
    window.setSize(1200, 800, WebViewHint::WEBVIEW_HINT_NONE);
    window.setHtml(index());

    // Create RpcHub class responsible for communication:
    RpcHub hub{window};

    // highlight-start
    hub.registerFunction(
        "functionName",
        // Parameters can either be be converted from json by nlohmann::json.get<decay_t<T>>...
        [&hub](std::string const& responseId, int param2){
            // ...
            hub.callRemote(responseId, nlohmann::json{});
        }
    );

    hub.registerFunction(
        "functionName",
        // ...or a nlohmann::json and you can dissect it yourself:
        [](nlohmann::json const& args){
            // ...
        }
    );
    // highlight-end

    window.run();
}
```
Calling a frontend Function:
```cpp
#include <nui/backend/rpc_hub.hpp>
#include <nui/core.hpp>
#include <nui/window.hpp>

#include <index.hpp>

int main()
{
    Window window{"Minecraft Modpack Maker", true /* may open debug window */};
    window.setSize(1200, 800, WebViewHint::WEBVIEW_HINT_NONE);
    window.setHtml(index());

    // Create RpcHub class responsible for communication:
    RpcHub hub{window};

    // highlight-start
    hub.callRemote("remoteFunctionName", nlohmann::json{/*...*/});
    // highlight-end

    window.run();
}
```

#### Frontend
Registering callable functions:
```cpp
#include <nui/frontend/rpc_client.hpp>

void foo()
{
    Nui::RpcClient::registerFunction("someCallable", [](Nui::val val){
        // ...
    });

    Nui::RpcClient::registerFunction("someCallable2", [](std::string const& param){
        // ...
    });

    // Useful RAII unregister (also available in backend):
    {
        auto unregisterWhenThisFallsOutOfScope =
            Nui::RpcClient::autoRegisterFunction("asdf", [](){});
    } // asdf no longer exists here.

    // Removing callable:
    Nui::RpcClient::unregisterFunction("someCallable");
}
```

Calling backend functions:
```cpp
#include <nui/frontend/rpc_client.hpp>

struct InterchangeObject
{
    std::string bla;
    int f;
};
BOOST_DESCRIBE_STRUCT(
    InterchangeObject,
    (),
    (bla, f)
);

void foo()
{
    // When the called function shall receive a responseId as first argument.
    // This allows the backend to reply by calling the passed callback.
    Nui::RpcClient::getRemoteCallableWithBackChannel(
        "backendFunctionName", [](InterchangeObject&& obj /* or a Nui::val */){
            // ...
        }
    )("parameter 1", 232);

    // Trivial case, where the backend is not able to reply here:
    Nui::RpcClient::getRemoteCallable("functionName")("parameter 1", true);
    Nui::RpcClient::getRemoteCallable("functionName2")(Nui::val{});
}
```

## RPC Plugins

### File Dialogs
`RpcHub::enableFileDialogs`: Enable file dialogs to pick files on the system.

Example:
```cpp
#include <nui/frontend/filesystem/file_dialog.hpp>

void foo()
{
    Nui::FileDialog::showOpenDialog({
        // all are optional
        .title = "Open something please",
        /*
         * ~ Linux: home. Windows: home
         * %userprofile% Linux: home. Windows: home
         * %appdata% Linux: home. Windows: CSIDL_APPDATA
         * %localappdata% Linux: home. Windows: CSIDL_APPDATA_LOCAL
         * %temp% Linux: /tmp. Windows: ${USER}\AppData\Local\Temp
         */
        .defaultPath = "%userprofile%",
        .filters = {
            {.name = "Images", .masks = {".jpg", ".png"}},
        },
        .forcePath = false,
        .allowMultiSelect = false
    }, [](std::optional<std::vector<std::filesystem::path>> results){
        if (!results) // The dialog was closed without selecting a file
            return;
        if (results->empty()) // nothing was selected, but the dialog was closed with ok.
            return;
        // ...
    });

    // Same, but does not allow for multiselect:
    // showDirectoryDialog()

    // additionally has forceOverwrite option, which disables any warnings about existing files.
    // showSaveDialog()
}
```

### Async Files
`RpcHub::enableFile`: A way to open/read/write files in the frontend from the system. It is recommended to do file reads and writes in the backend/main process entirely and wrapping them in a function call.

Example - The usage experience is a bit suboptimal due to everything being done through callbacks.
Prefer moving all file related operations to the backend process.
```cpp
#include <nui/filesystem/file.hpp>

void foo()
{
    openFile("/home/user/bla.txt", std::ios_base::read, [](std::optional<AsyncFile>&& file) {
        if (!file)
            return;

        // file provides the following functions, all are asynchronous through a callback:
        // file->tellg([](int32_t){});
        // file->tellp([](int32_t){});
        // file->seekg(int32_t pos, [](){}, std::ios_base::beg);
        // file->seekp(int32_t pos, [](){}, std::ios_base::beg);

        // file->read(int32_t size, [](std::string&&){});
        // file->readAll([](std::string&&){});
        // file->write(std::string data, [](){});
    });
}
```

### Window Functions
`RpcHub::enableWindowFunctions`: Allow frontend to use the Window class.

Example:
```cpp
#include <nui/frontend/window.hpp>

void foo()
{
    Window wnd;

    wnd.setTitle("title");
    wnd.setSize(200, 300);
    wnd.navigate("https://www.github.com");
    // Might not work on some systems, which is an external bug
    wnd.openDevTools();
    wnd.setPosition(0, 0);
    wnd.centerOnPrimaryDisplay();
    wnd.terminate();
}
```

### Barebones Fetch
`RpcHub::enableFetch`: Enables an alternative barebones fetch implementation for the frontend, because standard fetch requires `async`.

Can be used in the frontend, if enabled, like this:
```cpp
#include <nui/frontend/api/fetch.hpp>

Nui::fetch("www.bla.org", {
    // all of these have defaults and can be omitted
    .method = "GET",
    .headers = {
        {"Accept-Encoding", "*"}
    },
    .body = "",
    .followRedirects = false,
    .maxRedirects = 255,
    .autoReferer = false,
    // Dont auto decode base64 or other understood encodings:
    .dontDecodeBody = false,
    // For HTTPS:
    .verifyPeer = true,
    .verifyHost = true
})
```
If you need more than this, you need to implement your own networking functions and make them available.

### Throttle
`RpcHub::enableThrottle`: Enables a throttle function.

Example:
```cpp
#include <nui/frontend/api/throttle.hpp>

Nui::ThrottledFunction throttled;

void foo() {
    throttle(
        200 /*ms*/,
        [](){
            std::cout << "Not printed faster than 200ms after the last call.";
        },
        // Called when the throttled function is prepared and ready for use:
        [&throttled](Nui::ThrottledFunction&& throttledFunc){
            throttled = std::move(throttledFunc);
        },
        false /* call when ready, if it was not ready during the wait period */
    );
}

void bar() {
    throttled();
    // does nothing, because it cannot be called within 200ms.
    // unless callWhenReady is true, then it is called again after 200ms
    throttled();
}
```

### Timer
`RpcHub::enableTimer`: Enables the timer functions

Example
```cpp
#include <nui/frontend/api/timer.hpp>

Nui::TimerHandle timer;

void foo()
{
    Nui::setInterval(
        500 /*ms*/,
        // Called every 500ms
        [](){std::cout << "Hello!\n";},
        [&timer](Nui::TimerHandle&& t){
            // Timer is ready and you get access over it here:
            timer = std::move(t);
        }
    );
}

void stopTimer()
{
    if (timer.hasActiveTimer())
        timer.stop();
}
```

### Screen
`RpcHub::enableScreen`: Enables access to screen size and positioning functions.

Example
```cpp
#include <nui/frontend/screen.hpp>

void foo()
{
    Nui::Screen::getDisplays([](std::vector<Nui::Display>&& displays){
        for (auto const& display : displays) {
            std::cout << display.x() << "\n";
            std::cout << display.y() << "\n";
            std::cout << display.width() << "\n";
            std::cout << display.height() << "\n";
            std::cout << display.isPrimary() << "\n";
            std::cout << display.deviceName() << "\n";
        }
    });

    Nui::Screen::getPrimaryDisplay([](Nui::Display&& primary){
        // ...
    });
}
```

### Environment Variables
`RpcHub::enableEnvironmentVariables`: Enables access to environment variables.

Example
```cpp
#include <nui/frontend/environment_variables.hpp>

void foo()
{
    Nui::getEnvironmentVariables([](std::unordered_map<std::string, std::string>&& variables){
        // ...
    })
}
```