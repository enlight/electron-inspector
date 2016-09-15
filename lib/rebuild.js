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
const electron_rebuild_1 = require("electron-rebuild");
/**
 * Rebuild any native NodeJS modules in the given `node_modules` directory to work with the
 * specified Electron runtime. If the Electron path and version are not specified they'll be
 * obtained from the `electron-prebuilt` package.
 */
function rebuild(executablePath, version, arch) {
    return __awaiter(this, void 0, void 0, function* () {
        let modulesDir = path.join(__dirname, '../node_modules');
        console.log(`Rebuilding native node-inspector modules for Electron ${version}`);
        yield electron_rebuild_1.installNodeHeaders(version, null, null, arch);
        console.log(`Rebuilding in ${modulesDir}`);
        yield electron_rebuild_1.rebuildNativeModules(version, modulesDir, 'v8-profiler', null, arch);
        yield electron_rebuild_1.rebuildNativeModules(version, modulesDir, 'v8-debug', null, arch);
        console.log(`Rebuild complete`);
    });
}
exports.rebuild = rebuild;
