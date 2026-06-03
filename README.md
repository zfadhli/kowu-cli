<div align="center">

# sado

**CLI toolkit combining cac (command parsing) + ora (terminal spinners)**

[![npm version](https://img.shields.io/npm/v/sado?style=flat-square)](https://www.npmjs.com/package/sado)
[![Node version](https://img.shields.io/badge/Node.js->=20-3c873a?style=flat-square)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

[Features](#features) • [Installation](#installation) • [Usage](#usage) • [API](#api) • [Examples](#examples)

</div>

Write CLI apps with [cac](https://github.com/cacjs/cac) and get automatic ora spinners on your commands — no boilerplate. Just describe your command, call `.spinner('text')`, and sado handles the rest.

```ts
import { program } from 'sado'

const cli = program('my-app')

cli
  .command('build', 'Build the project')
  .spinner('Building...')
  .action(async () => {
    await runBuild()
    // spinner auto-succeeds (✔) or auto-fails (✖)
  })

cli.parse()
```

## Features

- **Zero boilerplate** — add `.spinner()` to any command and get automatic start/succeed/fail behavior
- **Drop-in compatible** — built on top of cac; every existing cac feature still works
- **No lock-in** — use the auto-spinner when you want it, or import `spinner()` for full manual control
- **Colored spinners** — set the spinner frame color with `.spinner.yellow("text")` or any of 9 colors
- **Text coloring** — re-exports `picocolors` for coloring terminal output in your actions
- **Fully typed** — written in TypeScript with complete type definitions

## Installation

```bash
npm install sado
```

```bash
bun add sado
```

## Usage

### Auto-spinner (recommended)

The `.spinner()` method enables automatic spinner wrapping for a command. The spinner starts before the action, succeeds on resolve, and fails on reject.

```ts
import { program } from 'sado'

const cli = program('deploy-tool')

cli
  .command('deploy', 'Deploy to production')
  .spinner('Deploying...')
  .action(async (options) => {
    await deploy(options)
    // ✔ Deploying...  (on success)
    // ✖ Deploying...  (on error, with error message)
  })

cli.version('1.0.0')
cli.help()
cli.parse()
```

### Colored spinners

Set the spinner frame color by calling a color method on `.spinner`:

```ts
cli
  .command('build', 'Build the project')
  .spinner.yellow('Building...')
  .action(async () => { /* spinner frame is yellow */ })

cli
  .command('deploy', 'Deploy to production')
  .spinner.red('Deploying...')
  .action(async () => { /* spinner frame is red */ })
```

Available colors: `black`, `red`, `green`, `yellow`, `blue`, `magenta`, `cyan`, `white`, `gray`. When using `.spinner("text")` (without a color method), the default color is cyan.

### Text coloring with `color`

sado re-exports [`picocolors`](https://github.com/alexeyraspopov/picocolors) for coloring terminal output in your action callbacks:

```ts
import { program, color } from 'sado'

const cli = program('my-tool')

cli
  .command('deploy', 'Deploy to production')
  .spinner.yellow('Deploying...')
  .action(async () => {
    console.log(color.green('✓ Deploy succeeded'))
    console.log(color.red('✖ Deploy failed'))
    console.log(color.dim('  3 modules compiled'))
  })

cli.parse()
```

`color` supports all picocolors functions: `red`, `green`, `yellow`, `blue`, `magenta`, `cyan`, `white`, `gray`, `black`, `bold`, `dim`, `italic`, `underline`, and background variants like `bgRed`, `bgGreen`.

### Manual spinner

When you need finer control, import `spinner()` directly — it's the default export from [ora](https://github.com/sindresorhus/ora), re-exported for convenience.

```ts
import { program, spinner } from 'sado'

const cli = program('publish-tool')

cli
  .command('publish', 'Publish package')
  .action(async () => {
    const s = spinner('Publishing...').start()
    try {
      await publish()
      s.succeed('Published!')
    } catch (err) {
      s.fail(String(err))
    }
  })

cli.parse()
```

### Plain cac commands (no spinner)

If a command doesn't call `.spinner()`, the action behaves exactly like a regular cac command — no wrapping applied.

```ts
cli
  .command('status', 'Check status')
  .action(() => {
    console.log('All systems operational')
  })
```

## API

### `program(name?)`

Creates a CLI program. Returns an enhanced [cac](https://github.com/cacjs/cac) instance whose `.command()` method returns `CoraCommand` objects with spinner support.

- `name` — program name displayed in help and version messages (defaults to the script name)

```ts
const cli = program('my-cli')
```

All standard cac methods (`cli.option()`, `cli.version()`, `cli.help()`, `cli.parse()`, etc.) work as expected.

### `command.spinner` / `command.spinner.<color>(text)`

Enables the auto-spinner for a command with an optional color. The spinner starts before the action callback runs.

- **`.spinner(text)`** — text displayed next to the spinner (default color: cyan)
- **`.spinner.<color>(text)`** — text with a specific color for the spinner frame

Available colors: `black`, `red`, `green`, `yellow`, `blue`, `magenta`, `cyan`, `white`, `gray`.

**Auto-behavior:**

| Event | Result |
|---|---|
| Action resolves | `spinner.succeed()` — shows green ✔ and stops |
| Action rejects | `spinner.fail(error.message)` — shows red ✖ and error message, then re-throws |

```ts
cli
  .command('build', 'Build project')
  .spinner.yellow('Building...')
  .action(async () => { /* ... */ })
```

Note: `.spinner` is a getter — calling it as `.spinner("text")` (default color) or `.spinner.yellow("text")` (colored) both enable the auto-spinner. The color only affects the spinner frame characters, not the text.

### `spinner(options?)`

Direct re-export of [ora](https://github.com/sindresorhus/ora#oraoptions)'s default export. Returns an `Ora` instance.

```ts
const s = spinner('Loading...').start()
s.succeed('Done!')
```

### `oraPromise(action, options?)`

Direct re-export of [ora's promise-based spinner](https://github.com/sindresorhus/ora#orapromiseaction-options).

```ts
await oraPromise(someAsyncWork, { text: 'Working...' })
```

### `color`

Re-export of [`picocolors`](https://github.com/alexeyraspopov/picocolors) — a tiny, zero-dependency library for coloring terminal text.

```ts
import { color } from 'sado'

console.log(color.red('Error!'))
console.log(color.green('Success'))
console.log(color.bold(color.yellow('Warning')))
console.log(color.bgRed(color.white(' CRITICAL ')))
```

## Examples

For a quick overview, run [`examples/overview.ts`](./examples/overview.ts):

```bash
bun run examples/overview.ts build    # auto-spinner, succeeds
bun run examples/overview.ts deploy   # auto-spinner, fails
bun run examples/overview.ts publish  # manual spinner via re-exported ora
bun run examples/overview.ts --help   # help output
```

For focused examples covering specific patterns:

```bash
bun run examples/args-and-options.ts greet --title Dr "Ada Lovelace"
bun run examples/subcommands.ts db:migrate initial_setup
bun run examples/ora-promise.ts
bun run examples/color.ts build
bun run examples/error-handling.ts fetch
```
