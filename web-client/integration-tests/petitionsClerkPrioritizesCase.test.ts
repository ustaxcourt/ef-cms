import { loginAs, setupTest } from './helpers';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';
import { petitionsClerkPrioritizesCase } from './journey/petitionsClerkPrioritizesCase';
import { petitionsClerkUnprioritizesCase } from './journey/petitionsClerkUnprioritizesCase';
import { petitionsClerkVerifyEligibleCase } from './journey/petitionsClerkVerifyEligibleCase';
import { petitionsClerkVerifyNotEligibleCase } from './journey/petitionsClerkVerifyNotEligibleCase';

describe('Prioritize a Case', () => {
  const cerebralTest = setupTest();

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCase(cerebralTest, {
    trialLocation: 'Lubbock, Texas',
  });
  petitionsClerkPrioritizesCase(cerebralTest);
  petitionsClerkVerifyEligibleCase(cerebralTest);
  petitionsClerkUnprioritizesCase(cerebralTest);
  petitionsClerkVerifyNotEligibleCase(cerebralTest);
});
