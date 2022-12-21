import { CASE_STATUS_TYPES } from '../../shared/src/business/entities/EntityConstants';
import { docketClerkUpdatesCaseStatusTo } from './journey/docketClerkUpdatesCaseStatusTo';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';

describe('Case status: Closed - Dismissed Journey', () => {
  const cerebralTest = setupTest();

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  describe('Docket clerk manually updates case status to Closed - Dismissed', () => {
    loginAs(cerebralTest, 'petitioner@example.com');
    it('petitioner creates an electronic case', async () => {
      const { docketNumber } = await uploadPetition(cerebralTest);

      expect(docketNumber).toBeDefined();

      cerebralTest.docketNumber = docketNumber;
    });

    loginAs(cerebralTest, 'petitionsclerk@example.com');
    petitionsClerkServesElectronicCaseToIrs(cerebralTest);

    loginAs(cerebralTest, 'docketclerk@example.com');
    docketClerkUpdatesCaseStatusTo(
      cerebralTest,
      CASE_STATUS_TYPES.closedDismissed,
    );
  });
});
