var fs = require('fs');
var rimraf = require('rimraf'); // Recursive file removal

var lazydoc = require('../lazydoc.js');
var expect = require('chai').expect;

var gulp = require('gulp');

var IN = __dirname + '/programs',
    OUT = __dirname + '/out';

describe('lazydoc', function() {
    before(function(done) {
        rimraf(OUT, done); // Delete output directory to ensure no false positives in tests
    });
    
    it('should output the same number of files', function(done) {
        gulp.src([IN + '/**/*.js'])
            .pipe(lazydoc())
            .pipe(gulp.dest(OUT))
            .on('finish', function() {
                var lengths = [];
                function check(error, files) {
                    lengths.push(files.length);
                    if(lengths.length === 2) {
                        expect(lengths[0]).to.equal(lengths[1]);
                        done();
                    }
                }
                fs.readdir(IN, check);
                fs.readdir(OUT, check);
            });
    });
});