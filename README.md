# Framer CLI

> Providing most of the functionality of Framer Studio, but from the comfort of
> your terminal.

Framer CLI is in its infancy, but the aim is to create a decent way to build
quick prototypes/dynamic layouts in code from the editor of your choice. The
current implementation of this tool requires [Node][1] to be installed.

## Who is this for?

This is not a replacement to [Framer Studio][2] and is best suited for those
who are comfortable with Framer's API and using the command line.

## Features

- CoffeeScript compilation. It will handle CoffeeScript files, JavaScript files,
or a mix of the two.
- Local server for previewing/debugging. Visit
[http://localhost:3000](http://localhost:3000) in your browser.
- Handles true [Node-style modules][3]. Place any code, assets, etc. that you
want in the `modules` folder and `require` them in your main `app.coffee` file.
See the `/modules/myModule` example for reference.
- Live reloading when any of the files in your dependency tree change.
- **WIP:** Intelligent completions that are scoped appropriately. This uses
[Tern][4] and requires using an editor with a [Tern plugin][5].
- A build command for sharing the project. Just `$ make build` and open
`index.html` in your browser (also is accessible on any static file server).

## Instructions

**NOTE:** Requires [Node][1].

1. `$ git clone https://github.com/peteschaffner/framercli.git myProject`
2. `$ cd myProject`
3. `$ make` (spin up server and design)
4. `$ make build` (build for distribution)

[1]: https://nodejs.org/
[2]: http://framerjs.com/
[3]: https://nodejs.org/api/modules.html#modules_folders_as_modules
[4]: http://ternjs.net/
[5]: http://ternjs.net/#plugins
