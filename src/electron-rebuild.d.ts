// Type definitions for electron-rebuild 1.0.2
// Project: https://github.com/electronjs/electron-rebuild/
// Definitions by: Vadim Macagon <https://github.com/enlight/>

declare module "electron-rebuild" {
  /**
   * Determine whether native modules need to be rebuilt (not terribly accurate right now).
   *
   * @param pathToElectronExecutable Path to the Electron executable native modules should be
   *                                 rebuilt for.
   * @param electronVersion If omitted it will be determined from Electron executable.
   * @return A promise that will be resolved with `true` iff native modules need to be rebuilt.
   */
  export function shouldRebuildNativeModules(
    pathToElectronExecutable: string, electronVersion?: string
  ): Promise<boolean>;

  /**
   * Download and install the NodeJS SDK for the given Electron runtime.
   *
   * @param electronVersion Electron version to download the NodeJS SDK for.
   * @param nodeDistUrl URL to download the NodeJS SDK from.
   * @param headersDir The directory to download the NodeJS SDK to.
   * @param arch `x64` or `ia32`
   * @return A promise that will be resolved when the operation completes.
   */
  export function installNodeHeaders(
    electronVersion: string, nodeDistUrl?: string, headersDir?: string, arch?: string
  ): Promise<void>;

  /**
   * Rebuild the native modules in the given `node_modules` directory for the given Electron version.
   *
   * @param electronVersion Electron version to rebuild module for.
   * @param nodeModulesPath The path to the `node_modules` directory containing native modules.
   * @param whichModule Name of a specific module that should be rebuilt, if specified no other
   *                    modules will be rebuilt.
   * @param headersDir Path to the NodeJS SDK to use when rebuilding the native modules.
   * @return A promise that will be resolved when the operation completes.
   */
  export function rebuildNativeModules(
    electronVersion: string,
    nodeModulesPath: string,
    whichModule?: string,
    headersDir?: string,
    arch?: string
  ): Promise<void>;
}

declare module "electron-rebuild/lib/node-pre-gyp-fix" {
  export function preGypFixRun(
    cwd: string, shouldRun: boolean, electronPath: string, explicitNodeVersion?: string
  ): Promise<void>;
}
