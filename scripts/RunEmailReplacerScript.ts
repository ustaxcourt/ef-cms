#!/usr/bin/env -S npx ts-node --transpile-only

import { getDbReader } from '@web-api/database';
import { sanitizeEmail } from 'scripts/emailReplacer';

const usedEmails = {};

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
    let sanitizedEmail = sanitizeEmail(user.email ?? '');
    if (usedEmails[sanitizedEmail]) {
      let running = true;
      while (running) {
        sanitizedEmail = sanitizeEmail(sanitizedEmail);
        if (!usedEmails[sanitizedEmail]) {
          usedEmails[sanitizedEmail] = user.email;
          running = false;
        }
      }
    } else {
      usedEmails[sanitizedEmail] = user.email;
    }
    console.log(`${user.email}, ${sanitizedEmail}`);
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
