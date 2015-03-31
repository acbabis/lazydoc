var expect = require('chai').expect;

var COMMENT_LINE = /.*\/\/[\s]*[^\s]+/; // Line with a non-empty comment
var NEWLINE = /(\\r\\n)|(\\n\\r)|\\n/;

// assertComments will assert that 
// Content of the comments is not tested with this
// utility because the content doesn't matter :)
module.exports = function(source, lineNumbers) {
    var lines = source.split('\r\n');
    lineNumbers.forEach(function(number) {
        expect(lines[number-1]).to.match(COMMENT_LINE);
    });
}