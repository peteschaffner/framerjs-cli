# Framer CLI

> Providing most of the functionality of Framer Studio, but from the comfort of
> your terminal.

Framer CLI is in its infancy, but the aim is to create a decent way to build
quick prototypes/dynamic layouts in code from the editor of your choice. The
current implementation of this tool requires [Node][1] to be installed.

## Features

- CoffeeScript compilation. It will handle CoffeeScript files, JavaScript files,
or a mix of the two.
- Local server for previewing/debugging. Visit http://localhost:3000 in your
browser.
- Handles true [Node-style modules][2]. Place any code, assets, etc. that you
want in this folder and `require` them in your main `app.coffee` file. See the
`/modules/myModule` example for reference.
- Live reloading when any of the files in your dependency tree change.
- *WIP:* Intelligent completions that are scoped appropriately. This uses
[Tern][3] and requires using an editor with a [Tern plugin][4].
- A build command for sharing the project. Just `$ make build` and open
`index.html` in your browser (also is accessible on any static file server).

## Instructions

[1]: https://nodejs.org/
[2]: https://nodejs.org/api/modules.html#modules_folders_as_modules
[3]: http://ternjs.net/
[4]: http://ternjs.net/#plugins
