import { fakeFile, loginAs, setupTest } from './helpers';
import { petitionsClerkSearchesForPractitionerByBarNumber } from './journey/petitionsClerkSearchesForPractitionerByBarNumber';
import { petitionsClerkSearchesForPractitionersByName } from './journey/petitionsClerkSearchesForPractitionersByName';
import petitionsClerkAdvancedSearchForCase from './journey/petitionsClerkAdvancedSearchForCase';
import petitionsClerkCreatesNewCase from './journey/petitionsClerkCreatesNewCase';

const test = setupTest();

describe('petitions clerk advanced search', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  loginAs(test, 'petitionsclerk');
  // case advanced search
  petitionsClerkCreatesNewCase(test, fakeFile);
  petitionsClerkAdvancedSearchForCase(test);

  // practitioner advanced search
  petitionsClerkSearchesForPractitionersByName(test);
  petitionsClerkSearchesForPractitionerByBarNumber(test);
});
