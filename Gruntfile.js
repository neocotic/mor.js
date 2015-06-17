module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    blanket: {
      coverage: {
        src: ['lib'],
        dest: 'coverage/lib'
      }
    },

    clean: {
      coverage: ['coverage'],
      dist: ['dist', 'docs']
    },

    copy: {
      coverage: {
        expand: true,
        src: ['test/**'],
        dest: 'coverage/'
      }
    },

    coveralls: {
      options: {
        force: true
      },
      coverage: {
        src: ['coverage/lcov.info']
      }
    },

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
        'bin/morjs',
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
      },
      coverage: {
        options: {
          captureFile: 'coverage/results.html',
          quiet: true,
          reporter: 'html-cov'
        },
        src: ['coverage/test/**/*-test.js']
      },
      lcov: {
        options: {
          captureFile: 'coverage/lcov.info',
          quiet: true,
          reporter: 'mocha-lcov-reporter'
        },
        src: ['coverage/test/**/*-test.js']
      },
      'travis-cov': {
        options: {
          reporter: 'travis-cov'
        },
        src: ['coverage/test/**/*-test.js']
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

  grunt.loadNpmTasks('grunt-blanket');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-coveralls');
  grunt.loadNpmTasks('grunt-docco');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('default', ['test']);
  grunt.registerTask('dist', ['test', 'clean:dist', 'uglify', 'docco']);
  grunt.registerTask('test', ['eslint', 'clean:coverage', 'blanket', 'copy:coverage', 'mochaTest']);
};
