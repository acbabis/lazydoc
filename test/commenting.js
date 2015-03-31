var fs = require('fs');

var expect = require('chai').expect;

var lazydoc = require('../lazydoc.js');
var assertComments = require('./util/assertComments.js');

describe('lazydoc', function() {
    it('should handle simple assignments', function(done) {
        fs.readFile(__dirname + '/programs/assignments.js', 'utf8', function(error, code) {
            assertComments(lazydoc.convert(code), [1, 2, 3, 4, 5, 6]);
            done();
        });
    });
    it('should handle for-loops', function(done) {
        fs.readFile(__dirname + '/programs/for-loop.js', 'utf8', function(error, code) {
            assertComments(lazydoc.convert(code), [1]);
            done();
        });
    });
    it('should handle functions', function(done) {
        fs.readFile(__dirname + '/programs/functions.js', 'utf8', function(error, code) {
            assertComments(lazydoc.convert(code), [1, 4, 7, 10, 13, 16]);
            done();
        });
    });
    it('should handle variable declarations', function(done) {
        fs.readFile(__dirname + '/programs/variables.js', 'utf8', function(error, code) {
            assertComments(lazydoc.convert(code), [1, 2, 3, 4, 5, 7, 8, 9, 11, 12, 13, 15, 16, 17, 18, 19]);
            done();
        });
    });
    it('should handle if-statements', function(done) {
        fs.readFile(__dirname + '/programs/if.js', 'utf8', function(error, code) {
            assertComments(lazydoc.convert(code), [1]);
            done();
        });
    });
    it('should not document programs that already have inline comments', function() {
        fs.readdirSync(__dirname + '/programs/alreadyCommented').forEach(function(filename) {
            var fn = __dirname + '/programs/alreadyCommented/' + filename;
            var input = fs.readFileSync(fn, 'utf8');
            var output = lazydoc.convert(input);
            
            expect(output).to.equal(input);
        });
    });
});