/**
 * Library for encoding/decoding Morse code messages that supports extensible characters and encoding output.
 *
 * @module morjs
 * @version 1.1.0
 * @copyright Alasdair Mercer 2014
 * @license MIT
 */
(function(factory) {
  'use strict';

  /**
   * The root object that has been determined for the current environment (browser, server, <code>WebWorker</code>).
   *
   * @access private
   * @type {*}
   */
  var root = (typeof self === 'object' && self.self === self && self) ||
      (typeof global === 'object' && global.global === global && global);

  if (typeof define === 'function' && define.amd) {
    // Defines for AMD but also exports to root for those expecting global morjs
    define(function() {
      root.morjs = factory(root);

      return root.morjs;
    });
  } else if (typeof module !== 'undefined' && module.exports) {
    // Supports Node.js and the CommonJS patterns
    exports = module.exports = factory(root);
  } else {
    // Falls back on browser support
    root.morjs = factory(root);
  }
}(function(root) {
  'use strict';

  /**
   * A Morse code configuration.
   *
   * @typedef {Object} MorjsMode
   * @property {String} charSpacer - The string to be inserted between Morse code characters (dots and dashes).
   * @property {String} letterSpacer - The string to be inserted between Morse code letter groupings.
   * @property {String} longString - The string to be used to represent Morse code long characters (dashes).
   * @property {String} shortString - The string to be used to represent Morse code short characters (dots).
   * @property {String} wordSpacer - The string to be inserted between Morse code word groupings.
   */

  /**
   * Options to be passed to the primary {@linkcode morjs} methods.
   *
   * @typedef {Object} MorjsOptions
   * @property {String} [mode="compact"] - The default name of the mode to be used for the encoding/decoding.
   */

  /**
   * The pattern placeholder for long marks.
   *
   * @access private
   * @constant
   * @type {String}
   */
  var longPlaceholder = 'L';

  /**
   * The pattern placeholder for short marks.
   *
   * @access private
   * @constant
   * @type {String}
   */
  var shortPlaceholder = 'S';

  /**
   * The main <code>morjs</code> object to be exported.
   *
   * @access public
   * @type {Object}
   * @alias module:morjs
   */
  var morjs = {};

  /**
   * The previous value of the <code>morjs</code> variable.
   *
   * @access private
   * @type {*}
   */
  var previousMorjs = root.morjs;

  /**
   * Iterates over a given <code>list</code>.
   * <p/>
   * Each element is yielded in turn to the specified <code>iterator</code> function.
   *
   * @param {Array} [list] - the array to be iterated over
   * @param {Function} iterator - the iterator function to be passed index/element
   * @returns {Array} The specified <code>list</code>.
   * @access private
   */
  function each(list, iterator) {
    if (!list) {
      return;
    }

    var length = list.length;

    for (var index = 0; index < length; index++) {
      iterator(list[index], index, list);
    }
  }

  /**
   * Returns the character mapped to the specified <code>pattern</code>, where possible.
   *
   * @param {String} pattern - the pattern for which the character is to be looked up
   * @returns {String} The character mapped to <code>pattern</code> or <code>undefined</code> if there is none.
   * @access private
   */
  function getCharacter(pattern) {
    pattern = pattern.toLocaleUpperCase();

    var character;

    for (var key in morjs.chars) {
      if (morjs.chars.hasOwnProperty(key) && morjs.chars[key] === pattern) {
        character = key;
        break;
      }
    }


    return character;
  }

  /**
   * Returns the given <code>options</code> with all of the <code>defaults</code> applied.
   * <p/>
   * This function <i>will change</i> the specified <code>options</code>.
   *
   * @param {MorjsOptions} [options={}] - the options to be extended
   * @param {MorjsOptions} defaults - the default options
   * @returns {MorjsOptions} The specified <code>options</code> with modifications.
   * @access private
   */
  function getOptions(options, defaults) {
    options = options || {};

    for (var key in defaults) {
      if (typeof options[key] === 'undefined') {
        options[key] = defaults[key];
      }
    }

    return options;
  }

  /**
   * Returns the pattern mapped to the specified <code>character</code>, where possible.
   *
   * @param {String} character - the character for which the pattern is to be looked up
   * @returns {String} The pattern mapped to <code>character</code> or <code>undefined</code> if there is none.
   * @access private
   */
  function getPattern(character) {
    return morjs.chars[character.toLocaleUpperCase()];
  }

  /**
   * Parses a given string by replacing any instances of the search queries provided with their corresponding
   * replacement strings.
   *
   * @param {String} str - the string to be parsed
   * @param {String} shortSearch - the string to search for short placeholder/patterns (will be passed to
   * <code>RegExp</code> constructor)
   * @param {String} shortReplacement - the string to replace short placeholder/patterns
   * @param {String} longSearch - the string to search for long placeholder/patterns (will be passed to
   * <code>RegExp</code> constructor)
   * @param {String} longReplacement - the string to replace long placeholder/patterns
   * @param {String} [spacer] - the string to be inserted between matches
   * @returns {String} The parsed string with all search queries replaced.
   * @access private
   */
  function parse(str, shortSearch, shortReplacement, longSearch, longReplacement, spacer) {
    var hasSpacer = typeof spacer === 'string';
    var rQuery = new RegExp('(' + shortSearch + '|' + longSearch + ')', 'g');
    var result = '';

    each(str.match(rQuery), function(substr, i) {
      // Inserts spacer if provided and not first loop
      if (hasSpacer && i > 0) {
        result += spacer;
      }

      // Swaps queries with their replacements while maintaining new lines
      if (substr === shortSearch) {
        result += shortReplacement;
      } else if (substr === longSearch) {
        result += longReplacement;
      }
    });

    return result;
  }

  /**
   * Prepares a given string to simplify encoding/decoding.
   *
   * @param {String} str - the string to prepare
   * @param {String} wordSplitter - the string used to split words (will be passed to <code>RegExp</code> constructor)
   * @param {String} letterSplitter - the string used to split alphabetic letters
   * @param {String} [charSplitter] - the string used to split characters (for decoding only)
   * @returns {Array.<Array.<String>>|Array.<Array.<Array<String>>>} A multi-dimensional array of words and their
   * alphabetic letters (and even characters if <code>charSplitter</code> is provided) contained within.
   * @access private
   */
  function prepare(str, wordSplitter, letterSplitter, charSplitter) {
    var hasCharSplitter = typeof charSplitter !== 'undefined';
    var rWordSplitter = new RegExp(wordSplitter + '|[\\n\\r]+', 'g');
    var result = str.trim().split(rWordSplitter);

    each(result, function(word, i) {
      result[i] = word = word.split(letterSplitter);

      if (hasCharSplitter) {
        each(word, function(ch, j) {
          result[i][j] = ch.split(charSplitter).join('');
        });
      }
    });

    return result;
  }

  /**
   * Repeats a given string the specified number of <code>times</code>.
   *
   * @param {String} str - the string to be repeated
   * @param {Number} times - the number of times to repeat <code>str</code>
   * @returns {String} <code>str</code> repeated the number of <code>times</code> provided.
   * @access private
   */
  function repeat(str, times) {
    for (var index = 0, result = ''; index < times; index++) {
      result += str;
    }

    return result;
  }

  /**
   * The current version of {@linkcode morjs}.
   *
   * @access public
   * @static
   * @constant
   * @type {String}
   */
  morjs.VERSION = '1.1.0';

  /**
   * The map of supported characters to Morse code patterns.
   *
   * @access public
   * @static
   * @type {Object.<String, String>}
   */
  morjs.chars = {
                         // Letters
    '\u0041': 'SL',      // A
    '\u0042': 'LSSS',    // B
    '\u0043': 'LSLS',    // C
    '\u0044': 'LSS',     // D
    '\u0045': 'S',       // E
    '\u0046': 'SSLS',    // F
    '\u0047': 'LLS',     // G
    '\u0048': 'SSSS',    // H
    '\u0049': 'SS',      // I
    '\u004A': 'SLLL',    // J
    '\u004B': 'LSL',     // K
    '\u004C': 'SLSS',    // L
    '\u004D': 'LL',      // M
    '\u004E': 'LS',      // N
    '\u004F': 'LLL',     // O
    '\u0050': 'SLLS',    // P
    '\u0051': 'LLSL',    // Q
    '\u0052': 'SLS',     // R
    '\u0053': 'SSS',     // S
    '\u0054': 'L',       // T
    '\u0055': 'SSL',     // U
    '\u0056': 'SSSL',    // V
    '\u0057': 'SLL',     // W
    '\u0058': 'LSSL',    // X
    '\u0059': 'LSLL',    // Y
    '\u005A': 'LLSS',    // Z
                         // Numbers
    '\u0030': 'LLLLL',   // 0
    '\u0031': 'SLLLL',   // 1
    '\u0032': 'SSLLL',   // 2
    '\u0033': 'SSSLL',   // 3
    '\u0034': 'SSSSL',   // 4
    '\u0035': 'SSSSS',   // 5
    '\u0036': 'LSSSS',   // 6
    '\u0037': 'LLSSS',   // 7
    '\u0038': 'LLLSS',   // 8
    '\u0039': 'LLLLS',   // 9
                         // Punctuation
    '\u002E': 'SLSLSL',  // Full stop
    '\u002C': 'LLSSLL',  // Comma
    '\u003F': 'SSLLSS',  // Question mark
    '\u0027': 'SLLLLS',  // Apostrophe
    '\u0021': 'LSLSLL',  // Exclamation mark
    '\u002F': 'LSSLS',   // Slash
    '\u0028': 'LSLLS',   // Left parenthesis
    '\u0029': 'LSLLSL',  // Right parenthesis
    '\u0026': 'SLSSS',   // Ampersand
    '\u003A': 'LLLSSS',  // Colon
    '\u003B': 'LSLSLS',  // Semicolon
    '\u003D': 'LSSSL',   // Equal sign
    '\u002B': 'SLSLS',   // Plus sign
    '\u002D': 'LSSSSL',  // Hyphen-minus
    '\u005F': 'SSLLSL',  // Low line
    '\u0022': 'SLSSLS',  // Quotation mark
    '\u0024': 'SSSLSSL', // Dollar sign
    '\u0040': 'SLLSLS',  // At sign
                         // Non-English extensions
    '\u00C4': 'SLSL',    // A with diaeresis
    '\u00C6': 'SLSL',    // A and E as grapheme
    '\u0104': 'SLSL',    // A with ogonek
    '\u00C0': 'SLLSL',   // A with grave
    '\u00C5': 'SLLSL',   // A with ring above
    '\u00C7': 'LSLSS',   // C with cedilla
    '\u0108': 'LSLSS',   // C with circumflex
    '\u0106': 'LSLSS',   // C with acute
    '\u0160': 'LLLL',    // S with caron
    '\u00D0': 'SSLLS',   // Eth
    '\u015A': 'SSSLSSS', // S with acute
    '\u00C8': 'SLSSL',   // E with grave
    '\u0141': 'SLSSL',   // L with stroke
    '\u00C9': 'SSLSS',   // E with acute
    '\u0110': 'SSLSS',   // D with stroke
    '\u0118': 'SSLSS',   // E with ogonek
    '\u011C': 'LLSLS',   // G with circumflex
    '\u0124': 'LLLL',    // H with circumflex
    '\u0134': 'SLLLS',   // J with circumflex
    '\u0179': 'LLSSLS',  // Z with acute
    '\u00D1': 'LLSLL',   // N with tilde
    '\u0143': 'LLSLL',   // N with acute
    '\u00D6': 'LLLS',    // O with diaeresis
    '\u00D8': 'LLLS',    // O with stroke
    '\u00D3': 'LLLS',    // O with acute
    '\u015C': 'SSSLS',   // S with circumflex
    '\u00DE': 'SLLSS',   // Thorn
    '\u00DC': 'SSLL',    // U with diaeresis
    '\u016C': 'SSLL',    // U with breve
    '\u017B': 'LLSSL'    // Z with dot above
  };

  /**
   * The default values to be used when options are not specified or incomplete.
   *
   * @access public
   * @static
   * @type {MorjsOptions}
   */
  morjs.defaults = {
    mode: 'compact'
  };

  /**
   * The configurations for the initially supported Morse code modes.
   *
   * @access public
   * @static
   * @type {Object.<String, MorjsMode>}
   * @property {MorjsMode} classic - The classic "dot" and "dash" output.
   * @property {MorjsMode} classicEntities - Same as the <code>classic</code> mode except outputs XML entities instead
   * of unicode characters.
   * @property {MorjsMode} compact - Compact version of the <code>classic</code> mode with reduced whitespace.
   * @property {MorjsMode} compactEntities - Compact version of the <oode>classicEntities</code> mode with reduced
   * whitespace.
   * @property {MorjsMode} simple - Simple output using a plain hyphen and full stop mixed using a single space to
   * split letters and a new line for words.
   */
  morjs.modes = {
    classic: {
      charSpacer: '\u0020',              // Space
      letterSpacer: repeat('\u0020', 3), // Space (x3)
      longString: '\u002D',              // Hyphen-minus
      shortString: '\u00B7',             // Middle dot
      wordSpacer: repeat('\u0020', 7)    // Space (x7)
    },
    classicEntities: {
      charSpacer: '&nbsp;',              // Non-breaking space
      letterSpacer: repeat('&nbsp;', 3), // Non-breaking space (x3)
      longString: '&#45;',               // Hyphen-minus
      shortString: '&middot;',           // Middle dot
      wordSpacer: repeat('&nbsp;', 7)    // Non-breaking space (x7)
    },
    compact: {
      charSpacer: '',                    // <Empty>
      letterSpacer: '\u0020',            // Space
      longString: '\u002D',              // Hyphen-minus
      shortString: '\u00B7',             // Middle dot
      wordSpacer: repeat('\u0020', 3)    // Space (x3)
    },
    compactEntities: {
      charSpacer: '',                    // <Empty>
      letterSpacer: '&nbsp;',            // Non-breaking space
      longString: '&#45;',               // Hyphen-minus
      shortString: '&middot;',           // Middle dot
      wordSpacer: repeat('&nbsp;', 3)    // Non-breaking space (x3)
    },
    simple: {
      charSpacer: '',                    // <Empty>
      letterSpacer: '\u0020',            // Space
      longString: '\u002D',              // Hyphen-minus
      shortString: '\u002E',             // Full stop
      wordSpacer: repeat('\u0020', 3)    // Space (x3)
    }
  };

  /**
   * Decodes the <code>message</code> provided from Morse code to a human-readable message.
   * <p/>
   * The message may not be decoded correctly if the some of the options used to encode the message originally are not
   * the same as those in <code>options</code>.
   *
   * @param {String} [message=""] - the Morse code string to be decoded
   * @param {MorjsOptions} [options={}] - the options to be used
   * @returns {String} The ouput from decoding <code>message</code>.
   * @access public
   * @static
   */
  morjs.decode = function(message, options) {
    message = String(message || '');
    options = getOptions(options, morjs.defaults);

    var mode = morjs.modes[options.mode];
    var result = '';
    var value = prepare(message, mode.wordSpacer, mode.letterSpacer, mode.charSpacer);

    // Iterates over each word
    each(value, function(word, i) {
      // Inserts space between each word
      if (i > 0) {
        result += ' ';
      }

      // Iterates over each character of word
      each(word, function(ch) {
        var character;
        // Reverse engineers pattern for character
        var pattern = parse(ch, mode.shortString, shortPlaceholder, mode.longString, longPlaceholder);

        // Checks if pattern is supported
        if (pattern) {
          // Retrieves first character matching the pattern
          character = getCharacter(pattern);

          // Appends character if it's supported
          if (typeof character === 'string') {
            result += character;
          }
        }
      });
    });

    return result;
  };

  /**
   * Encodes the <code>message</code> provided to the Morse code.
   *
   * @param {String} [message=""] - the string to be encoded to the Morse code
   * @param {MorjsOptions} [options={}] - the options to be used
   * @returns {String} The output from encoding <code>message</code>.
   * @access public
   * @static
   */
  morjs.encode = function(message, options) {
    message = String(message || '');
    options = getOptions(options, morjs.defaults);

    var mode = morjs.modes[options.mode];
    var result = '';
    var value = prepare(message, '\\s+', '');

    // Iterates over each word
    each(value, function(word, i) {
      // Inserts medium gap between each word
      if (i > 0) {
        result += mode.wordSpacer;
      }

      // Iterates over each character of word
      each(word, function(character, j) {
        // Inserts short gap between each letter
        if (j > 0) {
          result += mode.letterSpacer;
        }

        // Retrieves first character matching the character
        var pattern = getPattern(character);

        // Parses pattern for character if it's supported
        if (typeof pattern === 'string') {
          result += parse(pattern, shortPlaceholder, mode.shortString, longPlaceholder, mode.longString, mode.charSpacer);
        }
      });
    });

    return result;
  };

  /**
   * Runs mor.js in <i>no conflict</i> mode, returning the <code>morjs</code> global variable to it's previous owner,
   * if any.
   *
   * @returns {Object} A reference to this {@linkcode morjs}.
   * @access public
   * @static
   */
  morjs.noConflict = function() {
    root.morjs = previousMorjs;

    return this;
  };

  return morjs;
}));
