'use strict';

// Load external dependencies.
var expect = require('expect.js');
var fs = require('fs');
var path = require('path');

// Load internal dependencies.
var morjs = require('../mor.js');

// Run test suite.
describe('morjs.encode', function() {
  var loadFixture = function(filePath, callback) {
    filePath = path.join('test', 'fixtures', filePath);

    fs.readFile(filePath, {encoding: 'utf8'}, function(error, data) {
      if (error) {
        throw error;
      } else {
        callback(data);
      }
    });
  };

  it('should return an empty string if no message is provided', function() {
    expect(morjs.encode('')).to.be('');
  });

  it('should return an empty string if the message is empty', function() {
    expect(morjs.encode('')).to.be('');
    expect(morjs.encode('   ')).to.be('');
    expect(morjs.encode('  \n  \r  ')).to.be('');
  });

  it('should encode all characters correctly', function(done) {
    loadFixture('encoded.txt', function(encoded) {
      loadFixture('decoded.txt', function(decoded) {
        expect(morjs.encode(decoded)).to.be(encoded.replace(/\n/g, morjs.modes.compact.wordSpacer));

        done();
      });
    });
  });

  it('should encode using "compact" mode by default', function() {
    expect(morjs.encode('SOS', {mode: 'compact'})).to.be([
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
    ].join('\n'));
  });
});