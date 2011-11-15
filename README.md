# [mor.js](http://forchoon.com/projects/javascript/mor-js/)

A pure JavaScript library for encoding/decoding
[Morse code](http://en.wikipedia.org/wiki/Morse_code) messages.

## Standard Usage

### Decode

```
morjs.decode(data[, callback])
```

### Encode

```
morjs.encode(data[, callback])
```

### Data Object

* *{String}* **message** - The message to be decoded/encoded.
* *{String}* **[mode]** - Optional: The mode to be used to decode/encode the
  message (defaults to `classic`).

## Customization

### Define Character

```
morjs.defineChar(character, pattern[, callback])
```

### Define Mode

```
morjs.defineMode(name, characters[, callback])
```

## Miscellaneous

```
morjs.noConflict()
```

```
morjs.VERSION
```

## Further Information

If you want more information or examples of using this library please visit the
project's homepage;

<http://forchoon.com/projects/javascript/mor-js/>