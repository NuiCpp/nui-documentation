# Window Class

The window class creates a window and loads content into it.
It also handles communication between the window and the application together with RpcHub.

## Multi Window Support
This already works, but the build system needs adjustment to make it easier to build additional index.html files
for the additional windows.

```cpp
#include <nui/backend/window.hpp>

int main()
{
    Nui::Window wnd1{};
    std::unique_ptr<Nui::Window> wnd2{};

    wnd.bind("myFunction", [&wnd2](nlohmann::json const&) {
        wnd2 = std::make_unique<Nui::Window>();
        wnd2->setSize(800, 600);
        wnd2->setHtml("<html><body><h1>Hello World!</h1></body></html>");
    });

    wnd.run();
}
```

## Reference

### Window::Window(WindowOptions const& options)
Creates a window with the given options.

```cpp
#include <nui/backend/window.hpp>

int main()
{
    Nui::Window wnd{{
        .title = "My Window",
        .debug = true, // May the user open the dev tools?
    }};
}
```

### Window::setTitle(std::string const& title)
Sets the title of the window.

```cpp
#include <nui/backend/window.hpp>

int main()
{
    Nui::Window wnd{};

    wnd.setTitle("My New Title");
}
```

### Window::setSize(int width, int height, WebViewHint hint = WebViewHint::WEBVIEW_HINT_NONE)
Sets the size of the window.

```cpp
#include <nui/backend/window.hpp>

int main()
{
    Nui::Window wnd{};

    wnd.setSize(800, 600);
}
```

### Window::setPosition(int x, int y, bool useFrameOrigin = true)
Sets the position of the window.
useFrameOrigin on macos uses "setFrameOrigin" instead of "setFrameTopLeftPoint", which is consistent with linux and windows.

```cpp
#include <nui/backend/window.hpp>

int main()
{
    Nui::Window wnd{};

    wnd.setPosition(100, 100);
}
```

### Window::centerOnPrimaryDisplay()
Centers the window on the primary display.

```cpp
#include <nui/backend/window.hpp>

int main()
{
    Nui::Window wnd{};

    wnd.centerOnPrimaryDisplay();
}
```

### Window::navigate(std::string const& url)
Navigates the window to the given url.

```cpp
#include <nui/backend/window.hpp>

int main()
{
    Nui::Window wnd{};

    wnd.navigate("https://google.com");
}
```

### Window::navigate(std::filesystem::path const& file)
Opens a file from disk.

```cpp
#include <nui/backend/window.hpp>

int main()
{
    Nui::Window wnd{};

    wnd.navigate("/home/user/http/index.html");
}
```

### Window::terminate()
Closes the window.

```cpp
#include <nui/backend/window.hpp>

int main()
{
    Nui::Window wnd{};

    wnd.run();

    // Somewhere else in the code
    wnd.terminate();
}
```

### Window::bind(std::string const& name, std::function<void(nlohmann::json const&)> const& callback)
Bind a function into the web context. These will be available under globalThis.nui_rpc.backend.NAME
Prefer to use the RpcHub instead.

```cpp
#include <nui/backend/window.hpp>

int main()
{
    Nui::Window wnd{};

    wnd.bind("myFunction", [](nlohmann::json const& args) {
        std::cout << "myFunction called with args: " << args.dump() << std::endl;
    });
}
```

### Window::unbind(std::string const& name)
Unbinds a function from the web context.

```cpp
#include <nui/backend/window.hpp>

int main()
{
    Nui::Window wnd{};

    // previously wnd.bind("myFunction", ...);
    wnd.unbind("myFunction");
}
```

### Window::getExecutor()
Returns the executor of the window.

```cpp
#include <nui/backend/window.hpp>

#include <boost/asio/post.hpp>

int main()
{
    Nui::Window wnd{};

    auto executor = wnd.getExecutor();
    boost::asio::post(executor, [] {
        std::cout << "Hello from the executor!" << std::endl;
    });
}
```

### Window::run()
Runs / Shows the window.

```cpp
#include <nui/backend/window.hpp>

int main()
{
    Nui::Window wnd{};

    wnd.run();
}
```

### Window::setHtml(std::string_view html, bool fromFilesystem = false)
Sets the html of the window.
When "fromFilesystem" is true, the file is dumped to a temporary file and loaded from there.

```cpp
#include <nui/backend/window.hpp>

int main()
{
    Nui::Window wnd{};

    wnd.setHtml("<html><body><h1>Hello World!</h1></body></html>");
}
```

### Window::eval(std::string const& code)
Evaluates the given code in the web context.

```cpp
#include <nui/backend/window.hpp>

int main()
{
    Nui::Window wnd{};

    // setHtml, run etc...

    wnd.eval("console.log('Hello from the web context!')");
}
```

### Window::eval(std::filesystem::path const& file)
Evaluates the given file in the web context.

```cpp
#include <nui/backend/window.hpp>

int main()
{
    Nui::Window wnd{};

    // setHtml, run etc...

    wnd.eval("/home/user/http/index.js");
}
```

### Window::init(std::string const& code)
Places javascript in the window.

### Window::init(std::filesystem::path const& file)
Places javascript in the window from a file.

### void* Window::getNativeWindow()
Returns a pointer to the native window.
`HWND` on windows.
`GtkWindow*` on linux.
`id` on macos.

### void* Window::getNativeWebView()
Returns a pointer to the native webview.
cast to `ICoreWebView2*` on windows.
cast using `WEBKIT_WEB_VIEW(getNativeWebView())` on linux.
And its an `id` on macos.

### Window::setConsoleOutput(bool enabled)
Enables or disables console output from the webview on linux systems.