/*!
 * mor.js v1.0.1
 * http://forchoon.com/projects/javascript/mor-js/
 *
 * Copyright 2011, Alasdair Mercer
 * Licensed under the GPL Version 3 license.
 */

/*jslint
    sloppy: true, vars: true, plusplus: true, maxerr: 50, maxlen: 80, indent: 4
*/

(function (root) {

    /**
     * <p>The mapping of morse code patterns to supported characters.</p>
     * <p>This is a multi-dimensional array and should be treated as such.</p>
     * @private
     * @type Array[]
     */
    var chars = [
            /* Letters */
            ['\u0041', 'SL'],      // A
            ['\u0042', 'LSSS'],    // B
            ['\u0043', 'LSLS'],    // C
            ['\u0044', 'LSS'],     // D
            ['\u0045', 'S'],       // E
            ['\u0046', 'SSLS'],    // F
            ['\u0047', 'LLS'],     // G
            ['\u0048', 'SSSS'],    // H
            ['\u0049', 'SS'],      // I
            ['\u004A', 'SLLL'],    // J
            ['\u004B', 'LSL'],     // K
            ['\u004C', 'SLSS'],    // L
            ['\u004D', 'LL'],      // M
            ['\u004E', 'LS'],      // N
            ['\u004F', 'LLL'],     // O
            ['\u0050', 'SLLS'],    // P
            ['\u0051', 'LLSL'],    // Q
            ['\u0052', 'SLS'],     // R
            ['\u0053', 'SSS'],     // S
            ['\u0054', 'L'],       // T
            ['\u0055', 'SSL'],     // U
            ['\u0056', 'SSSL'],    // V
            ['\u0057', 'SLL'],     // W
            ['\u0058', 'LSSL'],    // X
            ['\u0059', 'LSLL'],    // Y
            ['\u005A', 'LLSS'],    // Z
            /* Numbers */
            ['\u0030', 'LLLLL'],   // 0
            ['\u0031', 'SLLLL'],   // 1
            ['\u0032', 'SSLLL'],   // 2
            ['\u0033', 'SSSLL'],   // 3
            ['\u0034', 'SSSSL'],   // 4
            ['\u0035', 'SSSSS'],   // 5
            ['\u0036', 'LSSSS'],   // 6
            ['\u0037', 'LLSSS'],   // 7
            ['\u0038', 'LLLSS'],   // 8
            ['\u0039', 'LLLLS'],   // 9
            /* Punctuation */
            ['\u002E', 'SLSLSL'],  // Full stop
            ['\u002C', 'LLSSLL'],  // Comma
            ['\u003F', 'SSLLSS'],  // Question mark
            ['\u0027', 'SLLLLS'],  // Apostrophe
            ['\u0021', 'LSLSLL'],  // Exclamation mark
            ['\u002F', 'LSSLS'],   // Slash
            ['\u0028', 'LSLLS'],   // Left parenthesis
            ['\u0029', 'LSLLSL'],  // Right parenthesis
            ['\u0026', 'SLSSS'],   // Ampersand
            ['\u003A', 'LLLSSS'],  // Colon
            ['\u003B', 'LSLSLS'],  // Semicolon
            ['\u003D', 'LSSSL'],   // Equal sign
            ['\u002B', 'SLSLS'],   // Plus sign
            ['\u002D', 'LSSSSL'],  // Hyphen-minus
            ['\u005F', 'SSLLSL'],  // Low line
            ['\u0022', 'SLSSLS'],  // Quotation mark
            ['\u0024', 'SSSLSSL'], // Dollar sign
            ['\u0040', 'SLLSLS'],  // At sign
            /* Non-English extensions */
            ['\u00C4', 'SLSL'],    // A with diaeresis
            ['\u00C6', 'SLSL'],    // Æ
            ['\u0104', 'SLSL'],    // A with ogonek
            ['\u00C0', 'SLLSL'],   // A with grave
            ['\u00C5', 'SLLSL'],   // A with ring above
            ['\u00C7', 'LSLSS'],   // C with cedilla
            ['\u0108', 'LSLSS'],   // C with circumflex
            ['\u0106', 'LSLSS'],   // C with acute
            ['\u0160', 'LLLL'],    // S with caron
            ['\u00D0', 'SSLLS'],   // Eth
            ['\u015A', 'SSSLSSS'], // S with acute
            ['\u00C8', 'SLSSL'],   // E with grave
            ['\u0141', 'SLSSL'],   // L with stroke
            ['\u00C9', 'SSLSS'],   // E with acute
            ['\u0110', 'SSLSS'],   // D with stroke
            ['\u0118', 'SSLSS'],   // E with ogonek
            ['\u011C', 'LLSLS'],   // G with circumflex
            ['\u0124', 'LLLL'],    // H with circumflex
            ['\u0134', 'SLLLS'],   // J with circumflex
            ['\u0179', 'LLSSLS'],  // Z with acute
            ['\u00D1', 'LLSLL'],   // N with tilde
            ['\u0143', 'LLSLL'],   // N with acute
            ['\u00D6', 'LLLS'],    // O with diaeresis
            ['\u00D8', 'LLLS'],    // O with stroke
            ['\u00D3', 'LLLS'],    // O with acute
            ['\u015C', 'SSSLS'],   // S with circumflex
            ['\u00DE', 'SLLSS'],   // Thorn
            ['\u00DC', 'SSLL'],    // U with diaeresis
            ['\u016C', 'SSLL'],    // U with breve
            ['\u017B', 'LLSSL']    // Z with dot above
        ],

        /**
         * <p>The name of the mode to be used if none is specified or could not
         * be found.</p>
         * @private
         * @type String
         */
        defaultMode = 'classic',

        /**
         * <p>The pattern placeholder for longer marks.</p>
         * @private
         * @type String
         */
        LONG = 'L',

        /**
         * <p>The supported mode mappings used to encode/decode messages.</p>
         * <p>This is a multi-dimensional array and should be treated as
         * such.</p>
         * @private
         * @type Array[]
         */
        modes = [],

        /**
         * <p>The previous version of the global <code>morjs</code>
         * variable.</p>
         * @since 1.0.1
         * @private
         * @type Object
         */
        previousMorjs = root.morjs,

        /**
         * <p>The pattern placeholder for short marks.</p>
         * @private
         * @type String
         */
        SHORT = 'S';

    /**
     * <p>Attempts to find a character mapping that matches the query
     * provided.</p>
     * @param {String} query The query string to be matched.
     * @param {Integer} index The index of the character mapping to be queried.
     * @returns {String[]} The character mapping matching the query or
     * <code>undefined</code> if none was found.
     * @private
     */
    function findChar(query, index) {
        query = query.toUpperCase();
        for (var i = 0; i < chars.length; i++) {
            if (chars[i][index] === query) {
                return chars[i];
            }
        }
    }

    /**
     * <p>Attempts to find a mode mapping with the name provided.</p>
     * <p>As all mode names are stored in lower case the name provided will be
     * transformed in to lower case before matching.</p>
     * @param {String} [name] The name of the mode to be retrieved.
     * @returns {Array} The mode with the matching name or the default mode if
     * none was found.
     * @private
     */
    function findMode(name) {
        // Check if mode was specified
        if (typeof name === 'string') {
            name = name.toLowerCase();
            for (var i = 0; i < modes.length; i++) {
                if (modes[i][0] === name) {
                    return modes[i];
                }
            }
        }
        // No mode found or specified; Just use the default then
        return findMode(defaultMode);
    }

    /**
     * <p>Parses the string provided by replacing any instances of the queries
     * with the corresponding strings.</p>
     * @param {String} str The string to be parsed.
     * @param {String} query1 The 1st query to be replaced.
     * @param {String} replacement1 The replacement string for the 1st query.
     * @param {String} query2 The 2nd query to be replaced.
     * @param {String} replacement2 The replacement string for the 2nd query.
     * @param {String} [spacer] The optional spacer to be inserted between each
     * character.
     * @returns {String} The parsed string.
     * @private
     */
    function parse(str, query1, replacement1, query2, replacement2, spacer) {
        var hasSpacer = typeof spacer === 'string',
            ret = '';
        for (var i = 0; i < str.length; i++) {
            // Insert spacer if provided and not first loop
            if (hasSpacer && i > 0) {
                ret += spacer;
            }
            // Perform string replacements
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
    }

    /**
     * <p>Prepares the message to so that it can be easily encoded/decoded.</p>
     * <p>The returned value is a multi-dimensional array and should be treated
     * as such.</p>
     * @param {String} str The user-defined message.
     * @param {RegExp|String} wordSplitter The selector to be used to separate
     * words.
     * @param {RegExp|String} letterSplitter The selector to be used to
     * separate letters.
     * @param {RegExp|String} [charSplitter] The optional selector to be used
     * to separate intra-characters (used only when decoding).
     * @returns {Array} The character to word mapping ([word][char]).
     * @throws {TypeError} If <code>str</code> is not a string.
     * @private
     */
    function prepare(str, wordSplitter, letterSplitter, charSplitter) {
        if (typeof str !== 'string') {
            throw new TypeError('Invalid value type: ' + typeof str);
        }
        var hasCharSplitter = typeof charSplitter === 'string',
            // Splits words
            ret = str.trim().split(wordSplitter);
        for (var i = 0; i < ret.length; i++) {
            // Splits letters
            ret[i] = ret[i].split(letterSplitter);
            // Check if character separator was specified
            if (hasCharSplitter) {
                for (var j = 0; j < ret[i].length; j++) {
                    // Splits characters
                    ret[i][j] = ret[i][j].split(charSplitter).join('');
                }
            }
        }
        return ret;
    }

    /**
     * <p>Repeats the string provided for the specified number of times.</p>
     * @param {String} str The string to be repeated.
     * @param {Integer} num The number of times to repeat the string.
     * @returns {String} The repeated string.
     * @private
     */
    function repeat(str, num) {
        var ret = '';
        for (var i = 0; i < num; i++) {
            ret += str;
        }
        return ret;
    }

    /**
     * <p>Safely handles cases where synchronisation methodology may vary.</p>
     * <p>In cases where a callback function was specified it should be used to
     * pass the return value of the function provided or any errors that were
     * thrown during the process. Either the return value of the callback
     * function or the error encountered will be returned here.</p>
     * <p>Otherwise; errors will be thrown as normal and the return value of the
     * function will simply be returned.</p>
     * @param {Function} fn The function to be ran safely.
     * @param {Function} [cb] The function to be called with the resulting value
     * or any errors that were thrown.
     * @returns The return value of the function provided or an error if one
     * was thrown during the process while a callback function was specified.
     * @since 1.0.1
     * @throws Any error that occurs while no callback function was specified.
     * @private
     */
    function syncSafe(fn, cb) {
        // Check if callback was provided
        var hasCallback = typeof cb === 'function';
        try {
            var ret = fn();
            // All went, handle response
            if (hasCallback) {
                return cb(null, ret);
            } else {
                return ret;
            }
        } catch (e) {
            // Something went wrong, notify the user
            if (hasCallback) {
                return cb(e);
            } else {
                throw e;
            }
        }
    }

    // Add some predefined modes
    modes.push(['classic', [
            '\u00B7',            // Middle dot
            '\u002D',            // Hyphen-minus
            '\u0020',            // Space
            repeat('\u0020', 3), // Space (x3)
            repeat('\u0020', 7)  // Space (x7)
        ]
    ]);
    modes.push(['classic-entities', [
            '&middot;',          // Middle dot
            '&#45;',             // Hyphen-minus
            '&nbsp;',            // Non-breaking space
            repeat('&nbsp;', 3), // Non-breaking space (x3)
            repeat('&nbsp;', 7)  // Non-breaking space (x7)
        ]
    ]);
    modes.push(['digital', [
            '\u0031',            // 1
            repeat('\u0031', 3), // 1 (x3)
            '\u0030',            // 0
            repeat('\u0030', 3), // 0 (x3)
            repeat('\u0030', 7)  // 0 (x7)
        ]
    ]);
    modes.push(['simple', [
            '\u0030',            // 0
            '\u0031',            // 1
            '',                  // Nothing
            '\u002C',            // Comma
            '\u0020'             // Space
        ]
    ]);

    /**
     * <p>Pure JavaScript library for encoding/decoding morse code.</p>
     * <p>The predefined supported characters are based on the International
     * Telecommunication Union (ITU).</p>
     * @author <a href="http://github.com/neocotic">Alasdair Mercer</a>
     * @version 1.0.1
     * @public
     * @namespace
     */
    var morjs = {

        /**
         * <p>Decodes the morse code provided in to a human-readable
         * message.</p>
         * <p>The message will not be decoded correctly if the mode used to
         * decode the message is not the same as that used to encode it.</p>
         * <p>If no mode is specified then the default mode will be used.</p>
         * <p>Optionally, a callback function can be provided which will be
         * called with the result as the second argument. If an error occurs it
         * will be passed as the first argument to this function, otherwise this
         * argument will be <code>null</code>.</p>
         * @param {Object} data The information for decoding.
         * @param {String} data.message The string to be decoded.
         * @param {String} [data.mode] The name of the mode to be used to
         * decode the message.
         * @param {Function} [callback] The function to be called with the
         * decoded message or any errors.
         * @returns The decoded message or, where a callback function was
         * specified, the return value of the callback function or any error
         * that occurred while decoding the message.
         * @throws {TypeError} If <code>data.message</code> is not a string and
         * no callback function was specified.
         * @public
         */
        decode: function (data, callback) {
            return syncSafe(function () {
                data = data || {};
                var mode = findMode(data.mode)[1],
                    ret = '',
                    value = prepare(data.message || '', mode[4], mode[3],
                            mode[2]);
                // Check message was prepared
                if (value.length) {
                    // Iterate over each word
                    for (var i = 0; i < value.length; i++) {
                        // Insert space between each word
                        if (i > 0) {
                            ret += ' ';
                        }
                        // Iterate over each character of word
                        for (var j = 0; j < value[i].length; j++) {
                            // Reverse engineer pattern for character
                            var pattern = parse(value[i][j], mode[0], SHORT,
                                    mode[1], LONG);
                            // Check if pattern could be created
                            if (pattern) {
                                // Retrieve first character matching the pattern
                                var ch = findChar(pattern, 1);
                                // Check if character is supported
                                if (ch) {
                                    ret += ch[0];
                                }
                            }
                        }
                    }
                }
                return ret;
            }, callback);
        },

        /**
         * <p>Maps a new pattern to the character provided.</p>
         * <p>If a mapping already exists for the specified character, that
         * mapping will be modified.</p>
         * <p>Optionally, a callback function can be provided which will be
         * called when the character has been defined. If an error occurs it
         * will be passed as the first argument to this function, otherwise this
         * argument will be <code>null</code>.</p>
         * @param {String} character The character whose mapping is being
         * defined. Must be a single character.
         * @param {String} pattern The pattern to be mapped. Must contain a
         * combination of only <code>S</code> and <code>L</code> characters.
         * @param {Function} [callback] The function to be called once the
         * defined.
         * @returns The return value of the callback function or any error that
         * occurred while defining the character if a callback function was
         * specified; otherwise <code>undefined</code>.
         * @throws {Error} If <code>character</code> is contains more than a
         * single character.
         * @throws {Error} If <code>pattern</code> doesn't contain at least one
         * <code>S</code> and <code>L</code> character, or contains any other
         * character.
         * @throws {TypeError} If <code>character</code> is not a string.
         * @throws {TypeError} If <code>pattern</code> is not a string.
         * @public
         */
        defineChar: function (character, pattern, callback) {
            return syncSafe(function () {
                // Arguments must be strings
                if (typeof character !== 'string') {
                    throw new TypeError('Invalid character type: ' +
                            typeof character);
                } else if (typeof pattern !== 'string') {
                    throw new TypeError('Invalid pattern type: ' +
                            typeof pattern);
                }
                // Character must be singular
                if (character.length > 1) {
                    throw new Error('Invalid character length: ' +
                            character.length);
                }
                // Ensure correct cases are applied
                var ucCharacter = character.toUpperCase(),
                    ucPattern = pattern.trim().toUpperCase();
                // Pattern must only contain 'S'/'L' characters and at least one
                if (!/^[SL]+$/.test(ucPattern)) {
                    throw new Error('Invalid pattern: ' + pattern);
                }
                // Update existing character mapping or create new one
                var existingChar = findChar(ucCharacter, 0);
                if (existingChar) {
                    existingChar[1] = ucPattern;
                } else {
                    chars.push([ucCharacter, ucPattern]);
                }
            }, callback);
        },

        /**
         * <p>Maps new characters to the mode provided.</p>
         * <p>If a mode already exists for the specified name, that
         * mode's character mapping will be modified.</p>
         * <p><code>characters</code> elements must be specified in the
         * following order;
         *   <ol start="0">
         *     <li>Short mark (dot)</li>
         *     <li>Longer mark (dash)</li>
         *     <li>Intra-character gap (between dots and dashes within a
         *     character)</li>
         *     <li>Short gap (between letters)</li>
         *     <li>Medium gap (between words)</li>
         *   </ol>
         * </p>
         * <p>Optionally, a callback function can be provided which will be
         * called when the mode has been defined. If an error occurs it will be
         * passed as the first argument to this function, otherwise this
         * argument will be <code>null</code>.</p>
         * @param {String} name The name of the mode whose mapping is being
         * defined.
         * @param {String[]} characters The characters to be mapped. Must
         * contain all required elements. Each element must only be a single
         * character and cannot contain either <code>S</code> or <code>L</code>
         * characters.
         * @param {Function} [callback] The function to be called once the
         * defined.
         * @returns The return value of the callback function or any error that
         * occurred while defining the mode if a callback function was
         * specified; otherwise <code>undefined</code>.
         * @throws {Error} If <code>characters</code> doesn't contain all
         * required characters.
         * @throws {Error} If a character contains more than just a single
         * character.
         * @throws {TypeError} If <code>name</code> is not a string.
         * @throws {TypeError} If <code>characters</code> is not an array.
         * @public
         */
        defineMode: function (name, characters, callback) {
            return syncSafe(function () {
                // Name must be a string
                if (typeof name !== 'string') {
                    throw new TypeError('Invalid name type: ' + typeof name);
                }
                // Characters must be an array (type: object)
                if (typeof characters !== 'object') {
                    throw new TypeError('Invalid characters type: ' +
                            typeof characters);
                }
                // Ensure correct cases are used
                var lcName = name.toLowerCase(),
                    ucCharacters = [];
                // Characters must contain each required character
                if (characters.length !== 5) {
                    throw new Error('Invalid characters length: ' +
                            characters.length);
                }
                // Iterate over each character, validating every time
                for (var i = 0; i < characters.length; i++) {
                    // Character must be a string
                    if (typeof characters[i] !== 'string') {
                        throw new Error('Invalid character type at [' + i +
                                ']: ' + typeof characters[i]);
                    }
                    // Character cannot contain 'S'/'L' characters
                    if (characters[i].indexOf(LONG) !== -1) {
                        throw new Error('Invalid character found at [' + i +
                                ']: ' + LONG);
                    } else if (characters[i].indexOf(SHORT) !== -1) {
                        throw new Error('Invalid character found at [' + i +
                                ']: ' + SHORT);
                    }
                    // Transform character to upper case
                    ucCharacters.push(characters[i].toUpperCase());
                }
                // Update existing mode mapping or create new one
                var existingMode = findMode(lcName);
                if (existingMode) {
                    existingMode[1] = ucCharacters;
                } else {
                    modes.push([lcName, ucCharacters]);
                }
            }, callback);
        },

        /**
         * <p>Encodes the message provided in to morse code.</p>
         * <p>If no mode is specified then the default mode will be used.</p>
         * <p>Optionally, a callback function can be provided which will be
         * called with the result as the second argument. If an error occurs it
         * will be passed as the first argument to this function, otherwise this
         * argument will be <code>null</code>.</p>
         * @param {Object} data The information for encoding.
         * @param {String} data.message The string to be encoded.
         * @param {String} [data.mode] The name of the mode to be used to
         * encode the message.
         * @param {Function} [callback] The function to be called with the
         * decoded message or any errors.
         * @returns The encoded message or, where a callback function was
         * specified, the return value of the callback function or any error
         * that occurred while encoding the message.
         * @throws {TypeError} If <code>data.message</code> is not a string and
         * no callback function was specified.
         * @public
         */
        encode: function (data, callback) {
            return syncSafe(function () {
                data = data || {};
                var mode = findMode(data.mode)[1],
                    ret = '',
                    value = prepare(data.message || '', /\s+/, '');
                // Check message was prepared
                if (value.length) {
                    // Iterate over each word
                    for (var i = 0; i < value.length; i++) {
                        // Insert medium gap between each word
                        if (i > 0) {
                            ret += mode[4];
                        }
                        // Iterate over each character of word
                        for (var j = 0; j < value[i].length; j++) {
                            // Insert intra-character gap between each character
                            if (j > 0) {
                                ret += mode[3];
                            }
                            // Retrieve first character matching the character
                            var ch = findChar(value[i][j], 0);
                            // Check if character is supported and parse pattern
                            if (ch) {
                                ret += parse(ch[1], SHORT, mode[0], LONG,
                                        mode[1], mode[2]);
                            }
                        }
                    }
                }
                return ret;
            }, callback);
        },

        /**
         * <p>Run mor.js in <em>noConflict</em> mode, returning the
         * <code>morjs</code> variable to its previous owner.</p>
         * @returns {Object} The <code>morjs</code> object.
         * @since 1.0.1
         * @public
         */
        noConflict: function () {
            root.morjs = previousMorjs;
            return this;
        },

        /**
         * <p>The current version of mor.js.</p>
         * @since 1.0.1
         * @public
         * @type String
         */
        VERSION: '1.0.1'

    };

    // Export mor.js for Node.js and CommonJS
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = morjs;
        }
        exports.morjs = morjs;
    } else if (typeof define === 'function' && define.amd) {
        define('morjs', function () {
            return morjs;
        });
    } else {
        root.morjs = morjs;
    }

}(this));