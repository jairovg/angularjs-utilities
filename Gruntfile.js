module.exports = function (grunt) {
  'use strict';
  // Configurable paths for the application
  var appConfig = {
    app: require('./bower.json').appPath || 'src',
    demo: 'demo',
    dist: 'build'
  };

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt, {pattern: 'grunt-*'});

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  grunt.initConfig({
    // Project settings
    settings: appConfig,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      js: {
        files: ['<%= settings.app %>/{,**/}*.js'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      styles: {
        files: ['<%= settings.app %>/styles/{,*/}*.css'],
        tasks: ['newer:copy:styles', 'autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= settings.demo %>/{,**/}*.html',
          '<%= settings.app %>/{,**/}*.js',
          '.tmp/styles/{,*/}*.css',
          '<%= settings.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect().use(
                '/scripts',
                connect.static(appConfig.app)
              ),
              connect().use(
                '/templates',
                connect.static('./templates')
              ),
              connect.static(appConfig.demo)
            ];
          }
        }
      },
      test: {
        options: {
          port: 9001,
          middleware: function(connect) {
            return [
              connect.static('.tmp'),
              connect.static('test'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      documentation: {
        options: {
          port: 9002,
          open: true,
          middleware: function(connect) {
            return [
              connect.static('.tmp'),
              connect.static('docs'),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      dist: {
        options: {
          open: true,
          base: '<%= settings.dist %>'
        }
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= settings.dist %>/{,*/}*',
            '!<%= settings.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Automatically inject bower components into the app
    wiredep: {
      app: {
        src: ['<%= settings.app %>/index.html'],
        ignorePath: /\.\.\//
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= settings.app %>',
          dest: '<%= settings.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            '*.html',
            'views/{,*/}*.html',
            'images/{,*/}*.{webp}',
            'fonts/*'
          ]
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= settings.app %>/assets/css',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'test/karma.conf.js',
        singleRun: true
      }
    },

    // Documentation Tool
    ngdocs: {
      all: ['<%= settings.app %>/**/*.js']
    }
  });

  grunt.registerTask('serve', 'Compile then start a connect web server', function(target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'wiredep',
      'autoprefixer',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'autoprefixer',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('doc', [
    'clean:server',
    'ngdocs',
    'connect:documentation:keepalive'
  ]);
};