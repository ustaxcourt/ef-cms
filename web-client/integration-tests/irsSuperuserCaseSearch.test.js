import { fakeFile, loginAs, setupTest } from './helpers';
import irsSuperUserSearchForCase from './journey/irsSuperUserSearchForCase';
import irsSuperUserSearchForUnservedCase from './journey/irsSuperUserSearchForUnservedCase';
import irsSuperuserAdvancedSearchForCase from './journey/irsSuperuserAdvancedSearchForCase';
import irsSuperuserAdvancedSearchForCaseDocketNumber from './journey/irsSuperuserAdvancedSearchForCaseDocketNumber';
import petitionerCreatesNewCase from './journey/petitionerCreatesNewCase';
import petitionsClerkCreatesNewCase from './journey/petitionsClerkCreatesNewCase';

const test = setupTest();

describe('irsSuperuser case search', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  loginAs(test, 'petitionsclerk');
  petitionsClerkCreatesNewCase(test, fakeFile);

  loginAs(test, 'irsSuperuser');
  irsSuperUserSearchForCase(test);
  irsSuperuserAdvancedSearchForCase(test);
  irsSuperuserAdvancedSearchForCaseDocketNumber(test);

  loginAs(test, 'petitioner');
  petitionerCreatesNewCase(test, fakeFile);

  loginAs(test, 'irsSuperuser');
  irsSuperUserSearchForUnservedCase(test);
});
