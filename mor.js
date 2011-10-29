/*!
 * mor.js v1.0.0
 * http://forchoon.com/projects/javascript/mor-js/
 *
 * Copyright 2011, Alasdair Mercer
 * Licensed under the GPL Version 3 license.
 */

var MorJS = (function () {

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
        defaultMode = 'classic',
        /*
         * Mode array order;
         * 
         * 0: Short mark (dot)
         * 1: Longer mark (dash)
         * 2: Intra-character gap (between dots and dashes within a character)
         * 3: Short gap (between letters)
         * 4: Medium gap (between words)
         */
        modes = {};

    function defineChar(value, pattern) {
        chars.push([value.toUpperCase(), pattern]);
        return true;
    }

    function defineMode(name, chars) {
        modes[name.toLowerCase()] = chars;
        return true;
    }

    function getMode(name) {
        var mode;
        if (typeof name === 'string') {
            mode = modes[name];
        }
        return mode || getMode(defaultMode);
    }

    function prepare(str) {
        var i, ret = str.trim().split(/\s+/); // Splits words
        for (i = 0; i < ret.length; i++) {
            ret[i] = ret[i].split(''); // Splits characters
        }
        // Returns multi-dimensional array ([word][char])
        return ret;
    }

    function repeat(str, repeat) {
        var i, ret = str;
        for (i = 0; i < repeat; i++) {
            ret += str;
        }
        return ret;
    }

    defineMode('classic', [
        '\u00B7',            // Middle dot
        '\u002D',            // Hyphen-minus
        '\u0020',            // Space
        repeat('\u0020', 3), // Space (x3)
        repeat('\u0020', 7)  // Space (x7)
    ]);
    defineMode('digital', [
        '\u0031',            // 1
        repeat('\u0031', 3), // 1 (x3)
        '\u0030',            // 0
        repeat('\u0030', 3), // 0 (x3)
        repeat('\u0030', 7)  // 0 (x7)
    ]);
    defineMode('simple', [
        '\u0030',            // 0
        '\u0031',            // 1
        '',                  // Nothing
        '\u002C',            // Comma
        '\u0020'             // Space
    ]);

    return {

        decode: function (str, mode) {
            var ret = '';
            mode = getMode(mode);
            // TODO
            return ret;
        },

        define: function (key, value) {
            if (typeof key === 'string') {
                switch (typeof value) {
                case 'object':
                    return defineMode(key, value);
                case 'string':
                    return defineChar(key, value);
                }
            }
            return false;
        },

        encode: function (str, mode) {
            var ret = '';
            mode = getMode(mode);
            // TODO
            return ret;
        }

    };

}());