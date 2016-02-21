var system = require('system');
console.log('-----------------------------------');
console.log('ECHO.JS - INPUT ARGUMENTS');
console.log('-----------------------------------');
console.log(system.args.slice(4).join('\n'));
console.log('-----------------------------------');
casper.test.done();