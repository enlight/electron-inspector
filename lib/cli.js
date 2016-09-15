// Copyright (c) 2016 Vadim Macagon
// MIT License, see LICENSE file for full terms.
"use strict";
const yargs = require("yargs");
const index_1 = require("./index");
const argv = yargs
    .usage('Usage: $0 [options]')
    .option('debug-port', {
    alias: 'd',
    type: 'number',
    default: 5858,
    describe: 'Debug port of the Electron process you wish to debug.'
})
    .option('web-host', {
    type: 'string',
    default: '0.0.0.0',
    describe: "Host to listen on for node-inspector's web interface."
})
    .option('web-port', {
    alias: ['p', 'port'],
    type: 'number',
    default: 8080,
    describe: "Port to listen on for node-inspector's web interface."
})
    .option('save-live-edit', {
    type: 'boolean',
    default: false,
    describe: 'Save live edit changes to disk (update the edited files).'
})
    .option('preload', {
    type: 'boolean',
    default: true,
    describe: 'Preload *.js files. You can disable this option to speed up the startup.'
})
    .option('inject', {
    type: 'boolean',
    default: true,
    description: 'Enable/disable injection of debugger extensions into the debugged process.\n' +
        "It's posible to disable only some of the injections using subkeys.\n" +
        'Available subkeys: network, profiles, console'
})
    .option('hidden', {
    type: 'string',
    describe: 'Array of files to hide from the UI.' +
        'Breakpoints in these files will be ignored.\n' +
        'All paths are interpreted as regular expressions.'
})
    .option('stack-trace-limit', {
    type: 'number',
    default: 50,
    describe: 'Number of stack frames to show on a breakpoint.'
})
    .option('ssl-key', {
    type: 'string',
    describe: 'A file containing a valid SSL key.'
})
    .option('ssl-cert', {
    type: 'string',
    describe: 'A file containing a valid SSL certificate.'
})
    .option('electron', {
    type: 'string',
    describe: 'Path to the Electron executable that should be used to run node-inspector.'
})
    .option('auto-rebuild', {
    type: 'boolean',
    default: true,
    describe: 'Toggle automatic rebuild of native node-inspector modules,\n' +
        'this only works if electron-rebuild is installed.'
})
    .help()
    .argv;
index_1.inspect(argv);
