module.exports = function(grunt) {
    grunt.loadNpmTasks("grunt-tslint");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.initConfig({
        tslint: {
          configuration: "tslint.json",
          code: {
            src: ["src/**/*.ts"]
          },
          tests: {
            tests: ["test/**/*.ts"]
          }
        },
        clean: {
            all: ["dist/**/*"],
            code: ["dist/**/*", "!dist/test/**"],
            tests: ["dist/test/**/*"],
            distTs: ["dist/**/*.ts"]
        },
        copy: {
            code: {
                files: [{
                    expand: true,
                    cwd: "src",
                    src: ["**"],
                    dest: "dist",
                }],
            },
            tests: {
                files: [{
                    expand: true,
                    cwd: "test",
                    src: ["**"],
                    dest: "dist/test",
                }],
            }
        },
        ts: {
            default: {
                src: ["dist/**/*.ts"],
                options: {
                    sourceMap: false,
                    allowSyntheticDefaultImports: true,
                    fast: "never"
                }
            }
        },
        mochaTest: {
          test: {
            src: ['dist/test/**/*.js']
          }
        },
        watch: {
            code: {
                files: ["src/**/*.js", "src/**/*.ts"],
                tasks: ["validateCode", "buildCode", "runTests"],
                options: {
                    interrupt: true,
                    atBegin: true
                }
            },
            tests: {
              files: ["test/**/*.ts"],
              tasks: ["validateTests", "buildTests", "runTests"],
              options: {
                  interrupt: true,
                  atBegin: true
              }
            }
        }
    });



    grunt.registerTask("default", ["clean:all", "validateCode", "buildCode", "validateTests", "buildTests", "runTests"]);

    // Code
    grunt.registerTask("validateCode", ["tslint:code"]);
    grunt.registerTask("buildCode", ["clean:code", "copy:code", "ts", "clean:distTs"]);

    // Tests
    grunt.registerTask("validateTests", ["tslint:tests"]);
    grunt.registerTask("buildTests", ["clean:tests", "copy:tests", "ts", "clean:distTs"]);
    grunt.registerTask("runTests", ["mochaTest"]);

};
