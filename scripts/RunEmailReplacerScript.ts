#!/usr/bin/env -S npx ts-node --transpile-only

import { getDbReader } from '@web-api/database';
import { sanitizeEmail } from 'scripts/emailReplacer';

const getAllUsers = async () => {
  const users = await getDbReader(async reader => {
    return await reader
      .selectFrom('dwUser')
      .select('email')
      .distinct()
      .execute();
  });

  return users;
};

async function main(): Promise<number> {
  const users = await getAllUsers();
  for (const user of users) {
    console.log(sanitizeEmail(user.email ?? ''));
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
