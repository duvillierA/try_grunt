 module.exports = function(grunt) {

  /*
  Tree :
    src/less/\*\/*.less
    src/scripts/\*\/*.js
    dist/js/*.min.js == test+concat+minify
    dist/js/*.js  ==  test+concat+beautify
    dist/css/*.css == compile+beautify
    dist/css/*.min.css == compile+minify
  */

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n\n',

    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['src/**/*.js'],
        dest: 'dist/js/<%= pkg.name %>.js'
      }
    },

    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        options : {
          report: 'min'
        },
        files: {
          'dist/js/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      },
      beautify: {
        options : {
          compress: false,
          beautify: true,
          preserveComments: 'some'
        },
        files: {
          '<%= concat.dist.dest %>': ['<%= concat.dist.dest %>']
        }
      }
    },

    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    recess: {
      options: {
        compile: true,
        banner: '<%= banner %>'
      },
      bootstrap: {
        src: ['src/**/bootstrap.less'],
        dest: 'dist/css/<%= pkg.name %>.css'
      },
      bootstrap_min: {
        options: {
          compress: true
        },
        src: ['<%= recess.bootstrap.src %>'],
        dest: 'dist/css/<%= pkg.name %>.min.css'
      }
    },

    connect: {
      options: {
        port: 8000,
        hostname: 'localhost',
        base:'.',
        livereload: 35729
      },
      livereload: {
       options: {
         open: true,
         base: [
           '.'
         ]
       }
     }
    },
    watch: {
     js : {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint', 'concat', 'uglify']
     },
     recess : {
      files: ['<%= recess.bootstrap.src %>'],
      tasks: ['recess']
     },
     livereload: {
       options: {
         livereload: '<%= connect.options.livereload %>'
       },
       files: [
         '<%= jshint.files %>'
       ]
     }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-recess');

  grunt.registerTask('test', ['jshint']);
  // Less distribution task.
  grunt.registerTask('dist-css', ['recess']);
  // JS distribution task.
  grunt.registerTask('dist-js', ['concat', 'uglify']);
  // Default task.
  grunt.registerTask('default', ['test', 'dist-js', 'dist-css']);
  // Launch server.
  grunt.registerTask('server', ['connect', 'watch']);

};
