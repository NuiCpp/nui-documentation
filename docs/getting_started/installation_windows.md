---
toc_min_heading_level: 2
---

# Installation on Windows

On Windows you have several options to work with Nui:
- [Visual Studio](#using-visual-studio-2022) users can use Visual Studio with CMake and Clang.
- [msys2](#using-msys2) can be used together with the IDE of your choice, like
  - [Visual Studio Code](#using-visual-studio-code)

## Using Visual Studio 2022

### Install python3

Download and Install python3: https://www.python.org/downloads/
Make sure that the python executeable is in PATH

![Python3InstallWindow](/img/visual_studio/python3.jpg)

### Install nodejs and npm

Using nvm is the most practical way to install node and npm https://github.com/coreybutler/nvm-windows/releases.
:::caution

If you have already have node installed, uninstall it first before using nvm.

:::
- Open cmd and install the latest or LTS version with `nvm install latest`
- Activate the version using `nvm use VERSION_HERE` for example `nvm use latest`.

### Install Visual Studio Packages

Make sure that you have installed the following components for Visual Studio using the official Visual Studio Installer:
- vcpkg package manager
- C++ CMake tools for Windows
- C++ Clang tools for Windows (<- not automatically included in the Desktop development with C++ Workload setting)
- git for Windows (If you dont have it installed already)

Nui only supports clang and requires clang for WASM compilation.
MSVC and gcc are not supported.

### Using the Template

1. Create a new repository based on the nui template, or clone the template source directly, available here: https://github.com/NuiCpp/nui-template
This will provide you with a minimal baseline project to use nui with.

2. Open the manually cloned directory in Visual Studio or clone using Visual Studio.

![img alt](/img/visual_studio/clone.jpg)

3. Setup vcpkg

Open a terminal from within Visual Studio:

![img alt](/img/visual_studio/open_terminal.jpg)

Enter `vcpkg integrate install`

![img alt](/img/visual_studio/vcpkg_integrate.jpg)

4. Copy the displayed path to the toolchain file and enter the CMake settings view via Project->"CMake Settings for ..."

![img alt](/img/visual_studio/cmake_settings.jpg)

5. Set the copied toolchain file path

![img alt](/img/visual_studio/toolchain_file.jpg)

6. Also Switch to the clang_cl toolset and save. If the toolset is missing, install it using the Visual Studio Installer.

![img alt](/img/visual_studio/toolset_clang.jpg)

7. Delete the cache and reconfigure

![img alt](/img/visual_studio/reconfigure.jpg)

It can take some time for the dependencies to install.

## Using msys2

This tutorial shows you how to build using the msys2 tools.

### Install msys2 if you dont have it installed

Follow the installation instructions here: https://www.msys2.org/
Make sure to update after the initial installation using `pacman -Syu`.

After installation navigate to your msys2 installation and open the clang64 environment terminal.

![img alt](/img/msys2_setup/msys2_dir.jpg)

This terminal should open:

![img alt](/img/msys2_setup/clang64_terminal.jpg)

Install the follwing packages with pacman:
```bash
pacman -S \ 
	unzip \
	mingw-w64-clang-x86_64-cmake \
	mingw-w64-clang-x86_64-ninja \
	mingw-w64-clang-x86_64-clang \
	mingw-w64-clang-x86_64-boost \
	mingw-w64-clang-x86_64-curl \
	mingw-w64-clang-x86_64-crypto++ \
	mingw-w64-clang-x86_64-openssl \
	mingw-w64-clang-x86_64-python \
	mingw-w64-clang-x86_64-gdb
```

### Install nodejs and npm

- Paste one of the curl/wget commands into your msys2 clang64 terminal: https://github.com/nvm-sh/nvm#installing-and-updating
This will install nvm for msys2.
- Now restart your terminal.
- List versions using `nvm ls-remote`
- Pick a version, either newest or the Latest LTS.
- Install that version using `nvm install VERSION_HERE` for example `nvm install 20.2.0`
- Activate the version using `nvm use VERSION_HERE` for example `nvm use 20.2.0`

The activated versions persits through all terminal instances.

### Setup your project

Install git in the msys2 terminal using `pacman -S git`

### Building your first project

(You can skip this part and go straight to [Visual Studio Code](#using-visual-studio-code) if you use this IDE)

1. Navigate to a directory of your choice within the msys2 clang64 environment terminal, the default path the msys2 terminal is in, is the msys2 home directory located in your msys2 installation.

:::info

msys2 paths to your drives are written like `/C/msys64` instead of `C:/msys64`.

:::

2. Create a new repository based on the nui template, or clone the template source directly, available here: https://github.com/NuiCpp/nui-template
This will provide you with a minimal baseline project to use nui with.
`git clone https://github.com/NuiCpp/nui-template.git`

3. Navigate into the project clone: `cd nui-template` (or what your fork is called)

4. Create a build directory (I recommend a seperate debug and release dir): `mkdir -p build/clang_debug`
Navigate to that directory: `cd build/clang_debug`

5. Configure using cmake: `cmake ../.. -G"Ninja" -DCMAKE_BUILD_TYPE=Debug`
You can also use the `-G"MSYS Makefiles"` generator, but this is strongly discouraged, because emscripten can not be parallelized using make on windows making builds several magnitudes slower.

:::info

Make sure you have installed `mingw-w64-clang-x86_64-ninja` not simply `ninja` and are operating from a 
msys2 clang64 environment terminal.

:::

6. Build using `cmake --build .`

7. Your application is now in `build/clang_debug/bin/nui-template.exe`

### Using msys2 with the Windows Terminal
Here is a tutorial: https://www.msys2.org/docs/terminals/

## Using Visual Studio Code

First setup msys2 as [explained above](#using-msys2)

### Setup msys2 Terminal in Visual Studio Code

First add these lines to your settings.json to integrate the msys2 terminal into
visual studio.
To access the user settings.json press `Ctrl+Shift+P` and enter `settings.json` and chose the User settings option:

![img alt](/img/vscode/settings_json.jpg)

```json
{
    "terminal.integrated.profiles.windows": {
        "msys2 CLANG64": {
            "path": "cmd.exe",
            "args": [
                "/c",
                // Change the path here to your installation!
                "C:\\msys64\\msys2_shell.cmd -defterm -here -no-start -clang64"
            ]
        }
    },
    // If you want it as your default terminal:
    // "terminal.integrated.defaultProfile.windows": "msys2 CLANG64"
}
```

### Install Native Debug Plugin

The shipped `cppdbg` has not worked well with msys2 as of the time of this writing.
This is why installing the Native Debug plugin is recommended:

![img alt](/img/vscode/native_debug.jpg)

### Setting Up Your First Project

Open a msys2 Terminal from within Visual Studio Code.

![img alt](/img/vscode/open_terminal.jpg)

A terminal now opens at the bottom of vscode

![img alt](/img/vscode/terminal.jpg)

If you didnt set up the msys2 terminal as the default [in the previous step](#setup-msys2-terminal-in-visual-studio-code), you have to open an msys2 clang64 terminal.
You will see the CLANG64 text as outlined in the above image by the red box.

You can navigate to a directory of your chosing and clone your fork of the nui-template or clone the nui-template directly if you dont want to setup a git project: `git clone https://github.com/NuiCpp/nui-template.git`

Open the checked out project/directory in Visual Studio Code.

### Creating Your Run Configuration

Now that you have opened your project, create a launch configuration in Visual Studio Code.
Go onto the run and debug tab and click on the "create a launch.json file" link.

![img alt](/img/vscode/create_launch_json.jpg)

A window will open at the top with several options.
Pick the GDB option provided by the Native Debug plugin.

![img alt](/img/vscode/pick_gdb.jpg)

The launch.json will now open with a preset.
Change/Adapt the contents to the following:

```json
// Use IntelliSense to learn about possible attributes.
// Hover to view descriptions of existing attributes.
// For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
"version": "0.2.0",
"configurations": [
    {
        "name": "Debug",
        "type": "gdb",
        "request": "launch",
        // If you change the name of your project/application, you need to change the executeable name here too:
        "target": "${workspaceRoot}/build/clang_debug/bin/nui-template.exe",
        "cwd": "${workspaceRoot}",
        // Adapt the path to your point to your msys2 installation.
        // Use the gdb from the clang64 environment installed by mingw-w64-clang-x86_64-gdb
        // NOT the globally available package gdb, because that one is far older.
        "gdbpath": "C:/msys64/clang64/bin/gdb.exe",
        "valuesFormatting": "parseText",
        "preLaunchTask": "build_debug"
    }
]
```
The launch configuration already defines a preLaunchTask, which does not yet exist.
Create a `tasks.json` in the .vscode directory of your project. This file will be next to the `launch.json`.
Fill the `tasks.json` with the following content, which will allow you to build within msys2's environment.
Dont forget to change the bash executeable path to point to your msys2 installation.

```json
{
    "version": "2.0.0",
    "options": {
        "cwd": "${workspaceFolder}",
        "env": {
            "MSYSTEM": "CLANG64",
            "CHERE_INVOKING": "1"
        },
        "shell": {
            // Modify this path to match your msys2 installation
            "executable": "C:\\msys64\\usr\\bin\\bash.exe",
            "args": [
                "--login", "-i", "-c"
            ]
        }
    },
    "tasks": [
        {
            "label": "configure_debug",
            "command": "cmake",
            "args": [
                "-D",
                "CMAKE_BUILD_TYPE=Debug",
                "-D",
                "CMAKE_COLOR_DIAGNOSTICS=ON",
                "-G",
                "\"Ninja\"",
                "-B",
                "build/clang_debug",
                "-S",
                "."
            ],
            "type": "shell",
        },
        {
            "label": "build_debug",
            "command": "cmake",
            "dependsOn": "configure_debug",
            "type": "shell",
            "args": [
                "--build",
                "build/clang_debug"
            ],
            "presentation": {
                "reveal": "always"
            },
            "group": "build"
        }
    ]
}
```

You can now build and run your application using the green arrow in the build and run tab or by pressing F5.

## Troubleshooting

### Call to async_teardown is ambiguous
There currently is a bug in boost beast that causes this error to appear in builds.
https://github.com/boostorg/beast/pull/2683

Until this issue is fixed, a manual patching of boost::beasts affected header is necessary.
The `template<class AsyncStream, BOOST_BEAST_ASYNC_TPARAM1 TeardownHandler>`
lines in `ssl_stream.hpp` need to be changed to
`template<class AsyncStream, typename TeardownHandler>`

### Error: could not find git for clone of nui in FetchContent

CMake cannot find git in your PATH environment. 
For Visual Studio install git either using the Visual Studio Installer, or manually via the offical website.
In the msys2 case, install git via the commandline.

### Could not find boost / curl / etc

If you are using Visual Studio, you did not setup vcpkg correctly. Retrace the steps outlined above ([Install vcpkg](#install-visual-studio-packages)), alternatively install vcpkg manually: https://vcpkg.io/en/getting-started.html

If you are using msys2, [install the correct packages](#install-msys2-if-you-dont-have-it-installed) for the clang64 subsystem. 

### Other

- Make sure that there is no other clang in the PATH. Visual Studio uses the first clang it finds it your PATH environment variable which can cause weird behaviour.




