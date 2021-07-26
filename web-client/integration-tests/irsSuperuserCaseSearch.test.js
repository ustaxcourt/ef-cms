import { fakeFile, loginAs, setupTest } from './helpers';
import { irsSuperuserAdvancedSearchForCase } from './journey/irsSuperuserAdvancedSearchForCase';
import { irsSuperuserAdvancedSearchForCaseDocketNumber } from './journey/irsSuperuserAdvancedSearchForCaseDocketNumber';
import { irsSuperuserSearchForCase } from './journey/irsSuperuserSearchForCase';
import { irsSuperuserSearchForUnservedCase } from './journey/irsSuperuserSearchForUnservedCase';
import { petitionerCreatesNewCase } from './journey/petitionerCreatesNewCase';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';

const cerebralTest = setupTest();

describe('irsSuperuser case search', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCase(cerebralTest, fakeFile);

  loginAs(cerebralTest, 'irsSuperuser@example.com');
  irsSuperuserSearchForCase(cerebralTest);
  irsSuperuserAdvancedSearchForCase(cerebralTest);
  irsSuperuserAdvancedSearchForCaseDocketNumber(cerebralTest);

  loginAs(cerebralTest, 'petitioner@example.com');
  petitionerCreatesNewCase(cerebralTest, fakeFile);

  loginAs(cerebralTest, 'irsSuperuser@example.com');
  irsSuperuserSearchForUnservedCase(cerebralTest);
});
