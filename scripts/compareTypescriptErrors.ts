import { execSync } from 'child_process';

// eslint-disable-next-line jsdoc/require-jsdoc
function findTypescriptErrorCount(text: string): number {
  const regex = /Found (\d+) errors in \d+ files\./;
  const match = text.match(regex);

  if (match == null) {
    throw new Error(
      'UNABLE TO DETERMINE HOW MANY TYPESCRIPT ERRORS FROM TEXT.',
    );
  }
  const errorsCount = parseInt(match[1]);
  return errorsCount;
}

// "echo 'npx tsc --noEmit' | script whatever.txt"

// *********************************ExecSync ****************************
let typescriptErrorOutput: string = 'bleh';
try {
  console.log('Running command.');
  const commandOutput = execSync('echo "npx tsc --noEmit" | script /dev/null', {
    encoding: 'utf-8',
    maxBuffer: 1024 * 50000,
  });
  console.log('Command output: ', commandOutput);
} catch (error) {
  console.log('Inside of catch: ', error.stdout);
  typescriptErrorOutput = error.stdout;
}

const errorCount = findTypescriptErrorCount(typescriptErrorOutput);
console.log('ERROR COUNT: ', errorCount);

// *********************************Exec ****************************
// const someProcess = exec(
//   'npx tsc --noEmit',
//   {
//     maxBuffer: 1024 * 5000,
//     encoding: 'utf-8',
//   },
//   (err, stdout, stderr) => {
//     console.log('err***', err);
//     console.log('stdout***', stdout);
//     console.log('stderr***', stderr);
//   }
// );

// someProcess.

// *********************************SPAWN SYNC****************************
// // echo 'npx tsc --noEmit' | script /dev/null
// const typescriptProcess = spawn('echo', ['', '--noEmit'], {
//   // encoding: 'utf-8',
//   // maxBuffer: 1024 * 5000,

// });

// // console.log('I am typescript process: ', typescriptProcess.stdout + typescriptProcess.stderr)

// typescriptProcess.stdout.on('data', function (data) {
//   console.log('stdout data: ' + data);
// });
// typescriptProcess.stdout.on('error', function (data) {
//   console.log('stdout error: ' + data);
// });
