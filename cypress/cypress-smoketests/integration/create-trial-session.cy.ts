import { faker } from '@faker-js/faker';
import { loginAsPetitionsClerk } from '../../helpers/auth/login-as-helpers';
import { petitionsClerkCreatesTrialSession } from '../../helpers/petitionsclerk-creates-trial-session';

faker.seed(faker.number.int());

describe('trial sessions', () => {
  it('a petitionsclerk should be able to create a trial session', () => {
    loginAsPetitionsClerk();
    petitionsClerkCreatesTrialSession();
  });
});
