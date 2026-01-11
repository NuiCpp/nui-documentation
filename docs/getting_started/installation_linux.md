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

<details>
<summary>Ubuntu 22.04</summary>
<p>

Packages:
```sh
sudo apt install \
libwebkit2gtk-4.0-dev \
libcurl4-openssl-dev \
libcrypto++-dev \
ninja-build \
make \
cmake \
git \
libstdc++-11-dev \
python3 \
libgtk-3-dev
```

Clang:
You can either install 'clang' as a package, or get a new clang from official llvm apt repos:
https://apt.llvm.org/
```sh
wget https://apt.llvm.org/llvm.sh
chmod +x llvm.sh
# version 16 or other:
sudo ./llvm.sh 16
```

Boost:
Ubuntus Boost package is ancient, you will have to pull and build it manually: https://www.boost.org/
For example:
```sh
mkdir boost && cd boost
wget -O boost.tar.gz https://boostorg.jfrog.io/artifactory/main/release/1.83.0/source/boost_1_83_0.tar.gz
tar -xzf boost.tar.gz --strip-components=1

# Or a different prefix:
./bootstrap.sh --prefix=/usr/local
sudo ./b2 --prefix=/usr/local install
```

Node:
https://github.com/nvm-sh/nvm
```sh
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
nvm install node
```

</p>
</details>

<details>
<summary>Arch Linux</summary>
<p>

Packages:
```sh
sudo pacman -S \
webkit2gtk \
gtk3 \
clang \
cmake \
ninja \
make \
git \
python \
openssl \
crypto++ \
boost \
curl
```

Node:
Either via package manager:
```sh
sudo pacman -S nodejs
```

Or via version manager:
https://github.com/nvm-sh/nvm
```sh
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
nvm install node
```

</p>
</details>

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
