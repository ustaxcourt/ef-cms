import { fakeFile, loginAs, setupTest } from './helpers';
import { petitionsClerkAdvancedSearchForCase } from './journey/petitionsClerkAdvancedSearchForCase';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';

const cerebralTest = setupTest();

describe('petitions clerk case advanced search', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCase(cerebralTest, fakeFile);
  petitionsClerkAdvancedSearchForCase(cerebralTest);
});
