import { irsSuperuserAdvancedSearchForCase } from './journey/irsSuperuserAdvancedSearchForCase';
import { irsSuperuserAdvancedSearchForCaseDocketNumber } from './journey/irsSuperuserAdvancedSearchForCaseDocketNumber';
import { irsSuperuserSearchForCase } from './journey/irsSuperuserSearchForCase';
import { irsSuperuserSearchForUnservedCase } from './journey/irsSuperuserSearchForUnservedCase';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';

describe('irsSuperuser case search', () => {
  const cerebralTest = setupTest();

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCase(cerebralTest);

  loginAs(cerebralTest, 'irssuperuser@example.com');
  irsSuperuserSearchForCase(cerebralTest);
  irsSuperuserAdvancedSearchForCase(cerebralTest);
  irsSuperuserAdvancedSearchForCaseDocketNumber(cerebralTest);

  loginAs(cerebralTest, 'petitioner@example.com');
  it('login as a petitioner and create a case', async () => {
    const caseDetail = await uploadPetition(cerebralTest);
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'irssuperuser@example.com');
  irsSuperuserSearchForUnservedCase(cerebralTest);
});
