import { faker } from '@faker-js/faker';
import { loginAsPetitionsClerk1 } from '../../../helpers/authentication/login-as-helpers';
import { petitionsClerkCreatesTrialSession } from '../../../helpers/trialSession/petitionsclerk-creates-trial-session';

faker.seed(faker.number.int());

describe('trial sessions', () => {
  it('a petitionsclerk should be able to create a trial session', () => {
    loginAsPetitionsClerk1();
    petitionsClerkCreatesTrialSession();
  });
});
