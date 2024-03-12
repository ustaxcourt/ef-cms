/* eslint-disable quotes */
import { Given } from '@badeball/cypress-cucumber-preprocessor';
import { createAPetitioner } from '../../../../helpers/create-a-petitioner';
import { faker } from '@faker-js/faker';
import { getCypressEnv } from '../../../../helpers/env/cypressEnvironment';
import { verifyPetitionerAccount } from '../../../../helpers/verify-petitioner-account';

Given(`I create a new petitioner account for {string}`, (email: string) => {
  const password = getCypressEnv().defaultAccountPass;
  // const username = `cypress_test_account+${v4()}`;
  // const email = `${username}@example.com`;
  const name = faker.person.fullName();
  createAPetitioner({ email, name, password });
});

Given(`I verify my account for {string}`, (email: string) => {
  verifyPetitionerAccount({ email });
});
