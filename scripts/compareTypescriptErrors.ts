#!/usr/bin/env -S npx ts-node --transpile-only

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
  const matchedText = text.match(/: error TS/g);
  if (!matchedText) {
    return 0;
  }
  return matchedText.length;
}

function validateTscResult(
  result: ReturnType<typeof spawnSync>,
  label: string,
): void {
  if (result.error) {
    throw new Error(`Failed to run tsc for ${label}: ${result.error.message}`);
  }
  if (result.signal) {
    throw new Error(
      `tsc process for ${label} was killed by signal: ${result.signal}`,
    );
  }
  if (result.status !== null && result.status !== 0 && !result.stdout) {
    let stderr: string = '(no stderr)';
    if (result.stderr) {
      stderr =
        typeof result.stderr === 'string'
          ? result.stderr.trim()
          : `${result.stderr}`.trim();
    }
    throw new Error(
      `tsc process for ${label} exited with code ${result.status} but produced no output. stderr: ${stderr}`,
    );
  }
}

// ************************************ Your Branch Errors ***********************************
console.log('Typechecking your branch...');
const branchToBeComparedTypescriptOutput = spawnSync(
  'npx',
  ['--node-options="--max-old-space-size=8192"', 'tsc', '--noEmit'],
  {
    encoding: 'utf-8',
    maxBuffer: 1024 * 5000,
  },
);
validateTscResult(branchToBeComparedTypescriptOutput, 'branchToBeCompared');
const branchToBeComparedErrorCount = countTypescriptErrors(
  branchToBeComparedTypescriptOutput.stdout,
);

// ************************************ Staging Errors ***********************************
console.log('Typechecking staging...');
const stagingTypescriptOutput = spawnSync(
  'npx',
  ['--node-options="--max-old-space-size=8192"', 'tsc', '--noEmit'],
  {
    cwd: '../stagingBranch',
    encoding: 'utf-8',
    maxBuffer: 1024 * 5000,
  },
);
validateTscResult(stagingTypescriptOutput, 'staging');
const stagingProjectErrorCount = countTypescriptErrors(
  stagingTypescriptOutput.stdout,
);

console.log('Staging errors: ', stagingProjectErrorCount);
console.log('Your branch errors: ', branchToBeComparedErrorCount);
if (branchToBeComparedErrorCount > stagingProjectErrorCount) {
  console.log(
    'ERROR: Your branch has more errors or the same number of errors as staging. Failing. :(',
  );
  process.exit(1);
} else {
  console.log(
    'Yay! Your branch has fewer errors than staging. Thanks for making a better codebase!',
  );
  process.exit(0);
}
