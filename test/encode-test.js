'use strict';

// Load external dependencies.
var expect = require('expect.js');
var fs = require('fs');
var morjs = require('../mor.js');
var path = require('path');

// Run test suite.
describe('morjs.encode', function() {
  var input;

  var joinLines = function(str, mode) {
    return str.replace(/[\n]/g, mode.wordSpacer);
  };

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

  before(function(done) {
    loadFixture('input.txt', function(data) {
      input = data;

      done();
    });
  });

  it('should return an empty string if no message is provided', function() {
    expect(morjs.encode('')).to.be('');
  });

  it('should return an empty string if the message is empty', function() {
    expect(morjs.encode('')).to.be('');
    expect(morjs.encode('   ')).to.be('');
    expect(morjs.encode('  \n  \r  ')).to.be('');
  });

  it('should encode using "compact" mode by default', function(done) {
    loadFixture('output-compact.txt', function(data) {
      expect(morjs.encode(input)).to.be(joinLines(data, morjs.modes.compact));

      done();
    });
  });

  it('should encode using "classic" mode correctly', function(done) {
    loadFixture('output-classic.txt', function(data) {
      expect(morjs.encode(input, {mode: 'classic'})).to.be(joinLines(data, morjs.modes.classic));

      done();
    });
  });

  it.skip('should encode using "classicEntities" mode correctly', function(done) {
    loadFixture('output-classicEntities.txt', function(data) {
      expect(morjs.encode(input, {mode: 'classicEntities'})).to.be(joinLines(data, morjs.modes.classicEntities));

      done();
    });
  });

  it('should encode using "compact" mode correctly', function(done) {
    loadFixture('output-compact.txt', function(data) {
      expect(morjs.encode(input, {mode: 'compact'})).to.be(joinLines(data, morjs.modes.compact));

      done();
    });
  });

  it.skip('should encode using "compactEntities" mode correctly', function(done) {
    loadFixture('output-compactEntities.txt', function(data) {
      expect(morjs.encode(input, {mode: 'compactEntities'})).to.be(joinLines(data, morjs.modes.compactEntities));

      done();
    });
  });

  it.skip('should encode using "digital" mode correctly', function(done) {
    loadFixture('output-digital.txt', function(data) {
      expect(morjs.encode(input, {mode: 'digital'})).to.be(joinLines(data, morjs.modes.digital));

      done();
    });
  });

  it.skip('should encode using "simple" mode correctly', function(done) {
    loadFixture('output-simple.txt', function(data) {
      expect(morjs.encode(input, {mode: 'simple'})).to.be(joinLines(data, morjs.modes.simple));

      done();
    });
  });
});