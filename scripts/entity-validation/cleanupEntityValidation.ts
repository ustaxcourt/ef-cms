#!/usr/bin/env -S npx ts-node --transpile-only

import { deleteSSMItem } from 'shared/admin-tools/aws/ssmHelper';

async function main(): Promise<number> {
  try {
    await deleteSSMItem('entity-validation-required');
  } catch (error) {
    console.error('failed to delete ssm parameter for entity validation');
    console.error(error);
    process.exit(1);
  }
  return 0;
}

main()
  .then(returnVal => {
    process.exit(returnVal);
  })
  .catch(err => {
    console.log('Error:', err);
    process.exit(1);
  });
