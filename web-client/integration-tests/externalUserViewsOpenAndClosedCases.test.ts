import { CASE_STATUS_TYPES } from '../../shared/src/business/entities/EntityConstants';
import { docketClerkUpdatesCaseStatusTo } from './journey/docketClerkUpdatesCaseStatusTo';
import { irsPractitionerViewsOpenAndClosedCases } from './journey/irsPractitionerViewsOpenAndClosedCases';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionerViewsOpenAndClosedCases } from './journey/petitionerViewsOpenAndClosedCases';
import { petitionsClerkAddsPractitionersToCase } from './journey/petitionsClerkAddsPractitionersToCase';
import { petitionsClerkAddsRespondentsToCase } from './journey/petitionsClerkAddsRespondentsToCase';
import { privatePractitionerViewsOpenAndClosedCases } from './journey/privatePractitionerViewsOpenAndClosedCases';

describe('external user views open and closed cases', () => {
  const cerebralTest = setupTest();

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  it('login as a petitioner and create the case to close', async () => {
    const { docketNumber } = await uploadPetition(cerebralTest);

    expect(docketNumber).toBeDefined();

    cerebralTest.docketNumber = docketNumber;
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkAddsPractitionersToCase(cerebralTest, true);
  petitionsClerkAddsRespondentsToCase(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkUpdatesCaseStatusTo(cerebralTest, CASE_STATUS_TYPES.closed);

  loginAs(cerebralTest, 'petitioner@example.com');
  petitionerViewsOpenAndClosedCases(cerebralTest);

  loginAs(cerebralTest, 'privatepractitioner@example.com');
  privatePractitionerViewsOpenAndClosedCases(cerebralTest);

  loginAs(cerebralTest, 'irspractitioner@example.com');
  irsPractitionerViewsOpenAndClosedCases(cerebralTest);
});
