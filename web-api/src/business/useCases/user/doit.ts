import { createApplicationContext } from '@web-api/applicationContext';

async function main() {
  const applicationContext = createApplicationContext({});

  await applicationContext.getUserGateway().createUser(applicationContext, {
    attributesToUpdate: {
      userId: 'be0334bf-bd24-4ab3-add6-8f632d7eb2b4',
    },
    email: 'rrogers+17@flexion.us',
    resendInvitationEmail: false,
  });
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();
