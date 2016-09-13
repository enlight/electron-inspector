// Copyright (c) 2016 Vadim Macagon
// MIT License, see LICENSE file for full terms.

import * as path from 'path';
import * as fs from 'fs';
import * as child_process from 'child_process';
import { find as findNativeModule } from 'node-pre-gyp';
import { RebuildFunction } from './rebuild';

function getElectronVersion(moduleName: string): string {
  // try to grab the version from the electron-prebuilt package if it's installed
  const packageText = fs.readFileSync(require.resolve(`${moduleName}/package.json`), 'utf8');
  const packageJson = JSON.parse(packageText);
  return packageJson.version;
}

/**
 * Search for the Electron executable path and version using the standard Node module resolution
 * algorithm.
 */
function getElectronInfo(): { executablePath: string, version: string } | null {
  // electron-prebuilt exports the path to the electron executable
  try {
    return {
      executablePath: require('electron-prebuilt'),
      version: getElectronVersion('electron-prebuilt')
    };
  } catch (error) {
    // noop
  }
  try {
    return {
      executablePath: require('electron'),
      version: getElectronVersion('electron')
    };
  } catch (error) {
    // noop
  }
  return null;
}

/**
 * Check if the `v8-profiler` and `v8-debug` native binaries are compatibile with the given
 * Electron version.
 * 
 * NOTE: If the `v8-profiler` or the `v8-debug` modules aren't installed at all this function will
 *       throw an error.
 * 
 * @param Electron version, e.g. 1.3.0.
 * @return `true` if the native binaries are compatible.
 */
function isInspectorCompatible(electronVersion: string): boolean {
  // require.resolve() will throw if it fails to find the module
  let packageDir = path.dirname(
    require.resolve(path.join(__dirname, '../node_modules/v8-profiler'))
  );
  let binaryFile = findNativeModule(
    path.join(packageDir, 'package.json'),
    { runtime: 'electron', target: electronVersion }
  );
  if (!fs.existsSync(binaryFile)) {
    return false;
  }
  
  packageDir = path.dirname(require.resolve(path.join(__dirname, '../node_modules/v8-debug')));
  binaryFile = findNativeModule(
    path.join(packageDir, 'package.json'),
    { runtime: 'electron', target: electronVersion }
  );
  return fs.existsSync(binaryFile);
}

interface InspectorOptions {
  debugPort?: number;
  webHost?: string;
  webPort?: number;
  saveLiveEdit?: boolean;
  preload?: boolean;
  hidden?: string[];
  stackTraceLimit?: number;
  sslKey?: string;
  sslCert?: string;
}

/**
 * Launch an Electron process that runs `node-inspector`.
 * 
 * @param electronPath Full path to the Electron executable.
 */
function launchInspector(electronPath: string, options: InspectorOptions): void {
  const scriptPath = require.resolve('node-inspector/bin/inspector.js');
  const args: string[] = ['--no-preload'];
  if (options.debugPort !== undefined) {
    args.push('-d', options.debugPort.toString());
  }
  const inspector = child_process.fork(
    scriptPath, args, { execPath: electronPath, silent: true }
  );

  inspector.on('error', (error: Error) => console.error(error));

  inspector.on('message', (msg: any) => {
    if (msg.event === 'SERVER.LISTENING') {
      // node-inspector will print the address to the console,
      // so there's no need to do anything here
      console.info(`Visit ${msg.address.url} to start debugging.`);
    } else if (msg.event === 'SERVER.ERROR') {
      console.error(`Cannot start the server: ${msg.error.code}.`);
    }
  });

  inspector.on('close', (exitCode: number, signal: string) => {
    process.exit(exitCode);
  });
}

/**
 * Rebuild the native modules `node-inspector` uses to target the given Electron version.
 */
async function rebuildInspector(
  electronPath: string, electronVersion: string, arch?: string
): Promise<void> {
  console.log('node-inspector binaries are incompatible or missing.');
  console.log('Attempting to rebuild...');
  let rebuild: RebuildFunction;
  try {
    rebuild = require('./rebuild').rebuild;
  } catch (error) {
    console.log('Failed to load electron-prebuilt, abandoning rebuild.');
    throw error;
  }
  await rebuild(electronPath, electronVersion, arch);
}

async function main(): Promise<void> {
  const electron = getElectronInfo();
  if (!electron) {
    console.log('Electron not found.');
    return;
  }
  
  if (!isInspectorCompatible(electron.version)) {
    await rebuildInspector(electron.executablePath, electron.version);
  }

  launchInspector(electron.executablePath, {});
}

main();
