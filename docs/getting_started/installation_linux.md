# Installation on Linux

- Install the following things. The package names will vary between different distributions.
  - webkit2gtk-4.0
  - gtk+-3.0
  - clang
  - cmake
  - ninja
  - make
  - git
  - python3
  - nodejs
  - openssl library
  - crypto++ library
  - boost 
  - libcurl

## Using the Template

1. Navigate to a directory of your choice and create a new repository based on the nui template, or clone the template source directly, available here: https://github.com/NuiCpp/nui-template
This will provide you with a minimal baseline project to use nui with.
`git clone https://github.com/NuiCpp/nui-template.git`

3. Navigate into the project clone: `cd nui-template` (or what your fork is called)

4. Create a build directory (I recommend a seperate debug and release dir): `mkdir -p build/clang_debug`
Navigate to that directory: `cd build/clang_debug`

5. Configure using cmake: `cmake ../.. -G"Ninja" -DCMAKE_BUILD_TYPE=Debug -DCMAKE_C_COMPILER=clang -DCMAKE_CXX_COMPILER=clang++`

6. Build using `cmake --build .`

7. Your application is now in `build/clang_debug/bin/nui-template.exe`

## Visual Studio Code

1. Download the template as [outline above](#using-the-template) and open the directory with Visual Studio Code.

2. Create a launch.json configuration:

![img alt](/img/vscode/create_launch_json.jpg)

The configuration should look something like this:

```json
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "type": "cppdbg",
            "request": "launch",
            "name": "Launch Program",
            "program": "${workspaceFolder}/build/clang_debug/bin/nui-template",
            "cwd": "${workspaceFolder}",
            "preLaunchTask": "build_debug"
        }
    ]
}
```

The launch configuration already defines a preLaunchTask, which does not yet exist.
Create a `tasks.json` in the .vscode directory of your project. This file will be next to the `launch.json`.
Fill the `tasks.json` with the following content:

```json
{
    "version": "2.0.0",
    "options": {
        "cwd": "${workspaceFolder}"
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
                "-D",
                "CMAKE_C_COMPILER=clang",
                "-D",
                "CMAKE_CXX_COMPILER=clang++",
                "-G",
                "\"Unix Makefiles\"",
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
