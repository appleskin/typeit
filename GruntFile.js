module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        connect: {
            server: {
                options: {
                    port: 8080,
                    base: './dist'
                } 
            }
        },
        concat: {
            js: {
                src: [  
                        'src/lib/**/*.js',
                        'src/game/**/*.js'
                     ],
                dest: 'dist/js/<%= pkg.name %>.js'
            },
            css: {
                src: [
                        'src/game/**/*.css'
                ],
                dest: 'dist/css/<%= pkg.name %>.css'
            },
            html: {
                src: [
                        'src/index.html'
                ],
                dest: 'dist/index.html'
            }
        },
        watch: {
            js: {
                files: 'src/**/*.js',
                tasks: ['concat'] 
            },
            css: {
                files: 'src/**/*.css',
                tasks: ['concat']
            },
            html: {
                files: 'src/index.html',
                tasks: ['concat']
            }
            
        },
        open: {
            dev: {
                path: 'http://localhost:8080/index.html'
            }
        }
    });

    grunt.registerTask('default', ['concat', 'connect', 'open', 'watch']);

}