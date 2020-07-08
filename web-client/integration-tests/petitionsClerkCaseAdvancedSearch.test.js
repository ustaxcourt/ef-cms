import { fakeFile, loginAs, setupTest } from './helpers';
import { petitionsClerkAdvancedSearchForCase } from './journey/petitionsClerkAdvancedSearchForCase';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';

const test = setupTest();

describe('petitions clerk case advanced search', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCase(test, fakeFile);
  petitionsClerkAdvancedSearchForCase(test);
});
