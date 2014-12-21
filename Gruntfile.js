module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-karma');

    grunt.initConfig({
            pkg: grunt.file.readJSON('package.json'),

            conf: {
                dir: 'dist/',
                js: '<%= conf.dir %>js/',
                lib: '<%= conf.dir %>lib/',
                css: '<%= conf.dir %>css/',

                appJSName: '<%= pkg.name %>',
                appJS: '<%= conf.js %><%= conf.appJSName %>',
                angularJS: '<%= conf.lib %>angular'
            },

            concat: {
                options: {
                    separator: ';\n\n' +
                    '/* ------------------------------------------------------------------------ */' +
                    '\n\n'
                },

                prod: {
                    files: {
                        '<%= conf.appJS %>.min.js': ['src/**/**.js'],

                        '<%= conf.angularJS %>.min.js': [
                            // angular.js should be the first
                            'lib/angular/angular.js',
                            // then include another libs
                            'lib/angular/!(angular.js)*'
                        ]
                    }
                }
            },

            less: {
                prod: {
                    files: {
                        '<%= conf.css %>style.css': 'src/css/less/style.less'
                    }
                }
            },

            uglify: {
                prod: {
                    files: {
                        '<%= conf.appJS %>.min.js': '<%= conf.appJS %>.min.js',
                        '<%= conf.angularJS %>.min.js': '<%= conf.angularJS %>.min.js'
                    }
                }
            },

            copy: {
                prod: {
                    files: [
                        {
                            expand: true,
                            cwd: 'lib/',
                            src: ['**/**.min.js', '**/**.min.css', '**/**.map', '**/fonts/*.*'],
                            dest: '<%= conf.lib %>'
                        },

                        {
                            expand: true,
                            cwd: 'src/css/img',
                            src: '**/*.*',
                            dest: '<%= conf.css %>img/'
                        },

                        {
                            expand: true,
                            cwd: 'src/',
                            src: ['**/**.html', '!index.html'],
                            dest: '<%= conf.dir %>'
                        },
                    ]
                },

                index_html: {
                    src: 'src/index.html',
                    dest: '<%= conf.dir %>/index.html',
                    options: {
                        process: function (content, srcpath) {
                            return grunt.template.process(content, srcpath);
                        }
                    }
                }
            },

            clean: {
                prod: {
                    src: [
                        '<%= conf.dir %>'
                    ]
                },
                options: {
                    'no-warn': true
                }
            },

            karma: {
                unit: {
                    configFile: 'test/karma.conf.js'
                }
            }
        }
    )

    grunt.registerTask('dev', ['clean', 'concat', 'less', 'copy']);

    grunt.registerTask('prod', ['karma', 'clean', 'concat', 'less', 'uglify', 'copy']);

    grunt.registerTask('default', ['prod']);
}