module.exports = function (grunt) {
  grunt.initConfig({

    jshint: {
        all: [
          'test/*.js',
          'index.js'
        ]
    },
    mocha_istanbul: {
      coverage :{
        src: 'test',  //folder
        options: {
          mask: '*.js',
          reportFormats: ['cobertura', 'html']
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-istanbul');

  grunt.registerTask('test', ['jshint', 'mocha_istanbul:coverage']);
};
