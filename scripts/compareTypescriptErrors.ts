import { spawnSync } from 'child_process';

// ├── branchToBeCompared
// │   ├── **Your branch Repository**
// ├── stagingBranch
// │   ├── **Entire Staging branch**
// |   ├── scripts
// |   |   ├── compareTypescriptErrors.ts

function countTypescriptErrors(text: string): number {
  return (text.match(/: error TS/g) || []).length;
}

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

const stagingTypescriptOutput = spawnSync('npx', ['tsc', '--noEmit'], {
  cwd: '../stagingBranch',
  encoding: 'utf-8',
  maxBuffer: 1024 * 5000,
});

const stagingErrorCount = countTypescriptErrors(stagingTypescriptOutput.stdout);

console.log('Typescript errors in your branch: ', branchToBeComparedErrorCount);
console.log('Typescript errors in staging: ', stagingErrorCount);

if (branchToBeComparedErrorCount > stagingErrorCount) {
  console.log('ERROR: Your branch has more errors than staging. Failing.');
  process.exit(1);
} else {
  console.log(
    'Yay! Your branch has less errors than staging. Thanks for making a better codebase!',
  );
  process.exit(0);
}
