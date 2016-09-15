# electron-inspector
Debugger UI for the main Electron process

## Overview

This package wraps [`node-inspector`][node-inspector-npm], which can be used to debug JavaScript
code running in the main Electron process. Getting `node-inspector` running can require somewhere
between a little and [a lot of effort][node-inspector-electron-v13x] depending on the Electron
version you wish to debug. The goal of `electron-inspector` is to get `node-inspector` running
with minimum effort on your part.

[node-inspector-npm]: https://www.npmjs.com/package/node-inspector
[node-inspector-electron-v13x]: http://vadim.macagon.com/blog/2016/09/11/rebuilding-node-inspector-for-electron-v13x/

## Prerequisites

- NPM v3
- NodeJS v6
- [`electron`][electron-npm], or [`electron-prebuilt`][electron-prebuilt-npm], or [`electron-prebuilt-compile`][electron-prebuilt-compile-npm]
- [`electron-rebuild`][electron-rebuild-npm] (optional)

[electron-npm]: https://www.npmjs.com/package/electron
[electron-prebuilt-npm]: https://www.npmjs.com/package/electron-prebuilt
[electron-prebuilt-compile-npm]: https://www.npmjs.com/package/electron-prebuilt-compile
[electron-rebuild-npm]: https://www.npmjs.com/package/electron-rebuild

## Quick Start

`electron-inspector` should be installed as a local dev dependency of your Electron app: 

```shell
npm install electron-inspector --save-dev
```

The easiest way to run the inspector in a cross-platform manner is to add an NPM script to your
`package.json`, for example:

```json
"scripts": {
  "inspect-main": "electron-inspector"
}
```

Then run the `inspect-main` script on the command line with:

```shell
npm run inspect-main
```

Alternatively, if you don't want to mess with your `package.json` you can directly execute
`electron-inspector` (macOS / Linux), or `.\\node_modules\\.bin\\electron-inspector` (Windows).

On startup `electron-inspector` will check for compatibility of the native modules in
`node-inspector` with the Electron version you wish to debug, if the compatibility check
fails and `electron-rebuild` is installed then the native modules will be automatically
rebuilt. You can disable auto-rebuild using the `--no-auto-rebuild` command line option.

When `electron-inspector` finally gets `node-inspector` running you will see a URL printed to the
console window. For example:

```shell
Visit http://127.0.0.1:8080/?port=5858 to start debugging.
```

You can then [start Electron in debug mode][electron-debug] and open the given URL in your browser.

[electron-debug]: http://electron.atom.io/docs/tutorial/debugging-main-process/#enable-debug-mode-for-electron 

## Configuration

`node-inspector` can be configured in [multiple ways][node-inspector-config], `electron-inspector`
will pass through most of the supported command line options.

[node-inspector-config]: https://www.npmjs.com/package/node-inspector#configuration

### Command Line Options

`electron-inspector` accepts most of the commandline options `node-inspector` does:

<table>
  <thead>
    <tr>
      <th style="text-align: left">Option</th>
      <th style="text-align: left">Alias</th>
      <th style="text-align: left">Default</th>
      <th style="text-align: left">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>--help</code></td>
      <td/>
      <td/>
      <td>
        Display information about the available options.
      </td>
    </tr>
    <tr>
      <td><code>--auto-rebuild</code></td>
      <td/>
      <td>true</td>
      <td>
        Toggle automatic rebuild of native node-inspector modules, this only works if
        <code>electron-rebuild</code> is installed.
      </td>
    </tr>
    <tr>
      <td><code>--electron</code></td>
      <td/>
      <td/>
      <td>
        Path to the Electron executable that should be used to run <code>node-inspector</code>.
      </td>
    </tr>
    <tr>
      <td><b>node-inspector</b></td>
      <td/>
      <td/>
      <td/>
    </tr>
    <tr>
      <td><code>--config</code></td>
      <td/>
      <td/>
      <td>
        Path to file with <code>node-inspector</code> config information.
      </td>
    </tr>
    <tr>
      <td><code>--debug-port</code></td>
      <td>
        <code>-d</code>
      </td>
      <td>5858</td>
      <td>
        Debug port of the Electron process you wish to debug (<code>electron --debug={port}</code>).
      </td>
    </tr>
    <tr>
      <td><code>--web-host</code></td>
      <td/>
      <td>0.0.0.0</td>
      <td>
        Host to listen on for <code>node-inspector</code> web interface, <code>127.0.0.1</code> by
        default.
      </td>
    </tr>
    <tr>
      <td><code>--web-port</code></td>
      <td>
        <code>-p</code>
      </td>
      <td>8080</td>
      <td>
        Port to listen on for <code>node-inspector</code> web interface.
      </td>
    </tr>
    <tr>
      <td><code>--save-live-edit</code></td>
      <td/>
      <td>false</td>
      <td>
        Save live edit changes to disk (update the edited files).
      </td>
    </tr>
    <tr>
      <td><code>--preload</code></td>
      <td/>
      <td>true</td>
      <td>
        Preload <code>*.js</code> files. You can disable this option to speed up the startup.
      </td>
    </tr>
    <tr>
      <td><code>--inject</code></td>
      <td/>
      <td>true</td>
      <td>
        Enable injection of debugger extensions into the debugged process. It's possible disable only
        part of injections using subkeys, e.g. <code>--no-inject.network</code>.
        Allowed keys: <code>network</code>, <code>profiles</code>, <code>console</code>.
    </tr>
    <tr>
      <td><code>--hidden</code></td>
      <td/>
      <td/>
      <td>
        Array of files to hide from the UI, breakpoints in these files will be ignored. All paths are
        interpreted as regular expressions.
      </td>
    </tr>
    <tr>
      <td><code>--stack-trace-limit</code></td>
      <td/>
      <td>
        50
      </td>
      <td>
        Number of stack frames to show on a breakpoint.
      </td>
    </tr>
    <tr>
      <td><code>--ssl-key</code></td>
      <td/>
      <td/>
      <td>
        Path to file containing a valid SSL key.
      </td>
    </tr>
    <tr>
      <td><code>--ssl-cert</code></td>
      <td/>
      <td/>
      <td>
        Path to file containing a valid SSL certificate.
      </td>
    </tr>
  </tbody>
</table>

# License

MIT
