// Copyright (c) 2016 Vadim Macagon
// MIT License, see LICENSE file for full terms.

declare module "node-pre-gyp" {
  export interface FindOptions {
    /** Defaults to the directory containing the package file. */
    module_root?: string;
    /** If not specified the runtime will be determined from the current process. */
    runtime?: string;
    /** Version of the runtime, if not specified will be determined from the current process. */
    target?: string;
    /** Defaults to `process.platform`. */
    target_platform?: string;
    /** Defaults to `process.arch`. */
    target_arch?: string;
    /** 
     * If `true` the search algo will look for the debug binary, otherwise it will look for the
     * release binary. Defaults to `false`.
     */
    debug?: boolean;
  }

  /**
   * Finds a native module binary in the given package.
   * 
   * @param packageFile Path to the `package.json` of the package to search.
   * @return A path that can be used to require the `.node` binary.
   */
  export function find(packageFile: string, options: FindOptions): string;
}
