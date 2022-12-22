import { docketClerkUpdatesCaseStatusToClosed } from './journey/docketClerkUpdatesCaseStatusToClosed';
import { irsPractitionerViewsOpenAndClosedCases } from './journey/irsPractitionerViewsOpenAndClosedCases';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionerViewsOpenAndClosedCases } from './journey/petitionerViewsOpenAndClosedCases';
import { petitionsClerkAddsPractitionersToCase } from './journey/petitionsClerkAddsPractitionersToCase';
import { petitionsClerkAddsRespondentsToCase } from './journey/petitionsClerkAddsRespondentsToCase';
import { privatePractitionerViewsOpenAndClosedCases } from './journey/privatePractitionerViewsOpenAndClosedCases';

const cerebralTest = setupTest();

describe('external user views open and closed cases', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  it('login as a petitioner and create the case to close', async () => {
    const caseDetail = await uploadPetition(cerebralTest);
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkAddsPractitionersToCase(cerebralTest, true);
  petitionsClerkAddsRespondentsToCase(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkUpdatesCaseStatusToClosed(cerebralTest);

  loginAs(cerebralTest, 'petitioner@example.com');
  petitionerViewsOpenAndClosedCases(cerebralTest);

  loginAs(cerebralTest, 'privatePractitioner@example.com');
  privatePractitionerViewsOpenAndClosedCases(cerebralTest);

  loginAs(cerebralTest, 'irsPractitioner@example.com');
  irsPractitionerViewsOpenAndClosedCases(cerebralTest);
});
