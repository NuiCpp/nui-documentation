# CMake of Nui

Nui comes with some powerful CMake functions to configure your project.
Nui is designed in such a way that the browser/emscripten/frontend part is build as an [ExternalProject](https://cmake.org/cmake/help/latest/module/ExternalProject.html).
This makes it so that you only have to trigger one build command to build everything as a single package.
The ExternalProject is the entire project fed back into itself, but using the emscripten toolchain.
This is why your primary CMakeLists.txt then needs to then differentiate between the frontend and backend parts of your project via the `EMSCRIPTEN` variable.
```cmake
cmake_minimum_required(VERSION 3.XX)

project(TheProjectName)

if (EMSCRIPTEN)
    # Has the frontendMain() and code for the view.
    add_subdirectory("${CMAKE_SOURCE_DIR}/frontend/source/frontend")
else()
    # Has a main() function somewhere and uses the Window class to create a window.
	add_subdirectory("${CMAKE_SOURCE_DIR}/backend/source/backend")
endif()
```

## Frontend CMakeLists.txt
```cmake
target_link_libraries(${PROJECT_NAME} PRIVATE nui-frontend)

nui_prepare_emscripten_target(
    TARGET ${PROJECT_NAME}
    PARCEL_ARGS --no-optimize # Dont pass this in Release builds
    PREJS ${PREJS_FILE}
    EMSCRIPTEN_LINK_OPTIONS
        -sEXPORTED_FUNCTIONS=_frontendMain
        -sALLOW_MEMORY_GROWTH=1
        -fexceptions
        -g
    EMSCRIPTEN_COMPILE_OPTIONS
        -g
    CXX_STANDARD
        20
    OBSERVED_BUNDLE_FILES
        # ...
)
```

The `nui_prepare_emscripten_target` does all the work to build the specified target with emscripten.
It has a number of options that you can use to modify how the target is built.

Flags:
- `NO_INLINE`: Completely disables the nui inline code feature. You normally do not want to disable this, because it also disables some nui features.
- `NO_INLINE_INJECT`: Similar to NO_INLINE, but only disables the injection of the inlined code into the index.html file. The c++ files are still processed for inline code segments.
- `LEAN_INDEX_HTML`: This makes it so that the content is not all inlined into the index.html, but referenced instead. You will need to host the files via a custom scheme. This is considered the better approach for larger projects.

1 Parameter Options:
- `TARGET`: The name of the target to build.
- `PREJS`: This is emscriptens "--pre-js" file. Most projects dont need to worry about this.
- `CXX_STANDARD`: The C++ standard to use for the target.
- `STATIC`: Specifies whether a directory called "static" should be copied to the specified targets build directory. (This legacy feature needs improvement).
- `UNPACKED_MODE`: Keeps wasm and html seperate.

N Parameter Options:
- `PARCEL_ARGS`: Arguments to pass to parcel. --no-optimize is a good option to use in debug builds, because it makes the output more debuggable.
- `NPM_INSTALL_ARGS`: Arguments to pass to npm install.
- `EMSCRIPTEN_LINK_OPTIONS`: Options to pass to the emscripten linker. This is where you can specify the exported functions and other linker options.
- `EMSCRIPTEN_COMPILE_OPTIONS`: Options to pass to the emscripten compiler.
- `OBSERVED_BUNDLE_FILES`: An optional list of files that are observed to trigger rebuilds when they change.

## Backend CMakeLists.txt
```cmake
target_link_libraries(${PROJECT_NAME} PRIVATE nui-backend)

nui_add_emscripten_target(
    TARGET ${PROJECT_NAME}
    PREJS ${PREJS_FILE}
    SOURCE_DIR
        ${CMAKE_SOURCE_DIR}
    CMAKE_OPTIONS
        -DCMAKE_BUILD_TYPE=Release
)
```

The `nui_add_emscripten_target` function creates the ExternalProject and makes sure that the toolchain is set up correctly.
It has a number of options that you can use to modify how this is to be done:

Flags:
- `ENABLE_TAILWIND`: Enables the Tailwind CSS support. This will copy a tailwind.config.js and the .postcssrc file to the build directory. It will also enable dotenv during the build process. All C++ files are then scanned for Tailwind classes.
- `DISABLE_BIN2HPP`: Disables the creation of an index.hpp file. This file is not needed if you host the files via a custom scheme.
- `DISABLE_PARCEL_ADAPTER`: Diables a tool that modifies your package.json for the build using parcel. You will now need to make sure yourself that the parcel build is configured correctly. Which can be useful if you have a different build setup.
- `ENABLE_DOTENV`: Enables the dotenv support. This is forced on with `ENABLE_TAILWIND`.
- `CONFIGURE_ALWAYS`: Always run the configuration step for the ExternalProject. The default behavior is to let CMake decide when to reconfigure the frontend project.

1 Parameter Options:
- `TARGET`: The name of the target to build.
- `PREJS`: This is emscriptens "--pre-js" file. Most projects dont need to worry about this.
- `SOURCE_DIR`: The source directory of the project. The function needs this for technical reasons.
- `BIN2HPP_ENCODING`: The encoding to use for the bin2hpp tool. This is used to convert binary files to C++ header files. The default is "raw". Possible values are "raw", "base64", "gz_base64"

N Parameter Options:
- `CMAKE_OPTIONS`: Options to pass on to the CMake configuration step of the ExternalProject.