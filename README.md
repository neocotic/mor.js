                                __
      ___ ___     ___   _ __   /\_\    ____
    /' __` __`\  / __`\/\`'__\ \/\ \  /',__\
    /\ \/\ \/\ \/\ \L\ \ \ \/__ \ \ \/\__, `\
    \ \_\ \_\ \_\ \____/\ \_\\_\_\ \ \/\____/
     \/_/\/_/\/_/\/___/  \/_//_/\ \_\ \/___/
                               \ \____/
                                \/___/

[mor.js][0] is a pure JavaScript library for encoding/decoding [Morse code][3] messages.

[![Build Status](https://travis-ci.org/neocotic/mor.js.svg?branch=develop)][1]

## Install

Install using the package manager for your desired environment(s):

``` bash
# for node.js:
$ npm install morjs
# OR; for the browser:
$ bower install morjs
```

This library has no dependencies on any other library.

## Standard Usage

``` javascript
morjs.decode(message[, options])
morjs.encode(message[, options])
```

The `message` parameter is that which is to be decoded/encoded and the optional `options` parameter can contain any of
the following options (all of which are optional themselves):

* `mode` - The mode to be used to decode/encode the message (defaults to `"compact"`)

## Extension

``` javascript
morjs.chars
morjs.defaults
morjs.modes
```

## Miscellaneous

``` javascript
morjs.noConflict()
morjs.VERSION
```

## Bugs

If you have any problems with this library or would like to see the changes currently in development you can do so
here;

https://github.com/neocotic/mor.js/issues

See the `CONTRIBUTING.md` document for more details.

## Questions?

Take a look at `docs/mor.html` to get a better understanding of what the code is doing.

If that doesn't help, feel free to follow me on Twitter, [@neocotic][2].

However, if you want more information or examples of using this library please visit the project's homepage;

http://neocotic.com/mor.js

[0]: http://neocotic.com/mor.js
[1]: https://travis-ci.org/neocotic/mor.js
[2]: https://twitter.com/neocotic
[3]: http://en.wikipedia.org/wiki/Morse_code