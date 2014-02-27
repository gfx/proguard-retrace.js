// vim: set filetype=typescript:
///<reference path='../typescript-node-definitions/node.d.ts'/>

var fs = require("fs");

var mappingFile = "mapping.txt";
var stacktraceFile = "stacktrace.txt"

function readLines(file : string) : string[] {
  return fs.readFileSync(file).toString().split(/\n/);
}

var mapping = {}; // (fqName, Data)
var lineMapping = {};

function decode(mapping : any, line : string) : string {
  return line.replace(/\bat (\S+)\(SourceFile:(\d+)\)/, (matched, symbol, lineNumber, offset) => {
    var originalSymbol = mapping[symbol] || symbol.replace(/(\S+)\.([\w\$]+)$/, (matched, klass, member) => {
      console.warn([matched, klass, member]);
      return (mapping[klass] || klass) + "." + member;
    });

    if (originalSymbol) {
      var originalFile   = "SourceFile"; // TODO
      var originalLineNumber = (lineMapping[symbol] ? lineMapping[symbol][lineNumber] : null) || lineNumber;
      return "at " + originalSymbol + "(" + originalFile + ":" + originalLineNumber + ")";
    }
    else {
      console.warn("XXX: " + symbol);
      return matched;
    }
  });
}

var klass : string;
var originalKlass : string;
readLines(mappingFile).forEach((line) => {
  if (/^\S/.test(line)) { // class
    var matched = /(\S+) -> (\S+):/.exec(line);
    originalKlass = matched[1];
    klass = matched[2];

    lineMapping[klass] = {};
  }
  else if(/\S/.test(line)) { // field
    var matched = /(\S+)\s+(\S+) -> (\S+)/.exec(line);

    var lineAndType = matched[1];
    var originalName = /[\w\$]+/.exec(matched[2])[0];
    var name = matched[3];

    mapping[klass + "." + name] = originalKlass + "." + originalName;

    lineAndType.replace(/(\d+):(\d+)/, (_, to, from) => {
      lineMapping[klass][to] = from;
      return "dummy";
    });
  }
});

console.log(mapping)

readLines(stacktraceFile).forEach((line) => {
  console.log( decode(mapping, line) );
});

