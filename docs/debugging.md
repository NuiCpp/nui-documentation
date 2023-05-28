# Debugging

Debugging the backend is nothing special as it can be done with gdb or lldb.
Debugging the frontend is more difficult, because debugging support for WASM is currently limited.
There is a debugging plugin for Chrome, but the Windows Edge WebView does not allow for plugins.

There are however some tips and options on the emscripten documentation: 
[Emscripten Debugging](https://emscripten.org/docs/porting/Debugging.html)