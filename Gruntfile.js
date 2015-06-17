module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    docco: {
      all: {
        options: {
          output: 'docs'
        },
        src: 'lib/mor.js'
      }
    },

    eslint: {
      target: [
        'Gruntfile.js',
        'lib/**/*.js',
        'test/**/*.js'
      ]
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*-test.js']
      }
    },

    uglify: {
      all: {
        files: {
          'dist/mor.min.js': 'lib/mor.js'
        },
        options: {
          banner: [
            '/*! <%= pkg.name %> v<%= pkg.version %> | (c) <%= grunt.template.today("yyyy") %>',
            ' <%= pkg.author.name %> | <%= pkg.licenses[0].type %> License\n',
            '*/'
          ].join(''),
          report: 'min',
          sourceMap: true,
          sourceMapName: 'dist/mor.min.map'
        }
      }
    },

    watch: {
      all: {
        files: 'lib/**/*.js',
        tasks: ['test']
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-docco');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('default', ['test']);
  grunt.registerTask('dist', ['test', 'uglify', 'docco']);
  grunt.registerTask('test', ['eslint', 'mochaTest']);
};
