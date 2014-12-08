module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');

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
                src: 
                [  
                    'src/lib/**/*.js',
                    'src/game/**/*.js'
                ],
                dest: 'dist/js/<%= pkg.name %>.js'
            },
            css: {
                src: 
                [
                    'src/game/**/*.css'
                ],
                dest: 'dist/css/<%= pkg.name %>.css'
            },
            html: {
                src: 
                [
                    'src/index.html'
                ],
                dest: 'dist/index.html'
            }
        },
        copy: {
            html: {
                src: 'src/index.html',
                dest: 'dist/index.html'
            },
            welcome: {
                src: 'src/welcome.html',
                dest: 'dist/welcome.html'
            },
            img: {
                src: 'img/*',
                dest: 'dist/'
            },
            vex: {
                src: 'vex/**',
                dest: 'dist/'
            }
        },
        watch: {
            js: {
                files: 'src/**/*.js',
                tasks: ['concat:js'] 
            },
            css: {
                files: 'src/**/*.css',
                tasks: ['concat:css']
            },
            html: {
                files: 'src/index.html',
                tasks: ['copy:html']
            },
            welcome: {
                files: 'src/welcome.html',
                tasks: ['copy:welcome']
            }
        },
        open: {
            dev: {
                path: 'http://localhost:8080/index.html'
            }
        }
    });

    grunt.registerTask('default', ['concat', 'copy']);
    grunt.registerTask('serve', ['concat', 'copy', 'connect', 'open', 'watch']);

};