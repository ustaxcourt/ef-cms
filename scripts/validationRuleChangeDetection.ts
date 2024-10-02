import { getEntityIdentifiers } from 'scripts/getEntityIdentifiers';

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
  const yourBranchValidationMap = await getEntityIdentifiers(
    './shared/src/business/entities',
  );
  console.log('YOUR BRANCH VALIDATION MAP:', yourBranchValidationMap);

  // ************************************ Staging Validation Hash ***********************************
  console.log('Identifying staging branch...');
  const stagingValidationMap = await getEntityIdentifiers(
    '../stagingBranch/shared/src/business/entities',
  );
  console.log('STAGING VALIDATION MAP:', stagingValidationMap);

  // if (branchToBeComparedErrorCount > stagingProjectErrorCount) {
  //   console.log(
  //     'ERROR: Your branch has more errors or the same number of errors as staging. Failing. :(',
  //   );
  //   process.exit(1);
  // } else {
  //   console.log(
  //     'Yay! Your branch has fewer errors than staging. Thanks for making a better codebase!',
  //   );
  //   process.exit(0);
  // }
}

void main();
