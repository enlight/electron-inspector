// Copyright (c) 2016 Vadim Macagon
// MIT License, see LICENSE file for full terms.
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const path = require("path");
const fs = require("fs");
const child_process = require("child_process");
const node_pre_gyp_1 = require("node-pre-gyp");
function getElectronPackageVersion(moduleName) {
    // try to grab the version from the electron-prebuilt package if it's installed
    const packageText = fs.readFileSync(require.resolve(`${moduleName}/package.json`), 'utf8');
    const packageJson = JSON.parse(packageText);
    return packageJson.version;
}
const electronVersionRegex = /^v(\d{1,2}\.\d{1,2}\.\d{1,2})$/;
/**
 * Obtain the path of the Electron executable and its version.
 *
 * @param exePath Path of an Electron executable, if omitted an attempt will be made to find it
 *                by looking for `electron`, `electron-prebuilt`, or `electron-prebuilt-compile`.
 * @return `null` if an Electron executable wasn't found, or its version couldn't be determined.
 */
function getElectronInfo(exePath) {
    // if a path to the electron executable was provided run it to figure out its version
    if (exePath) {
        if (fs.existsSync(exePath)) {
            try {
                const stdout = child_process.execFileSync(exePath, ['--version'], { encoding: 'utf8' });
                const version = stdout.replace(/[\r\n]/g, '');
                const match = electronVersionRegex.exec(version);
                if (match) {
                    return {
                        executablePath: exePath,
                        version: match[1]
                    };
                }
            }
            catch (error) {
            }
        }
        return null;
    }
    const candidates = ['electron-prebuilt', 'electron', 'electron-prebuilt-compile'];
    for (let candidate of candidates) {
        try {
            return {
                // the path to the electron executable is exported by the module
                executablePath: require(candidate),
                version: getElectronPackageVersion(candidate)
            };
        }
        catch (error) {
        }
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
function isInspectorCompatible(electronVersion) {
    // require.resolve() will throw if it fails to find the module
    let packageDir = path.dirname(require.resolve(path.join(__dirname, '../node_modules/v8-profiler')));
    let binaryFile = node_pre_gyp_1.find(path.join(packageDir, 'package.json'), { runtime: 'electron', target: electronVersion });
    if (!fs.existsSync(binaryFile)) {
        return false;
    }
    packageDir = path.dirname(require.resolve(path.join(__dirname, '../node_modules/v8-debug')));
    binaryFile = node_pre_gyp_1.find(path.join(packageDir, 'package.json'), { runtime: 'electron', target: electronVersion });
    return fs.existsSync(binaryFile);
}
function getNodeInspectorCmdLineArgs(options) {
    const args = [];
    if (options.debugPort != null) {
        args.push('-d', options.debugPort.toString());
    }
    if (options.webHost) {
        args.push('--web-host', options.webHost);
    }
    if (options.webPort != null) {
        args.push('--web-port', options.webPort.toString());
    }
    if (options.saveLiveEdit) {
        args.push('--save-live-edit', options.saveLiveEdit.toString());
    }
    if (options.preload === false) {
        args.push('--no-preload');
    }
    if (options.inject === false) {
        args.push('--no-inject');
    }
    if (options.hidden) {
        if (options.hidden instanceof Array) {
            options.hidden.forEach(pattern => args.push('--hidden', pattern));
        }
        else {
            args.push('--hidden', options.hidden);
        }
    }
    if (options.stackTraceLimit != null) {
        args.push('--stack-trace-limit', options.stackTraceLimit.toString());
    }
    if (options.sslKey) {
        args.push('--ssl-key', options.sslKey);
    }
    if (options.sslCert) {
        args.push('--ssl-cert', options.sslCert);
    }
    return args;
}
/**
 * Launch an Electron process that runs `node-inspector`.
 *
 * @param electronPath Full path to the Electron executable.
 */
function launchInspector(electronPath, options) {
    const scriptPath = require.resolve('node-inspector/bin/inspector.js');
    const inspector = child_process.fork(scriptPath, getNodeInspectorCmdLineArgs(options), { execPath: electronPath, silent: true });
    inspector.on('error', (error) => console.error(error));
    inspector.on('message', (msg) => {
        if (msg.event === 'SERVER.LISTENING') {
            // node-inspector will print the address to the console,
            // so there's no need to do anything here
            console.info(`Visit ${msg.address.url} to start debugging.`);
        }
        else if (msg.event === 'SERVER.ERROR') {
            console.error(`Cannot start the server: ${msg.error.code}.`);
        }
    });
    inspector.on('close', (exitCode, signal) => {
        process.exit(exitCode);
    });
}
/**
 * Rebuild the native modules `node-inspector` uses to target the given Electron version.
 */
function rebuildInspector(electronPath, electronVersion, arch) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('node-inspector binaries are incompatible or missing.');
        console.log('Attempting to rebuild...');
        let rebuild;
        try {
            rebuild = require('./rebuild').rebuild;
        }
        catch (error) {
            console.log('Failed to load electron-prebuilt, abandoning rebuild.');
            throw error;
        }
        yield rebuild(electronPath, electronVersion, arch);
    });
}
function inspect(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const electron = getElectronInfo(options.electron);
        if (!electron) {
            console.log('Electron not found.');
            return;
        }
        if (!isInspectorCompatible(electron.version)) {
            if (options.autoRebuild) {
                yield rebuildInspector(electron.executablePath, electron.version);
            }
            else {
                console.warn(`Native node-inspector modules are incompatible with Electron ${electron.version}, ` +
                    'and auto-rebuild is disabled, node-inspector may fail to run.');
            }
        }
        launchInspector(electron.executablePath, options);
    });
}
exports.inspect = inspect;
