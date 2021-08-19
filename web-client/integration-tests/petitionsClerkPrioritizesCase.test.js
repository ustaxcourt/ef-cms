import { fakeFile, loginAs, setupTest } from './helpers';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';
import { petitionsClerkPrioritizesCase } from './journey/petitionsClerkPrioritizesCase';
import { petitionsClerkUnprioritizesCase } from './journey/petitionsClerkUnprioritizesCase';
import { petitionsClerkVerifyEligibleCase } from './journey/petitionsClerkVerifyEligibleCase';
import { petitionsClerkVerifyNotEligibleCase } from './journey/petitionsClerkVerifyNotEligibleCase';

const cerebralTest = setupTest();

describe('Prioritize a Case', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCase(cerebralTest, fakeFile, 'Lubbock, Texas');
  petitionsClerkPrioritizesCase(cerebralTest);
  petitionsClerkVerifyEligibleCase(cerebralTest);
  petitionsClerkUnprioritizesCase(cerebralTest);
  petitionsClerkVerifyNotEligibleCase(cerebralTest);
});
