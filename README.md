# Embed Code File (Obsidian Plugin)

This plugin allows to embed code files from Obsidian vault. It works better with live preview feature of Obsidian.

## Settings

The plugin include multiple language by default (`c,cpp,java,python,go,ruby,shell`). You can include any needed language to the comma separated list.

## How to use

First you need to activate the plugin from Community Plugins. Then you can embed the code as follow:

````yaml
```embed-<some-language>
PATH: "<some-path-to-code-file>"
LINES: "<some-line-number>,<other-number>,...,<some-range>"
TITLE: "<some-title>"
```
````

Examples:

````yaml
```embed-cpp
PATH: "Code/main.cpp"
LINES: "2,9,30-40,100-122,150"
TITLE: "Some title"
```
````

where `PATH`, `LINES` and `TITLE` properties are set as YAML key-value pairs:

* The `PATH` should be a code file in the vault.

* The `LINES` will include only the specified lines of the code file. Every set of included lines either range or explicit line will append dots (`...`) to included line in a newline. If you want to get rid of dots, minimize the number of sets by using one range as much as you can.

* If `TITLE` is not set, then the title of the code block will be `PATH` value.

You can use also `TITLE` with normal code block (without `embed-`), but make sure that the title value is set with double quotes:

````cpp
```cpp TITLE: "Some title"
// some code
...
```
````

Using live preview feature will enhance the embedding experience.

## Demo

#### Embed code file
![Gif](/demo/embed-code-file.gif)

#### Embed lines from code file
![Gif](/demo/embed-code-file-lines.gif)

#### Add title to normal code block
![Gif](/demo/normal-code-block-title.gif)
