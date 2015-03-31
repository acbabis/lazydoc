var fs = require('fs');

var esprima = require('esprima');
var expect = require('chai').expect;

var lazydoc = require('../lazydoc.js');

describe('lazydoc', function() {
    it('should not change the code', function() {
        fs.readdirSync(__dirname + '/programs/').forEach(function(filename) {
            var fn = __dirname + '/programs/' + filename;
            if(fs.statSync(fn).isFile()) {
                var input = fs.readFileSync(fn, 'utf8');
                var output = lazydoc.convert(input);
                
                var inputTree = esprima.parse(input);
                var outputTree = esprima.parse(output);
                
                expect(JSON.stringify(outputTree)).to.equal(JSON.stringify(inputTree));
            }
        });
    });
});