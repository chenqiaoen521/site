module.exports = function(grunt){
    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);
    grunt.initConfig({
        watch: {
            jade: {
                files: ['views/**'],
                options: {
                    livereliad: true
                }
            },
            js: {
                files: ['public/js/**', 'models/**/*.js', 'schemas/**/*.js'],
                // tasks: ['jshint']
                options: {
                    livereload: true
                }
            }
        },
        nodemon: {
            dev: {
                options: {
                    file: 'app.js',
                    args: [],
                    ignoredFiles: ['README.MD', 'node_modules/**', 'DS_Store'],
                    watchedExtensions: ['js'],
                    watchedFolders: ['./'],
                    debug: true,
                    delayTime: 1,
                    env: {
                        PORT: 3000
                    },
                    cwd: __dirname
                }
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                ignores: ['public/libs/**/*.js']
            },
            all: ['public/js/*.js', 'test/**/*.js', 'app/**/*.js']
        },
        mochaTest:{
            options:{
                reporter:'spec'
            },
            src:['test/**/*.js']
        },
        concurrent: {
            tasks: ['nodemon', 'watch','jshint'],
            options: {
                logConcurrentOutput: true
            }
        }
    })
    /*grunt.loadNpmTasks('grunt-contrib-watch')
    grunt.loadNpmTasks('grunt-nodemon')
    grunt.loadNpmTasks('grunt-concurrent')
    grunt.loadNpmTasks('grunt-mocha-test')
    grunt.loadNpmTasks('grunt-contrib-jshint')*/

    grunt.option('force',true)
    grunt.registerTask('default', ['concurrent'])
    grunt.registerTask('test',['mochaTest'])
}