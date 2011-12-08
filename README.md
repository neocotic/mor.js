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

### Decode

```
morjs.decode(data[, callback])
```

### Encode

```
morjs.encode(data[, callback])
```

### Data Object

* `message` - The message to be decoded/encoded.
* `[mode]` - *Optional:* The mode to be used to decode/encode the message
  (defaults to `"classic"`).

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
morjs.noConflict([callback])
```

```
morjs.VERSION
```

## Further Information

If you want more information or examples of using this library please visit the
project's homepage;

http://neocotic.com/mor.js

[mor.js]: http://neocotic.com/mor.js
[morse code]: http://en.wikipedia.org/wiki/Morse_code