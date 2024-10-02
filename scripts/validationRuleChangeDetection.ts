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

async function main() {
  // ************************************ Your Branch Validation Hash ***********************************
  console.log('Identifying your branch...');
  const branchToBeComparedTypescriptOutput = spawnSync(
    'npx',
    ['ts-node', '--transpile-only', 'scripts/getEntityIdentifiers.ts'],
    {
      encoding: 'utf-8',
      maxBuffer: 1024 * 5000,
    },
  );

  console.log(
    'YOUR BRANCH VALIDATION MAP:',
    branchToBeComparedTypescriptOutput.stdout,
  );

  const yourBranchValidationMap = JSON.parse(
    branchToBeComparedTypescriptOutput.stdout,
  );

  // ************************************ Staging Validation Hash ***********************************
  console.log('Identifying staging branch...');
  const stagingOutput = spawnSync(
    'npx',
    ['ts-node', '--transpile-only', 'scripts/getEntityIdentifiers.ts'],
    {
      cwd: '../stagingBranch',
      encoding: 'utf-8',
      maxBuffer: 1024 * 5000,
    },
  );

  console.log('STAGING VALIDATION MAP:', stagingOutput.stdout);

  const stagingValidationMap = JSON.parse(stagingOutput.stdout);

  const entitiesWithDifferentValidation: string[] = [];
  Object.entries(stagingValidationMap).forEach(([entityName, hash]) => {
    // eslint-disable-next-line security/detect-possible-timing-attacks
    if (yourBranchValidationMap[entityName] !== hash) {
      entitiesWithDifferentValidation.push(entityName);
    }
  });
  if (entitiesWithDifferentValidation.length > 0) {
    console.warn(
      'Theses entities have different validation rules between your branch and staging. Please make sure this does not break existing data in the database. Run a migration if necessary.',
      entitiesWithDifferentValidation,
    );
    process.exit(1);
  }
}

void main();
