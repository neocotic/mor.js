'use strict';

// Load external dependencies.
var expect = require('expect.js');
var fs = require('fs');

// Load internal dependencies.
var morjs = require('../mor.js');

// Run test suite.
describe('morjs', function() {
  it('should be exported as an object', function() {
    expect(morjs).to.be.an(Object);
  });
});

describe('morjs.chars', function() {
  it('should return a map of available characters', function() {
    expect(morjs.chars).to.be.an(Object);
    expect(morjs.chars).not.to.be.empty();
  });

  it.skip('should be exensible', function() {
    // TODO: Complete
  });
});

describe('morjs.defaults', function() {
  it('should be defined correctly', function() {
    expect(morjs.defaults).to.be.an(Object);
    expect(morjs.defaults).to.have.property('mode', 'compact');
  });
});

describe('morjs.modes', function() {
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
      charSpacer:   '\u0020',
      letterSpacer: '\u0020\u0020\u0020',
      longString:   '\u002D',
      shortString:  '\u00B7',
      wordSpacer:   '\u0020\u0020\u0020\u0020\u0020\u0020\u0020'
    });
  });

  it('should have the "classicEntities" mode correctly defined', function() {
    expect(morjs.modes).to.have.property('classicEntities');
    expect(morjs.modes.classicEntities).to.eql({
      charSpacer:   '&nbsp;',
      letterSpacer: '&nbsp;&nbsp;&nbsp;',
      longString:   '&#45;',
      shortString:  '&middot;',
      wordSpacer:   '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
    });
  });

  it('should have the "compact" mode correctly defined', function() {
    expect(morjs.modes).to.have.property('compact');
    expect(morjs.modes.compact).to.eql({
      charSpacer:   '',
      letterSpacer: '\u0020',
      longString:   '\u002D',
      shortString:  '\u00B7',
      wordSpacer:   '\u0020\u0020\u0020'
    });
  });

  it('should have the "compactEntities" mode correctly defined', function() {
    expect(morjs.modes).to.have.property('compactEntities');
    expect(morjs.modes.compactEntities).to.eql({
      charSpacer:   '',
      letterSpacer: '&nbsp;',
      longString:   '&#45;',
      shortString:  '&middot;',
      wordSpacer:   '&nbsp;&nbsp;&nbsp;'
    });
  });

  it('should have the "simple" mode correctly defined', function() {
    expect(morjs.modes).to.have.property('simple');
    expect(morjs.modes.simple).to.eql({
      charSpacer:   '',
      letterSpacer: '\u0020',
      longString:   '\u002D',
      shortString:  '\u002E',
      wordSpacer:   '\n'
    });
  });

  it.skip('should be exensible', function() {
    // TODO: Complete
  });
});

describe('morjs.noConflict', function() {
  it('should return a reference to itself', function() {
    expect(morjs.noConflict()).to.be(morjs);
  });
});

describe('morjs.VERSION', function() {
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