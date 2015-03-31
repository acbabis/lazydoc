var Lexer = require('lex');
var through2 = require('through2');

// Polyfill trim
if (!String.prototype.trim) {
  (function() {
    // Make sure we trim BOM and NBSP
    var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
    String.prototype.trim = function() {
      return this.replace(rtrim, '');
    };
  })();
}

// Finds word boundaries in a camelcase string converts the token
// to a phrase.
function deCamelCase(string) {
    return string.replace(/([a-z])([A-Z])/g, function(match, lower, upper) {
        return lower + ' ' + upper.toLowerCase();
    });
}

function convert(code) {
    // Error checking. Convert must take exactly one String argument
    if(arguments.length > 1) {
        throw new Error('Too many arguments to convert()');
    } else if(typeof code !== 'string') {
        throw new Error('convert expects a string as first parameter.`' + code + '`given')
    }
    var output = [];
    var noConvert = false;
    row = 1;
    new Lexer(function (char) {
        throw new Error("Unexpected character at row " + row + char);
    })
    
    // SHORT-CIRCUIT RULE
    //   Don't add comments to programs that alread have them
    .addRule(/^[\w\W]*\/\/[\w\W]*$/, function() {
        noConvert = true;
    })
    
    // FOR LOOPS
    .addRule(/.*for\s*\([^;]*; *(.*) *;.*\).*/, function (lexeme, conditional) {
        output.push(lexeme, ' // Loop while ', conditional);
    })
    
    // FUNCTIONS
    //   Function statement
    .addRule(/.*function\s*(\w+)\s*\(\s*(\w+(\s*,\s*\w+)*)?\s*\).*/, function (lexeme, name, params) {
        output.push(lexeme, ' // function to ', deCamelCase(name), params ? ' using ' + params.split(/\s*,\s*/).map(deCamelCase).join(' and ') : '');
    })
    //   Function expression
    .addRule(/.*var\s+(\w+)\s*=\s*function\s*(?:\w+)?\s*\(\s*(\w+(\s*,\s*\w+)*)?\s*\).*/, function (lexeme, name, params) {
        output.push(lexeme, ' // function to ', deCamelCase(name), params ? ' using ' + params.split(/\s*,\s*/).map(deCamelCase).join(' and ') : '');
    })
    
    // VARIABLE DECLARATIONS
    //   Without assignment
    .addRule(/\s*(?:var\s+)?(\w+)\s*(,|;).*/, function (lexeme, variable, ending) {
        output.push(lexeme, ' // declare ', variable, ending === ',' ? ', and ' : '');
    })
    //   With assignment
    .addRule(/\s*(?:var\s+)?(\w+)\s*=\s*(?!function)([^\s].*)\s*(,|;).*/, function (lexeme, variable, rval, ending) {
        // TODO: Figure out why this rule had higher precedence than
        // the function expression rule.
        output.push(lexeme, ' // declare and set ', variable, ' to ', rval, ending === ',' ? ', and ' : '');
    })
    
    // ASSIGNMENTS
    .addRule(/\s*(\w+)\s*=\s*(.*)\s*;.*/, function (lexeme, variable, rval) {
        output.push(lexeme, ' // set ', variable, ' to ', rval);
    })
    
    // CONDITIONALS
    .addRule(/.*if\s*\((.*)\).*/, function (lexeme, conditional) {
        output.push(lexeme, ' // Test to see if ', conditional);
    })
    
    // NEWLINES
    // None of the other rules match new lines.
    // Newlines are just passed through.
    .addRule(/(\r\n)|(\n\r)/, function (lexeme) {
        row++;
        output.push(lexeme);
    })
    .addRule(/\n/, function (lexeme) {
        row++;
        output.push(lexeme);
    })
    // Default case. Pass text through
    .addRule(/.*/, function (lexeme) { // Consuming entire line prevents part of a line from matching
        output.push(lexeme);
    })
    .setInput(code)
    .lex();
    return noConvert ? code : output.join('');
}

function getPipe() {
    return through2.obj(function(chunk, encoding, callback) {
        var input = chunk.contents.toString();
        var output = convert(input);
        chunk.contents = new Buffer(output);
        callback(null, chunk);
    });
}

getPipe.convert = convert;

module.exports = getPipe;