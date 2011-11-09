# [mor.js](http://forchoon.com/projects/javascript/mor-js/)

A pure JavaScript library for encoding/decoding
[Morse code](http://en.wikipedia.org/wiki/Morse_code) messages.

## Standard Usage

### Decode

```
MorJS.decode(data)
```

### Encode

```
MorJS.encode(data)
```

### Data Object

* *{String}* **message** - The message to be decoded/encoded.
* *{String}* **[mode]** - Optional: The mode to be used to decode/encode the
  message.

## Customization

### Define Character

```
MorJS.defineChar(character, pattern)
```

### Define Mode

```
MorJS.defineMode(name, characters)
```

## Properties

```
MorJS.version
```

## Further Information

If you want more information or examples of using this library please visit the
project's homepage;

<http://forchoon.com/projects/javascript/mor-js/>