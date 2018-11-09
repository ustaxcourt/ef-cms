# spawn-sync

This used to be a polyfill for `require('child_process').spawnSync` but now all actively maintained node versions already support `spawnSync`, so this is just a stub that re-exports `spawnSync`.

## Usage

You should remove this library from your dependencies and just do:
```js
var spawnSync = require('child_process').spawnSync;

var result = spawnSync('node',
                       ['filename.js'],
                       {input: 'write this to stdin'});

if (result.status !== 0) {
  process.stderr.write(result.stderr);
  process.exit(result.status);
} else {
  process.stdout.write(result.stdout);
  process.stderr.write(result.stderr);
}
```

## License

  MIT
