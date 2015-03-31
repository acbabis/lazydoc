var lazydoc = require('../lazydoc.js');
var expect = require('chai').expect;
var stream = require('stream');

describe('lazydoc', function() {
    it('should be a function', function() {
        expect(lazydoc).to.be.a('function');
    });
    
    it('should return a pipe', function() {
        expect(lazydoc()).to.be.an.instanceof(stream);
    });
    
    describe('#convert', function() {
        it('should be a function', function() {
            expect(lazydoc.convert).to.be.a('function');
        });
        
        it('should expect a String as the first parameter', function() {
            expect(function() {
                lazydoc.convert('a');
            }).not.to.throw();
            expect(function() {
                lazydoc.convert();
            }).to.throw();
        });
        
        it('should not take extra parameters', function() {
            expect(function() {
                lazydoc.convert('a', 'b');
            }).to.throw();
        });
        
        it('should return a String', function() {
            expect(lazydoc.convert('a')).to.be.a('string');
        });
    });
});