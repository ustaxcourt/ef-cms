#!/usr/bin/env -S npx ts-node --transpile-only

import { deleteSSMItem } from '../../shared/admin-tools/aws/ssmHelper';

export async function main(): Promise<void> {
  await cleanupEntityValidation()
    .then(returnVal => {
      process.exit(returnVal);
    })
    .catch(err => {
      console.log('Error:', err);
      process.exit(1);
    });
}

async function cleanupEntityValidation(): Promise<number> {
  await deleteSSMItem('entity-validation-required');

  return 0;
}

// istanbul ignore next
if (require.main === module) {
  // Intentionally not awaiting: main() handles process exit and errors.
  void main();
}
