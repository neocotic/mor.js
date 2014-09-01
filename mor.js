// [mor.js](http://neocotic.com/mor.js) 1.0.2  
// (c) 2011 Alasdair Mercer  
// Freely distributable under the MIT license.  
// For all details and documentation:  
// <http://neocotic.com/mor.js>

(function (root) {

  'use strict';

  // Private constants
  // -----------------

  // Default mode used if not specified or found.
  var DEFAULT_MODE = 'classic';

  // Pattern placeholder for longer marks.
  var LONG         = 'L';

  // Pattern placeholder for shor marks.
  var SHORT        = 'S';

  // Private variables
  // -----------------

  // Map of Morse code patterns to supported characters.  
  // This is a multi-dimensional array and should be treated as such.
  var chars         = [
  /* Char    | Pattern                          */
  /* Letters                                    */
    ['\u0041', 'SL'     ], /* A                 */
    ['\u0042', 'LSSS'   ], /* B                 */
    ['\u0043', 'LSLS'   ], /* C                 */
    ['\u0044', 'LSS'    ], /* D                 */
    ['\u0045', 'S'      ], /* E                 */
    ['\u0046', 'SSLS'   ], /* F                 */
    ['\u0047', 'LLS'    ], /* G                 */
    ['\u0048', 'SSSS'   ], /* H                 */
    ['\u0049', 'SS'     ], /* I                 */
    ['\u004A', 'SLLL'   ], /* J                 */
    ['\u004B', 'LSL'    ], /* K                 */
    ['\u004C', 'SLSS'   ], /* L                 */
    ['\u004D', 'LL'     ], /* M                 */
    ['\u004E', 'LS'     ], /* N                 */
    ['\u004F', 'LLL'    ], /* O                 */
    ['\u0050', 'SLLS'   ], /* P                 */
    ['\u0051', 'LLSL'   ], /* Q                 */
    ['\u0052', 'SLS'    ], /* R                 */
    ['\u0053', 'SSS'    ], /* S                 */
    ['\u0054', 'L'      ], /* T                 */
    ['\u0055', 'SSL'    ], /* U                 */
    ['\u0056', 'SSSL'   ], /* V                 */
    ['\u0057', 'SLL'    ], /* W                 */
    ['\u0058', 'LSSL'   ], /* X                 */
    ['\u0059', 'LSLL'   ], /* Y                 */
    ['\u005A', 'LLSS'   ], /* Z                 */
  /* Numbers                                    */
    ['\u0030', 'LLLLL'  ], /* 0                 */
    ['\u0031', 'SLLLL'  ], /* 1                 */
    ['\u0032', 'SSLLL'  ], /* 2                 */
    ['\u0033', 'SSSLL'  ], /* 3                 */
    ['\u0034', 'SSSSL'  ], /* 4                 */
    ['\u0035', 'SSSSS'  ], /* 5                 */
    ['\u0036', 'LSSSS'  ], /* 6                 */
    ['\u0037', 'LLSSS'  ], /* 7                 */
    ['\u0038', 'LLLSS'  ], /* 8                 */
    ['\u0039', 'LLLLS'  ], /* 9                 */
  /* Punctuation                                */
    ['\u002E', 'SLSLSL' ], /* Full stop         */
    ['\u002C', 'LLSSLL' ], /* Comma             */
    ['\u003F', 'SSLLSS' ], /* Question mark     */
    ['\u0027', 'SLLLLS' ], /* Apostrophe        */
    ['\u0021', 'LSLSLL' ], /* Exclamation mark  */
    ['\u002F', 'LSSLS'  ], /* Slash             */
    ['\u0028', 'LSLLS'  ], /* Left parenthesis  */
    ['\u0029', 'LSLLSL' ], /* Right parenthesis */
    ['\u0026', 'SLSSS'  ], /* Ampersand         */
    ['\u003A', 'LLLSSS' ], /* Colon             */
    ['\u003B', 'LSLSLS' ], /* Semicolon         */
    ['\u003D', 'LSSSL'  ], /* Equal sign        */
    ['\u002B', 'SLSLS'  ], /* Plus sign         */
    ['\u002D', 'LSSSSL' ], /* Hyphen-minus      */
    ['\u005F', 'SSLLSL' ], /* Low line          */
    ['\u0022', 'SLSSLS' ], /* Quotation mark    */
    ['\u0024', 'SSSLSSL'], /* Dollar sign       */
    ['\u0040', 'SLLSLS' ], /* At sign           */
  /* Non-English extensions                     */
    ['\u00C4', 'SLSL'   ], /* A with diaeresis  */
    ['\u00C6', 'SLSL'   ], /* Æ                 */
    ['\u0104', 'SLSL'   ], /* A with ogonek     */
    ['\u00C0', 'SLLSL'  ], /* A with grave      */
    ['\u00C5', 'SLLSL'  ], /* A with ring above */
    ['\u00C7', 'LSLSS'  ], /* C with cedilla    */
    ['\u0108', 'LSLSS'  ], /* C with circumflex */
    ['\u0106', 'LSLSS'  ], /* C with acute      */
    ['\u0160', 'LLLL'   ], /* S with caron      */
    ['\u00D0', 'SSLLS'  ], /* Eth               */
    ['\u015A', 'SSSLSSS'], /* S with acute      */
    ['\u00C8', 'SLSSL'  ], /* E with grave      */
    ['\u0141', 'SLSSL'  ], /* L with stroke     */
    ['\u00C9', 'SSLSS'  ], /* E with acute      */
    ['\u0110', 'SSLSS'  ], /* D with stroke     */
    ['\u0118', 'SSLSS'  ], /* E with ogonek     */
    ['\u011C', 'LLSLS'  ], /* G with circumflex */
    ['\u0124', 'LLLL'   ], /* H with circumflex */
    ['\u0134', 'SLLLS'  ], /* J with circumflex */
    ['\u0179', 'LLSSLS' ], /* Z with acute      */
    ['\u00D1', 'LLSLL'  ], /* N with tilde      */
    ['\u0143', 'LLSLL'  ], /* N with acute      */
    ['\u00D6', 'LLLS'   ], /* O with diaeresis  */
    ['\u00D8', 'LLLS'   ], /* O with stroke     */
    ['\u00D3', 'LLLS'   ], /* O with acute      */
    ['\u015C', 'SSSLS'  ], /* S with circumflex */
    ['\u00DE', 'SLLSS'  ], /* Thorn             */
    ['\u00DC', 'SSLL'   ], /* U with diaeresis  */
    ['\u016C', 'SSLL'   ], /* U with breve      */
    ['\u017B', 'LLSSL'  ]  /* Z with dot above  */
  ];

    // Map of supported modes used to encode/decode messages.  
    // This is a multi-dimensional array and should be treated as such.
  var modes         = (function () {
    // Repeat a string the specified number of times.
    var repeat = function(str, num) {
      for (var i = 0, ret = ''; i < num; i++) {
        ret += str;
      }

      return ret;
    };

    // Return the array of predefined modes.
    return [
    /* Name               | Chars                                      */
      ['classic',          ['\u00B7',       /* Middle dot              */
                            '\u002D',       /* Hyphen-minus            */
                            '\u0020',       /* Space                   */
                     repeat('\u0020', 3),   /* Space (x3)              */
                     repeat('\u0020', 7)]], /* Space (x7)              */
      ['classic-entities', ['&middot;',     /* Middle dot              */
                            '&#45;',        /* Hyphen-minus            */
                            '&nbsp;',       /* Non-breaking space      */
                     repeat('&nbsp;', 3),   /* Non-breaking space (x3) */
                     repeat('&nbsp;', 7)]], /* Non-breaking space (x7) */
      ['digital',          ['\u0031',       /* 1                       */
                     repeat('\u0031', 3),   /* 1 (x3)                  */
                            '\u0030',       /* 0                       */
                     repeat('\u0030', 3),   /* 0 (x3)                  */
                     repeat('\u0030', 7)]], /* 0 (x7)                  */
      ['simple',           ['\u0030',       /* 0                       */
                            '\u0031',       /* 1                       */
                            '',             /* <Empty>                 */
                            '\u002C',       /* Comma                   */
                            '\u0020']]      /* Space                   */
    ];
  })();

  // Save the previous value of the `morjs` variable.
  var previousMorjs = root.morjs;

  // Private functions
  // -----------------

  // Return the character mapping that matches the query provided.
  var findChar = function(query, index) {
    // `query` is case-insensitive.
    query = query.toUpperCase();

    for (var i = 0; i < chars.length; i++) {
      if (chars[i][index] === query) {
        return chars[i];
      }
    }
  };

  // Return the **last** function in the arguments provided, where possible.
  var findLastFunction = function() {
    for (var i = arguments.length; i >= 0; --i) {
      if (typeof arguments[i] === 'function') {
        return arguments[i];
      }
    }
  };

  // Return the mode mapping that matches the name provided.  
  // If no name is specified, or no matching mode could be found, the `DEFAULT_MODE` will be returned.
  var findMode = function(name) {
    if (typeof name === 'string') {
      // `name` is case-insensitive.
      name = name.toLowerCase();

      for (var i = 0; i < modes.length; i++) {
        if (modes[i][0] === name) {
          return modes[i];
        }
      }
    }

    return findMode(DEFAULT_MODE);
  };

  // Parse a string by replacing any instances of the queries provided with their corresponding replacement strings.
  var parse = function(str, query1, replacement1, query2, replacement2, spacer) {
    var hasSpacer = typeof spacer === 'string';
    var ret       = '';

    for (var i = 0; i < str.length; i++) {
      // Insert spacer if provided and not first loop.
      if (hasSpacer && i > 0) {
        ret += spacer;
      }

      // Swap queries with their replacements.
      switch (str[i]) {
      case query1:
        ret += replacement1;
        break;
      case query2:
        ret += replacement2;
        break;
      }
    }

    return ret;
  };

  // Prepare the string to simplify encoding/decoding.  
  // The return value is a multi-dimensional array and should be treated as such.
  var prepare = function(str, wordSplitter, letterSplitter, charSplitter) {
    if (typeof str !== 'string') {
      throw new TypeError('Invalid value type: ' + typeof str);
    }

    var hasCharSplitter = typeof charSplitter !== 'undefined';
    var ret             = str.trim().split(wordSplitter);

    for (var i = 0; i < ret.length; i++) {
      ret[i] = ret[i].split(letterSplitter);

      if (hasCharSplitter) {
        for (var j = 0; j < ret[i].length; j++) {
          ret[i][j] = ret[i][j].split(charSplitter).join('');
        }
      }
    }

    return ret;
  };

  // Safely handle cases where synchronization methodology may vary.  
  // In cases where a callback function was specified it should be used to pass the return value of the function
  // provided or any errors that were thrown during the process. Either the return value of the callback function or
  // the error encountered will be returned here.  
  // Otherwise; errors will be thrown as normal and the return value of the function will simply be returned.  
  // When the function provided is called the specified context will be applied.
  var syncSafe = function(fn, cb, ctx) {
    try {
      var ret = fn.apply(ctx || this);
      // All went OK, so handle result.
      if (typeof cb === 'function') {
        return cb(null, ret);
      } else {
        return ret;
      }
    } catch (e) {
      // Something went wrong, so bubble the error.
      if (typeof cb === 'function') {
        return cb(e);
      } else {
        throw e;
      }
    }
  };

  // mor.js setup
  // ------------

  // Build the publicly exposed API.
  var morjs = {

    // Constants
    // ---------

    // Current version of `morjs`.
    VERSION: '1.0.2',

    // Primary functions
    // -----------------

    // Decode the message from Morse code to a human-readable message.  
    // The message will not be decoded correctly if the mode used to decode the message is not the same as that used to
    // encode it.  
    // If no mode is specified `DEFAULT_MODE` will be used.  
    // Optionally, a callback function can be provided which will be called with the result as the second argument. If
    // an error occurs it will be passed as the first argument to this function, otherwise this argument will be
    // `null`.
    decode: function(data, callback) {
      callback = findLastFunction(data, callback);

      return syncSafe(function() {
        switch (typeof data) {
        case 'object': break;
        case 'string':
          data = {message: data};
          break;
        default:
          data = {};
          break;
        }

        var mode  = findMode(data.mode)[1];
        var ret   = '';
        var value = prepare(data.message || '', mode[4], mode[3], mode[2]);

        // Ensure message was prepared successfully.
        if (value) {
          // Iterate over each word.
          for (var i = 0; i < value.length; i++) {
            // Insert space between each word.
            if (i > 0) {
              ret += ' ';
            }

            // Iterate over each character of word.
            for (var j = 0; j < value[i].length; j++) {
              // Reverse engineer pattern for character.
              var pattern = parse(value[i][j], mode[0], SHORT, mode[1], LONG);

              // Check if pattern is supported.
              if (pattern) {
                // Retrieve first character matching the pattern.
                var ch = findChar(pattern, 1);

                // Append character if it's supported.
                if (ch) {
                  ret += ch[0];
                }
              }
            }
          }
        }

        return ret;
      }, callback, this);
    },

    // Encode the message in to the Morse code.  
    // If no mode is specified `DEFAULT_MODE` will be used.  
    // Optionally, a callback function can be provided which will be called with the result as the second argument. If
    // an error occurs it will be passed as the first argument to this function, otherwise this argument will be
    // `null`.
    encode: function(data, callback) {
      callback = findLastFunction(data, callback);

      return syncSafe(function() {
        switch (typeof data) {
        case 'object': break;
        case 'string':
          data = {message: data};
          break;
        default:
          data = {};
          break;
        }

        var mode  = findMode(data.mode)[1];
        var ret   = '';
        var value = prepare(data.message || '', /\s+/, '');

        // Ensure message was prepared successfully.
        if (value) {
          // Iterate over each word.
          for (var i = 0; i < value.length; i++) {
            // Insert medium gap between each word.
            if (i > 0) {
              ret += mode[4];
            }

            // Iterate over each character of word
            for (var j = 0; j < value[i].length; j++) {
              // Insert short gap between each letter.
              if (j > 0) {
                ret += mode[3];
              }

              // Retrieve first character matching the character.
              var ch = findChar(value[i][j], 0);

              // Parse pattern for character if it's supported.
              if (ch) {
                ret += parse(ch[1], SHORT, mode[0], LONG, mode[1], mode[2]);
              }
            }
          }
        }

        return ret;
      }, callback, this);
    },

    // Customization functions
    // -----------------------

    // Map a new pattern to the character provided.  
    // If a mapping already exists for the specified character, that mapping will be modified.  
    // Optionally, a callback function can be provided which will be called when the character has been defined. If an
    // error occurs it will be passed as the first argument to this function, otherwise this argument will be `null`.
    defineChar: function(character, pattern, callback) {
      return syncSafe(function() {
        // Type-check arguments provided.
        if (typeof character !== 'string') {
          throw new TypeError('Invalid character type: ' + typeof character);
        } else if (typeof pattern !== 'string') {
          throw new TypeError('Invalid pattern type: ' + typeof pattern);
        }

        // `character` must be singular.
        if (character.length > 1) {
          throw new Error('Invalid character length: ' + character.length);
        }

        var ucPattern = pattern.trim().toUpperCase();

        // `pattern` must only contain `S` & `L` characters and must contain at least one of either.
        if (!/^[SL]+$/.test(ucPattern)) {
          throw new Error('Invalid pattern: ' + pattern);
        }

        // Update existing character mapping or create new one.
        character = character.toUpperCase();

        var existingChar = findChar(character, 0);

        if (existingChar) {
          existingChar[1] = ucPattern;
        } else {
          chars.push([character, ucPattern]);
        }

      }, callback, this);
    },

    // Map new characters to the mode provided.  
    // If a mode already exists for the specified name, that mode's character mapping will be modified.  
    // The elements of `characters` should be specified in the following order;
    // 
    // * Short mark (dot)
    // * Longer mark (dash)
    // * Intra-character gap (between dots and dashes within a character)
    // * Short gap (between letters)
    // * Medium gap (between words)
    // 
    // Optionally, a callback function can be provided which will be called when the mode has been defined. If an error
    // occurs it will be passed as the first argument to this function, otherwise this argument will be `null`.
    defineMode: function(name, characters, callback) {
      return syncSafe(function() {
        // Type-check arguments provided.
        if (typeof name !== 'string') {
          throw new TypeError('Invalid name type: ' + typeof name);
        } else if (typeof characters !== 'object') {
          throw new TypeError('Invalid characters type: ' + typeof characters);
        }

        // `characters` must contain all required character replacements.
        if (characters.length !== 5) {
          throw new Error('Invalid characters length: ' + characters.length);
        }

        // Iterate over each character in `characters`, validating each one.
        for (var i = 0, character = ''; i < characters.length; i++) {
          character = characters[i];

          // `character` must be a string.
          if (typeof character !== 'string') {
            throw new TypeError('Invalid character type at [' + i + ']: ' + typeof character);
          }

          // `character` cannot contain either `S` or `L` characters.
          character = character.toUpperCase();

          if (character.indexOf(LONG) !== -1) {
            throw new Error('Invalid character found at [' + i + ']: ' + LONG);
          } else if (character.indexOf(SHORT) !== -1) {
            throw new Error('Invalid character found at [' + i + ']: ' + SHORT);
          }
        }

        // Update existing mode mapping or create new one.
        name = name.toLowerCase();

        var existingMode = findMode(name);

        if (existingMode) {
          existingMode[1] = characters;
        } else {
          modes.push([name, characters]);
        }
      }, callback, this);
    },

    // Utility functions
    // -----------------

    // Return a read-only copy of the character mappings currently loaded.
    chars: function(callback) {
      return syncSafe(function() {
        var ret = [];

        for (var i = 0; i < chars.length; i++) {
          ret.push(chars[i]);
        }

        return ret;
      }, callback, this);
    },

    // Return a read-only copy of the modes currently loaded.
    modes: function(callback) {
      return syncSafe(function() {
        var ret = [];

        for (var i = 0; i < modes.length; i++) {
          ret.push(modes[i]);
        }

        return ret;
      }, callback, this);
    },

    // Run mor.js in *noConflict* mode, returning the `morjs` variable to its previous owner.  
    // Returns a reference to `morjs`.  
    // Optionally, a callback function can be provided which will be called after the ownership has been restored. If
    // an error occurs it will be passed as the first argument to this function, otherwise this argument will be
    // `null`.
    noConflict: function(callback) {
      return syncSafe(function() {
        root.morjs = previousMorjs;

        return this;
      }, callback, this);
    }

  };

  // Export `morjs` for NodeJS and CommonJS.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = morjs;
    }

    exports.morjs = morjs;
  } else if (typeof define === 'function' && define.amd) {
    define(function() {
      return morjs;
    });
  } else {
    root.morjs = morjs;
  }

}(this));