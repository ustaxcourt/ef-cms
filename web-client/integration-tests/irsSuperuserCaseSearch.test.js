import { fakeFile, loginAs, setupTest } from './helpers';
import { irsSuperuserAdvancedSearchForCase } from './journey/irsSuperuserAdvancedSearchForCase';
import { irsSuperuserAdvancedSearchForCaseDocketNumber } from './journey/irsSuperuserAdvancedSearchForCaseDocketNumber';
import { irsSuperuserSearchForCase } from './journey/irsSuperuserSearchForCase';
import { irsSuperuserSearchForUnservedCase } from './journey/irsSuperuserSearchForUnservedCase';
import { petitionerCreatesNewCase } from './journey/petitionerCreatesNewCase';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';

const test = setupTest();

describe('irsSuperuser case search', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCase(test, fakeFile);

  loginAs(test, 'irsSuperuser@example.com');
  irsSuperuserSearchForCase(test);
  irsSuperuserAdvancedSearchForCase(test);
  irsSuperuserAdvancedSearchForCaseDocketNumber(test);

  loginAs(test, 'petitioner@example.com');
  petitionerCreatesNewCase(test, fakeFile);

  loginAs(test, 'irsSuperuser@example.com');
  irsSuperuserSearchForUnservedCase(test);
});
