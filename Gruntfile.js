module.exports = function(grunt) {
    grunt.initConfig({
        uglify: {
            build: {
                files: {
                    "js/deps.min.js": [
                        "bower_components/jquery/dist/jquery.min.js",
                        "bower_components/underscore/underscore-min.js",
                        "bower_components/bootstrap/dist/js/bootstrap.min.js",
                        "bower_components/alertify/alertify.min.js"
                    ],
                    "js/sol-fa.min.js": ["js/layout.js", "js/notes.js"]
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('minify', ['uglify']);

    grunt.registerTask('default', ['minify']);
};
