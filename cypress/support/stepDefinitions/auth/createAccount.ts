import { Given } from '@badeball/cypress-cucumber-preprocessor';
import { createAPetitioner } from '../../../helpers/create-a-petitioner';
import { faker } from '@faker-js/faker';
import { getCypressEnv } from '../../../helpers/env/cypressEnvironment';
import { verifyPetitionerAccount } from '../../../helpers/verify-petitioner-account';

Given('I create a new petitioner account for {string}', (username: string) => {
  const password = getCypressEnv().defaultAccountPass;
  const name = faker.person.fullName();
  createAPetitioner({ email: `${username}@example.com`, name, password });
});

Given('I verify my account for {string}', (username: string) => {
  verifyPetitionerAccount({ email: `${username}@example.com` });
});

Given(
  'I have a confirmed petitioner account for {string}',
  (username: string) => {
    const password = getCypressEnv().defaultAccountPass;
    const name = faker.person.fullName();
    createAPetitioner({ email: `${username}@example.com`, name, password });
    verifyPetitionerAccount({ email: `${username}@example.com` });
  },
);
