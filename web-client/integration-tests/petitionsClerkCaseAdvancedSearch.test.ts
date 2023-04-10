import { loginAs, setupTest } from './helpers';
import { petitionsClerkAdvancedSearchForCase } from './journey/petitionsClerkAdvancedSearchForCase';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';

describe('petitions clerk case advanced search', () => {
  const cerebralTest = setupTest();

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCase(cerebralTest);
  petitionsClerkAdvancedSearchForCase(cerebralTest);
});
