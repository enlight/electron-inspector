// Copyright (c) 2016 Vadim Macagon
// MIT License, see LICENSE file for full terms.

import * as yargs from 'yargs';
import { inspect, IOptions, NODE_INSPECTOR_DEFAULTS } from './index';

const argv: yargs.Argv & IOptions = yargs
  .usage('Usage: electron-inspector [options]')
  // node-inspector options
  .option('config', {
    type: 'string',
    describe: 'Path to file with node-inspector config information.'
  })
  .option('debug-port', {
    alias: 'd',
    type: 'number',
    default: NODE_INSPECTOR_DEFAULTS.debugPort,
    describe: 'Debug port of the Electron process you wish to debug.'
  })
  .option('web-host', {
    type: 'string',
    default: NODE_INSPECTOR_DEFAULTS.webHost,
    describe: "Host to listen on for node-inspector's web interface."
  })
  .option('web-port', {
    alias: ['p', 'port'],
    type: 'number',
    default: NODE_INSPECTOR_DEFAULTS.webPort,
    describe: "Port to listen on for node-inspector's web interface."
  })
  .option('save-live-edit', {
    type: 'boolean',
    default: NODE_INSPECTOR_DEFAULTS.saveLiveEdit,
    describe: 'Save live edit changes to disk (update the edited files).'
  })
  .option('preload', {
    type: 'boolean',
    default: NODE_INSPECTOR_DEFAULTS.preload,
    describe: 'Preload *.js files. You can disable this option to speed up the startup.'
  })
  .option('inject', {
    type: 'boolean',
    default: NODE_INSPECTOR_DEFAULTS.inject,
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
    default: NODE_INSPECTOR_DEFAULTS.stackTraceLimit,
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
  // electron-inspector options
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

inspect(argv);
