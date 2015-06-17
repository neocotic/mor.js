```
                            __
  ___ ___     ___   _ __   /\_\    ____
/' __` __`\  / __`\/\`'__\ \/\ \  /',__\
/\ \/\ \/\ \/\ \L\ \ \ \/__ \ \ \/\__, `\
\ \_\ \_\ \_\ \____/\ \_\\_\_\ \ \/\____/
 \/_/\/_/\/_/\/___/  \/_//_/\ \_\ \/___/
                           \ \____/
                            \/___/
```

[mor.js][0] is a pure JavaScript library for encoding/decoding [Morse code][3] messages that supports extensible
characters and encoding output.

[![Build Status](https://img.shields.io/codeship/af89a730-f72d-0132-2d2a-2ab52ec32728/develop.svg?style=flat-square)][1]
[![Dependency Status](https://img.shields.io/david/neocotic/mor.js.svg?style=flat-square)][4]
[![Dev Dependency Status](https://img.shields.io/david/dev/neocotic/mor.js.svg?style=flat-square)][5]
[![License](https://img.shields.io/github/license/neocotic/mor.js.svg?style=flat-square)][10]
[![Release](https://img.shields.io/github/tag/neocotic/mor.js.svg?style=flat-square)][5]

## Install

Install using the package manager for your desired environment(s):

``` bash
# for node.js:
$ npm install morjs
# OR; for the browser:
$ bower install morjs
```

## Usage

The API has been completely redesigned to simplify encoding and decoding Morse code messages by simply passing a
string to the `encode` and `decode` functions respectively.

It's important to note that some characters are encoded to the same Morse code sequence (mainly outside of the normal
alphabet). This also means that, when decoding such messages, the original character is not guaranteed to be matched
unless it's the first using that sequence. This is not a limitation of this library but of the Morse code language
itself which did not guarantee uniqueness.

Both of which also accept an optional `options` parameter which can currently contain the following (all of which are
optional themselves):

| Option | Description                                  | Default      |
| ------ | -------------------------------------------- | ------------ |
| mode   | Mode to be used to encode/decode the message | `"comptact"` |

### `encode(message[, options])`

Encodes the `message` parameter using the Morse code.

``` javascript
morjs.encode('SOS', {mode: 'simple'});
//=> "... --- ..."
```

### `decode(message[, options])`

Decodes the encoded Morse code `message` parameter.

``` javascript
morjs.decode('... --- ...', {mode: 'simple'});
//=> "SOS"
```

### Customization

#### `defaults`

This is a hash of default values to be applied to the optional `options` parameter and exposed to allow you to override
any of them.

``` javascript
morjs.defaults.mode = 'simple';

morjs.encode('SOS');
//=> "... --- ..."
```

#### `chars`

A simple map of Unicode characters and their corresponding patterns, which are used when encoding and decoding
messages. A pattern is a series of `"S"` and `"L"` characters representing *short* and *long* respectively.

The characters are too many to list here but you can find them easily in the source code or when inspecting this value.

Adding support for a new character couldn't be easier. In the following example support for the lambda character is
added using a made-up pattern:

``` javascript
morjs.chars['\u039B'] = 'LLLLLSSSSS';

morjs.encode('\u039B', {mode: 'simple'});
//=> "-----....."
```

#### `modes`

Modes are key to parsing both encoded and decoded messages as they contain strings used to find and replace patterns in
the message. Some of these strings are used to build regular expressions, so it's recommended to familiarized yourself
with the usage of modes before creating any custom ones, just so you know on which you need to escape any `RegExp`
special characters.

Here's a list of the built in modes:

- classic
- classicEntities
- compact (default)
- compactEntities
- simple

Adding a new mode is as simple as the following:

``` javascript
morjs.modes.foo = {
  charSpacer:   '',
  letterSpacer: ' ',
  longString:   'F',
  shortString:  'O',
  wordSpacer:   '   '
};

var options = {mode: 'foo'};

morjs.encode('SOS', options);
//=> "OOO FFF OOO"
morjs.decode('OOO FFF OOO', options);
//=> "SOS"
```

### Miscellaneous

#### `noConflict()`

Returns `morjs` in a no-conflict state, reallocating the `morjs` global variable name to its previous owner, where
possible.

This is really just intended for use within a browser.

``` html
<script src="/path/to/conflict-lib.js"></script>
<script src="/path/to/mor.min.js"></script>
<script>
  var morjsNC = morjs.noConflict();
  // Conflicting lib works again and use morjsNC for this library onwards...
</script>
```

#### `VERSION`

The current version of `morjs`.

``` javascript
morjs.VERSION;
//=> "1.1.0"
```

## Bugs

If you have any problems with this library or would like to see changes currently in development you can do so
[here][7].

## Contributors

If you want to contribute, you're a legend! Information on how you can do so can be found in [CONTRIBUTING.md][9]. We
want your suggestions and pull requests!

A list of [mor.js][0] contributors can be found in [AUTHORS.md][8].

## License

Copyright (c) 2014 Alasdair Mercer

See [LICENSE.md][10] for more information on our MIT license.

[0]: http://neocotic.com/mor.js
[1]: https://codeship.com/projects/86278
[2]: https://twitter.com/neocotic
[3]: https://en.wikipedia.org/wiki/Morse_code
[4]: https://david-dm.org/neocotic/mor.js
[5]: https://david-dm.org/neocotic/mor.js#info=devDependencies
[6]: https://github.com/neocotic/mor.js
[7]: https://github.com/neocotic/mor.js/issues
[8]: https://github.com/neocotic/mor.js/blob/master/AUTHORS.md
[9]: https://github.com/neocotic/mor.js/blob/master/CONTRIBUTING.md
[10]: https://github.com/neocotic/mor.js/blob/master/LICENSE.md