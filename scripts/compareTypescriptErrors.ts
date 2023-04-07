import { spawnSync } from 'child_process';

/*
 This script is meant to be run in a CI machine and compare the number of type errors your branch has with staging.
 For this script to work the machine needs both your branch and staging together on the local file system
 and for "npm i" to be run in both directories before this script can run.
 This script relies on the folder structure below in order to be able to operate.

 ************Required folder structure for this script **********
 ├── stagingBranch
 │   ├── **Entire Staging Branch**
 ├── branchToBeCompared
 │   ├── **Your entire branch**
 |   ├── scripts
 |   |   ├── compareTypescriptErrors.ts
*/

function countTypescriptErrors(text: string): number {
  return (text.match(/: error TS/g) || []).length;
}

console.log('Typechecking your branch...');
const branchToBeComparedTypescriptOutput = spawnSync(
  'npx',
  ['tsc', '--noEmit'],
  {
    encoding: 'utf-8',
    maxBuffer: 1024 * 5000,
  },
);
const branchToBeComparedErrorCount = countTypescriptErrors(
  branchToBeComparedTypescriptOutput.stdout,
);
console.log('Typescript errors in your branch: ', branchToBeComparedErrorCount);

console.log('Typechecking staging...');
const stagingTypescriptOutput = spawnSync('npx', ['tsc', '--noEmit'], {
  cwd: '../stagingBranch',
  encoding: 'utf-8',
  maxBuffer: 1024 * 5000,
});
const stagingErrorCount = countTypescriptErrors(stagingTypescriptOutput.stdout);
console.log('Typescript errors in staging: ', stagingErrorCount);

if (branchToBeComparedErrorCount > stagingErrorCount) {
  console.log('Staging errors: ', stagingErrorCount);
  console.log('Your branch errors: ', branchToBeComparedErrorCount);
  console.log('ERROR: Your branch has more errors than staging. Failing.');
  process.exit(1);
} else {
  console.log(
    'Yay! Your branch has less errors than staging. Thanks for making a better codebase!',
  );
  process.exit(0);
}
