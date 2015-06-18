'use strict';

var expect = require('expect.js');
var fs = require('fs');
var path = require('path');
var q = require('q');

var morjs = require('../lib/mor');

/**
 * The regular expression used to find and replace EOL characters.
 *
 * @type {RegExp}
 */
var rEOL = /[\n\r]+/g;

/**
 * Loads the contents of a test fixture asynchronously.
 *
 * @param {String} filePath - the path to the file of the test fixture to be loaded
 * @returns {q.Promise} A promise to track the file loading.
 */
function loadFixture(filePath) {
  filePath = path.join('test', 'fixtures', filePath);

  return q.nfcall(fs.readFile, filePath, {encoding: 'utf8'})
  .then(function(fixture) {
    return fixture.trim();
  });
}

describe('morjs', function() {
  afterEach(function() {
    delete morjs.modes.foo;
  });

  it('should be exported as an object', function() {
    expect(morjs).to.be.an(Object);
  });

  describe('.chars', function() {
    afterEach(function() {
      delete morjs.chars['\u039B'];
    });

    it('should return a map of available characters', function(done) {
      expect(morjs.chars).to.be.an(Object);
      expect(morjs.chars).not.to.be.empty();

      loadFixture('characters.txt')
      .then(function(characters) {
        expect(morjs.chars).to.only.have.keys(characters.split(rEOL));
      })
      .then(done)
      .done();
    });

    it('should be exensible', function() {
      var options = {mode: 'simple'};

      expect(morjs.encode('\u03BB', options)).to.be('');

      morjs.chars['\u039B'] = 'LLLLLSSSSS';

      expect(morjs.encode('\u03BB', options)).to.be('-----.....');
      expect(morjs.encode('\u039B', options)).to.be('-----.....');
    });
  });

  describe('.defaults', function() {
    it('should be defined correctly', function() {
      expect(morjs.defaults).to.be.an(Object);
      expect(morjs.defaults).to.have.property('mode', 'compact');
    });
  });

  describe('.modes', function() {
    it('should return a map of available modes', function() {
      expect(morjs.modes).to.be.an(Object);
      expect(morjs.modes).to.only.have.keys([
        'classic',
        'classicEntities',
        'compact',
        'compactEntities',
        'simple'
      ]);
    });

    it('should have the "classic" mode correctly defined', function() {
      expect(morjs.modes).to.have.property('classic');
      expect(morjs.modes.classic).to.eql({
        charSpacer: '\u0020',
        letterSpacer: '\u0020\u0020\u0020',
        longString: '\u002D',
        shortString: '\u00B7',
        wordSpacer: '\u0020\u0020\u0020\u0020\u0020\u0020\u0020'
      });
    });

    it('should have the "classicEntities" mode correctly defined', function() {
      expect(morjs.modes).to.have.property('classicEntities');
      expect(morjs.modes.classicEntities).to.eql({
        charSpacer: '&nbsp;',
        letterSpacer: '&nbsp;&nbsp;&nbsp;',
        longString: '&#45;',
        shortString: '&middot;',
        wordSpacer: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
      });
    });

    it('should have the "compact" mode correctly defined', function() {
      expect(morjs.modes).to.have.property('compact');
      expect(morjs.modes.compact).to.eql({
        charSpacer: '',
        letterSpacer: '\u0020',
        longString: '\u002D',
        shortString: '\u00B7',
        wordSpacer: '\u0020\u0020\u0020'
      });
    });

    it('should have the "compactEntities" mode correctly defined', function() {
      expect(morjs.modes).to.have.property('compactEntities');
      expect(morjs.modes.compactEntities).to.eql({
        charSpacer: '',
        letterSpacer: '&nbsp;',
        longString: '&#45;',
        shortString: '&middot;',
        wordSpacer: '&nbsp;&nbsp;&nbsp;'
      });
    });

    it('should have the "simple" mode correctly defined', function() {
      expect(morjs.modes).to.have.property('simple');
      expect(morjs.modes.simple).to.eql({
        charSpacer: '',
        letterSpacer: '\u0020',
        longString: '\u002D',
        shortString: '\u002E',
        wordSpacer: '\u0020\u0020\u0020'
      });
    });

    it('should be exensible', function() {
      var options = {mode: 'foo'};

      expect(morjs.modes).not.to.have.key('foo');

      morjs.modes.foo = {
        charSpacer: '',
        letterSpacer: '\u0020',
        longString: '\u0046',
        shortString: '\u004F',
        wordSpacer: '\u0020\u0020\u0020'
      };

      expect(morjs.encode('SOS', options)).to.be([
        'OOO',
        'FFF',
        'OOO'
      ].join(' '));

      expect(morjs.decode([
        'OOO',
        'FFF',
        'OOO'
      ].join(' '), options)).to.be('SOS');
    });
  });

  describe('.decode', function() {
    it('should return an empty string if no message is provided', function() {
      expect(morjs.decode('')).to.be('');
    });

    it('should return an empty string if the message is empty', function() {
      expect(morjs.decode('')).to.be('');
      expect(morjs.decode('   ')).to.be('');
      expect(morjs.decode('  \n  \r  ')).to.be('');
    });

    it('should convert message to string', function() {
      function ToString() {
        this.toString = function() {
          return '\u00B7\u002D';
        };
      }

      expect(morjs.decode(new ToString())).to.be('A');
    });

    it('should throw an error if mode does not exist', function() {
      expect(morjs.decode).withArgs('foo', {mode: 'foo'}).to.throwError();
    });

    it('should decode all characters correctly', function(done) {
      q.spread([loadFixture('encoded.txt'), loadFixture('decoded.txt')], function(encoded, decoded) {
        expect(morjs.decode(encoded)).to.be(decoded.replace(rEOL, ' '));
      })
      .then(done)
      .done();
    });

    it('should decode using "compact" mode by default', function() {
      expect(morjs.decode([
        '\u00B7\u00B7\u00B7',
        '---',
        '\u00B7\u00B7\u00B7'
      ].join(' '))).to.be('SOS');
    });

    it('should decode using "classic" mode correctly', function() {
      var options = {mode: 'classic'};

      expect(morjs.decode([
        '\u00B7 \u00B7 \u00B7',
        '- - -',
        '\u00B7 \u00B7 \u00B7'
      ].join('   '), options)).to.be('SOS');

      expect(morjs.decode([
        [
          '\u00B7 \u00B7 \u00B7',
          '\u00B7 -',
          '\u00B7 \u00B7 \u00B7 -',
          '\u00B7'
        ].join('   '),
        [
          '- - -',
          '\u00B7 \u00B7 -',
          '\u00B7 - \u00B7'
        ].join('   '),
        [
          '\u00B7 \u00B7 \u00B7',
          '- - -',
          '\u00B7 \u00B7 -',
          '\u00B7 - \u00B7 \u00B7',
          '\u00B7 \u00B7 \u00B7'
        ].join('   ')
      ].join('       '), options)).to.be('SAVE OUR SOULS');
    });

    it('should decode using "classicEntities" mode correctly', function() {
      var options = {mode: 'classicEntities'};

      expect(morjs.decode([
        '&middot;&nbsp;&middot;&nbsp;&middot;',
        '&#45;&nbsp;&#45;&nbsp;&#45;',
        '&middot;&nbsp;&middot;&nbsp;&middot;'
      ].join('&nbsp;&nbsp;&nbsp;'), options)).to.be('SOS');

      expect(morjs.decode([
        [
          '&middot;&nbsp;&middot;&nbsp;&middot;',
          '&middot;&nbsp;&#45;',
          '&middot;&nbsp;&middot;&nbsp;&middot;&nbsp;&#45;',
          '&middot;'
        ].join('&nbsp;&nbsp;&nbsp;'),
        [
          '&#45;&nbsp;&#45;&nbsp;&#45;',
          '&middot;&nbsp;&middot;&nbsp;&#45;',
          '&middot;&nbsp;&#45;&nbsp;&middot;'
        ].join('&nbsp;&nbsp;&nbsp;'),
        [
          '&middot;&nbsp;&middot;&nbsp;&middot;',
          '&#45;&nbsp;&#45;&nbsp;&#45;',
          '&middot;&nbsp;&middot;&nbsp;&#45;',
          '&middot;&nbsp;&#45;&nbsp;&middot;&nbsp;&middot;',
          '&middot;&nbsp;&middot;&nbsp;&middot;'
        ].join('&nbsp;&nbsp;&nbsp;')
      ].join('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'), options)).to.be('SAVE OUR SOULS');
    });

    it('should decode using "compact" mode correctly', function() {
      var options = {mode: 'compact'};

      expect(morjs.decode([
        '\u00B7\u00B7\u00B7',
        '---',
        '\u00B7\u00B7\u00B7'
      ].join(' '), options)).to.be('SOS');

      expect(morjs.decode([
        [
          '\u00B7\u00B7\u00B7',
          '\u00B7-',
          '\u00B7\u00B7\u00B7-',
          '\u00B7'
        ].join(' '),
        [
          '---',
          '\u00B7\u00B7-',
          '\u00B7-\u00B7'
        ].join(' '),
        [
          '\u00B7\u00B7\u00B7',
          '---',
          '\u00B7\u00B7-',
          '\u00B7-\u00B7\u00B7',
          '\u00B7\u00B7\u00B7'
        ].join(' ')
      ].join('   '), options)).to.be('SAVE OUR SOULS');
    });

    it('should decode using "compactEntities" mode correctly', function() {
      var options = {mode: 'compactEntities'};

      expect(morjs.decode([
        '&middot;&middot;&middot;',
        '&#45;&#45;&#45;',
        '&middot;&middot;&middot;'
      ].join('&nbsp;'), options)).to.be('SOS');

      expect(morjs.decode([
        [
          '&middot;&middot;&middot;',
          '&middot;&#45;',
          '&middot;&middot;&middot;&#45;',
          '&middot;'
        ].join('&nbsp;'),
        [
          '&#45;&#45;&#45;',
          '&middot;&middot;&#45;',
          '&middot;&#45;&middot;'
        ].join('&nbsp;'),
        [
          '&middot;&middot;&middot;',
          '&#45;&#45;&#45;',
          '&middot;&middot;&#45;',
          '&middot;&#45;&middot;&middot;',
          '&middot;&middot;&middot;'
        ].join('&nbsp;')
      ].join('&nbsp;&nbsp;&nbsp;'), options)).to.be('SAVE OUR SOULS');
    });

    it('should decode using "simple" mode correctly', function() {
      var options = {mode: 'simple'};

      expect(morjs.decode([
        '...',
        '---',
        '...'
      ].join(' '), options)).to.be('SOS');

      expect(morjs.decode([
        [
          '...',
          '.-',
          '...-',
          '.'
        ].join(' '),
        [
          '---',
          '..-',
          '.-.'
        ].join(' '),
        [
          '...',
          '---',
          '..-',
          '.-..',
          '...'
        ].join(' ')
      ].join('   '), options)).to.be('SAVE OUR SOULS');
    });
  });

  describe('.encode', function() {
    it('should return an empty string if no message is provided', function() {
      expect(morjs.encode('')).to.be('');
    });

    it('should return an empty string if the message is empty', function() {
      expect(morjs.encode('')).to.be('');
      expect(morjs.encode('   ')).to.be('');
      expect(morjs.encode('  \n  \r  ')).to.be('');
    });

    it('should ignore case', function() {
      expect(morjs.encode('foo')).to.be(morjs.encode('FOO'));
    });

    it('should convert message to string', function() {
      function ToString() {
        this.toString = function() {
          return 'A';
        };
      }

      expect(morjs.encode(new ToString())).to.be('\u00B7\u002D');
    });

    it('should throw an error if mode does not exist', function() {
      expect(morjs.encode).withArgs('foo', {mode: 'foo'}).to.throwError();
    });

    it('should encode all characters correctly', function(done) {
      q.spread([loadFixture('encoded.txt'), loadFixture('characters.txt')], function(encoded, characters) {
        expect(morjs.encode(characters)).to.be(encoded.replace(rEOL, morjs.modes.compact.wordSpacer));
      })
      .then(done)
      .done();
    });

    it('should encode using "compact" mode by default', function() {
      expect(morjs.encode('SOS')).to.be([
        '\u00B7\u00B7\u00B7',
        '---',
        '\u00B7\u00B7\u00B7'
      ].join(' '));
    });

    it('should encode using "classic" mode correctly', function() {
      var options = {mode: 'classic'};

      expect(morjs.encode('SOS', options)).to.be([
        '\u00B7 \u00B7 \u00B7',
        '- - -',
        '\u00B7 \u00B7 \u00B7'
      ].join('   '));

      expect(morjs.encode('save our souls', options)).to.be([
        [
          '\u00B7 \u00B7 \u00B7',
          '\u00B7 -',
          '\u00B7 \u00B7 \u00B7 -',
          '\u00B7'
        ].join('   '),
        [
          '- - -',
          '\u00B7 \u00B7 -',
          '\u00B7 - \u00B7'
        ].join('   '),
        [
          '\u00B7 \u00B7 \u00B7',
          '- - -',
          '\u00B7 \u00B7 -',
          '\u00B7 - \u00B7 \u00B7',
          '\u00B7 \u00B7 \u00B7'
        ].join('   ')
      ].join('       '));
    });

    it('should encode using "classicEntities" mode correctly', function() {
      var options = {mode: 'classicEntities'};

      expect(morjs.encode('SOS', options)).to.be([
        '&middot;&nbsp;&middot;&nbsp;&middot;',
        '&#45;&nbsp;&#45;&nbsp;&#45;',
        '&middot;&nbsp;&middot;&nbsp;&middot;'
      ].join('&nbsp;&nbsp;&nbsp;'));

      expect(morjs.encode('save our souls', options)).to.be([
        [
          '&middot;&nbsp;&middot;&nbsp;&middot;',
          '&middot;&nbsp;&#45;',
          '&middot;&nbsp;&middot;&nbsp;&middot;&nbsp;&#45;',
          '&middot;'
        ].join('&nbsp;&nbsp;&nbsp;'),
        [
          '&#45;&nbsp;&#45;&nbsp;&#45;',
          '&middot;&nbsp;&middot;&nbsp;&#45;',
          '&middot;&nbsp;&#45;&nbsp;&middot;'
        ].join('&nbsp;&nbsp;&nbsp;'),
        [
          '&middot;&nbsp;&middot;&nbsp;&middot;',
          '&#45;&nbsp;&#45;&nbsp;&#45;',
          '&middot;&nbsp;&middot;&nbsp;&#45;',
          '&middot;&nbsp;&#45;&nbsp;&middot;&nbsp;&middot;',
          '&middot;&nbsp;&middot;&nbsp;&middot;'
        ].join('&nbsp;&nbsp;&nbsp;')
      ].join('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'));
    });

    it('should encode using "compact" mode correctly', function() {
      var options = {mode: 'compact'};

      expect(morjs.encode('SOS', options)).to.be([
        '\u00B7\u00B7\u00B7',
        '---',
        '\u00B7\u00B7\u00B7'
      ].join(' '));

      expect(morjs.encode('save our souls', options)).to.be([
        [
          '\u00B7\u00B7\u00B7',
          '\u00B7-',
          '\u00B7\u00B7\u00B7-',
          '\u00B7'
        ].join(' '),
        [
          '---',
          '\u00B7\u00B7-',
          '\u00B7-\u00B7'
        ].join(' '),
        [
          '\u00B7\u00B7\u00B7',
          '---',
          '\u00B7\u00B7-',
          '\u00B7-\u00B7\u00B7',
          '\u00B7\u00B7\u00B7'
        ].join(' ')
      ].join('   '));
    });

    it('should encode using "compactEntities" mode correctly', function() {
      var options = {mode: 'compactEntities'};

      expect(morjs.encode('SOS', options)).to.be([
        '&middot;&middot;&middot;',
        '&#45;&#45;&#45;',
        '&middot;&middot;&middot;'
      ].join('&nbsp;'));

      expect(morjs.encode('save our souls', options)).to.be([
        [
          '&middot;&middot;&middot;',
          '&middot;&#45;',
          '&middot;&middot;&middot;&#45;',
          '&middot;'
        ].join('&nbsp;'),
        [
          '&#45;&#45;&#45;',
          '&middot;&middot;&#45;',
          '&middot;&#45;&middot;'
        ].join('&nbsp;'),
        [
          '&middot;&middot;&middot;',
          '&#45;&#45;&#45;',
          '&middot;&middot;&#45;',
          '&middot;&#45;&middot;&middot;',
          '&middot;&middot;&middot;'
        ].join('&nbsp;')
      ].join('&nbsp;&nbsp;&nbsp;'));
    });

    it('should encode using "simple" mode correctly', function() {
      var options = {mode: 'simple'};

      expect(morjs.encode('SOS', options)).to.be([
        '...',
        '---',
        '...'
      ].join(' '));

      expect(morjs.encode('save our souls', options)).to.be([
        [
          '...',
          '.-',
          '...-',
          '.'
        ].join(' '),
        [
          '---',
          '..-',
          '.-.'
        ].join(' '),
        [
          '...',
          '---',
          '..-',
          '.-..',
          '...'
        ].join(' ')
      ].join('   '));
    });
  });

  describe('.noConflict', function() {
    it('should return a reference to itself', function() {
      expect(morjs.noConflict()).to.be(morjs);
    });
  });

  describe('.VERSION', function() {
    it('should match version in bower.json', function(done) {
      fs.readFile('bower.json', {encoding: 'utf8'}, function(error, data) {
        if (error) {
          throw error;
        } else {
          expect(morjs.VERSION).to.be(JSON.parse(data).version);

          done();
        }
      });
    });

    it('should match version in package.json', function(done) {
      fs.readFile('package.json', {encoding: 'utf8'}, function(error, data) {
        if (error) {
          throw error;
        } else {
          expect(morjs.VERSION).to.be(JSON.parse(data).version);

          done();
        }
      });
    });
  });
});
