                                __           
      ___ ___     ___   _ __   /\_\    ____  
    /' __` __`\  / __`\/\`'__\ \/\ \  /',__\ 
    /\ \/\ \/\ \/\ \L\ \ \ \/__ \ \ \/\__, `\
    \ \_\ \_\ \_\ \____/\ \_\\_\_\ \ \/\____/
     \/_/\/_/\/_/\/___/  \/_//_/\ \_\ \/___/ 
                               \ \____/      
                                \/___/       

[mor.js][] is a pure JavaScript library for encoding/decoding [Morse code][]
messages.

## Standard Usage

``` javascript
morjs.decode([data|message][, callback(error, result)])
morjs.encode([data|message][, callback(error, result)])
```

### First Argument

[mor.js][] allows either a `data` object or string `message` to be passed as the
first argument. If a string is used all options will use their default value;
otherwise they can be set using the following properties;

* `message` - The message to be decoded/encoded.
* `[mode]` - *Optional:* The mode to be used to decode/encode the message
  (defaults to `"classic"`).

## Customization

``` javascript
morjs.defineChar(character, pattern[, callback(error)])
morjs.defineMode(name, characters[, callback(error)])
```

## Miscellaneous

``` javascript
morjs.chars([callback(error, chars)])
morjs.modes([callback(error, modes)])
morjs.noConflict([callback(error)])
morjs.VERSION
```

## Bugs

If you have any problems with this library or would like to see the changes
currently in development you can do so here;

https://github.com/neocotic/mor.js/issues

Developers should run all tests in `test/index.html` and ensure they pass before
submitting a pull request.

## Questions?

Take a look at `docs/mor.html` to get a better understanding of what the code is
doing.

If that doesn't help, feel free to follow me on Twitter, [@neocotic][].

However, if you want more information or examples of using this library please
visit the project's homepage;

http://neocotic.com/mor.js

[@neocotic]: https://twitter.com/#!/neocotic
[mor.js]: http://neocotic.com/mor.js
[morse code]: http://en.wikipedia.org/wiki/Morse_code