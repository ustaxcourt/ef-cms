## Argument Parser for Shell Scripts Written in TypeScript

The argument parser is a wrapper of the node:utils `parseArgs` method that aims to standardize how we write shell scripts in TypeScript and centralize text transformation of parsed arguments.

### How to Use the Argument Parser in a Shell Script

Let's say you want the `$1` (first positional) argument to be required and you want to optionally support two additional arguments. Now you can define a `ScriptConfig` object at the top of your script:

```typescript
const scriptConfig: ScriptConfig = {
  description: 'some-script.ts - works wonders',
  parameters: {
    eventCode: {
      position: 0,
      required: true,
      type: 'string',
    },
    fiscal: {
      default: false,
      short: 'f',
      type: 'boolean',
    },
    year: {
      default: '2024',
      short: 'y',
      transform: 'number',
      type: 'string',
    },
  },
};
```

And then elsewhere in the script you can get the values from the argument parser thusly:

```typescript
const { eventCode, fiscal, verbose, year } = parseArgsAndEnvVars(scriptConfig);
```

### In Action

Given the configuration above, say you call your script like so:

```bash
npx ts-node --transpile-only scripts/some-script.ts NOA -f
```

The argument parser will return the following:

```typescript
{
  eventCode: 'NOA',
  fiscal: true,
  year: 2024,
};
```

### Self-Documenting

All scripts that utilize the argument parser will get a `--help` flag that, when provided, will output usage information automatically generated from the `ScriptConfig` configuration object.

Again, given the configuration above, say you call your script like so:

```bash
npx ts-node --transpile-only scripts/some-script.ts --help
```

The argument parser will print the following:

```
some-script.ts - works wonders

Usage: some-script.ts <eventCode> [ -f -y <year> ]
```
