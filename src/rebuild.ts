// Copyright (c) 2016 Vadim Macagon
// MIT License, see LICENSE file for full terms.

import * as path from 'path';
import { installNodeHeaders, rebuildNativeModules } from 'electron-rebuild';
import { preGypFixRun } from 'electron-rebuild/lib/node-pre-gyp-fix';

/**
 * Rebuild any native NodeJS modules in the given `node_modules` directory to work with the
 * specified Electron runtime. If the Electron path and version are not specified they'll be
 * obtained from the `electron-prebuilt` package.
 */
export async function rebuild(
  executablePath: string, version: string, arch: string
): Promise<void> {
  let modulesDir = path.join(__dirname, '../node_modules');
  console.log(`Rebuilding native node-inspector modules for Electron ${version}`);
  await installNodeHeaders(version, null, null, arch);
  console.log(`Rebuilding in ${modulesDir}`);
  await rebuildNativeModules(version, modulesDir, 'v8-profiler', null, arch);
  await rebuildNativeModules(version, modulesDir, 'v8-debug', null, arch);
  console.log(`Rebuild complete`);
}

// Export the type of the function so that it can be referenced without actually requiring this
// module (which is useful for conditional imports in TypeScript).
export type RebuildFunction = typeof rebuild;
