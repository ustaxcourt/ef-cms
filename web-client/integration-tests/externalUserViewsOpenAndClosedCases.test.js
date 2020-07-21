import { docketClerkUpdatesCaseStatusToClosed } from './journey/docketClerkUpdatesCaseStatusToClosed';
import { irsPractitionerViewsOpenAndClosedCases } from './journey/irsPractitionerViewsOpenAndClosedCases';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionerViewsOpenAndClosedCases } from './journey/petitionerViewsOpenAndClosedCases';
import { petitionsClerkAddsPractitionersToCase } from './journey/petitionsClerkAddsPractitionersToCase';
import { petitionsClerkAddsRespondentsToCase } from './journey/petitionsClerkAddsRespondentsToCase';
import { privatePractitionerViewsOpenAndClosedCases } from './journey/privatePractitionerViewsOpenAndClosedCases';

const test = setupTest();

describe('external user views open and closed cases', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
    loginAs(test, 'docketclerk@example.com');
  });

  loginAs(test, 'petitioner@example.com');
  it('login as a petitioner and create the case to close', async () => {
    const caseDetail = await uploadPetition(test);
    expect(caseDetail.docketNumber).toBeDefined();
    test.docketNumber = caseDetail.docketNumber;
  });

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkAddsPractitionersToCase(test, true);
  petitionsClerkAddsRespondentsToCase(test);

  loginAs(test, 'docketclerk@example.com');
  docketClerkUpdatesCaseStatusToClosed(test);

  loginAs(test, 'petitioner@example.com');
  petitionerViewsOpenAndClosedCases(test);

  loginAs(test, 'privatePractitioner@example.com');
  privatePractitionerViewsOpenAndClosedCases(test);

  loginAs(test, 'irsPractitioner@example.com');
  irsPractitionerViewsOpenAndClosedCases(test);
});
