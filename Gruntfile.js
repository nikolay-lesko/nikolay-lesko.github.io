module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.initConfig({
            dist: {
                dir: 'dist/',
                js: '<%= dist.dir %>js/',
                lib: '<%= dist.dir %>lib/',
                css: '<%= dist.dir %>css/',

                banner: '/*\n\n<%= pkg.name %> <%= pkg.version %>\n\n*/\n\n\n'
            },

            pkg: grunt.file.readJSON('package.json'),

            concat: {
                options: {
                    separator: ';\n\n' +
                    '/* ------------------------------------------------------------------------ */' +
                    '\n\n'
                },

                js: {
                    src: ['src/**/**.js'],
                    dest: '<%= dist.js %><%= pkg.name %>.js',
                    options: {
                        banner: '<%= dist.banner %>'
                    }
                },

                angular: {
                    src: [
                        // angular.js should be the first
                        'lib/angular/angular.js',
                        // then include another libs
                        'lib/angular/!(angular.js)*',
                        'lib/bootstrap-gh-pages/ui-bootstrap-tpls-0.9.0.js',
                        'lib/ui-utils-0.1.1/ui-utils.js'
                    ],
                    dest: '<%= dist.lib %>angular.js'
                }
            },

            less: {
                main: {
                    src: 'src/css/less/style.less',
                    dest: '<%= dist.css %>style.css'
                }
            },

            uglify: {
                js: {
                    src: '<%= concat.js.dest %>',
                    dest: '<%= dist.js %><%= pkg.name %>.min.js'
                    ,
                    options: {
                        banner: '<%= dist.banner %>'
                    }
                },
                angular: {
                    src: '<%= concat.angular.dest %>',
                    dest: '<%= dist.lib %>angular.min.js',
                    options: {
                        banner: '/*\n\nAngularJS v1.2.5\n\n*/\n'
                    }
                }
            },

            copy: {
                bootstrap: {
                    files: [
                        {
                            src: 'lib/bootstrap-3.3.1-dist/css/bootstrap.min.css',
                            dest: '<%= dist.lib %>bootstrap/css/bootstrap.min.css'
                        },
                        {
                            expand: true,
                            src: 'lib/bootstrap-3.3.1-dist/fonts/*.*',
                            dest: '<%= dist.lib %>bootstrap/fonts/',
                            flatten: true
                        },
                        {
                            src: 'lib/bootstrap-3.3.1-dist/js/bootstrap.min.js',
                            dest: '<%= dist.lib %>bootstrap/js/bootstrap.min.js'
                        }
                    ]
                },

                jquery: {
                    src: ['lib/jquery-1.9.1.min.js'],
                    dest: '<%= dist.lib %>jquery.min.js'
                },

                underscore: {
                    src: ['lib/underscore-min.js'],
                    dest: '<%= dist.lib %>underscore-min.js'
                },

                html: {
                    expand: true,
                    cwd: 'src/',
                    src: ['**/**.html', '!index.html'],
                    dest: '<%= dist.dir %>'
                },

                html_index: {
                    src: 'src/index.html',
                    dest: '<%= dist.dir %>index.html',
                    options: {
                        process: function (content, srcpath) {
                            return grunt.template.process(content, srcpath);
                        }
                    }
                },

                img: {
                    expand: true,
                    cwd: 'src/css/img',
                    src: '**/*.*',
                    dest: '<%= dist.css %>img/'
                },

                dev: {
                    files: [
                        {src: '<%= concat.js.dest %>', dest: '<%= uglify.js.dest %>'},
                        {src: '<%= concat.angular.dest %>', dest: '<%= uglify.angular.dest %>'}
                    ]
                }
            },

            clean: [
                '<%= dist.dir %>'
            ]
        }
    )

    grunt.registerTask('default', ['clean', 'concat', 'less', 'uglify', 'copy']);

    grunt.registerTask('dev', ['clean', 'concat', 'less', 'copy', 'copy:dev']);
}