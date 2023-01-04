import { CASE_STATUS_TYPES } from '../../shared/src/business/entities/EntityConstants';
import { docketClerkAddsDocketEntryFromOrderOfDismissal } from './journey/docketClerkAddsDocketEntryFromOrderOfDismissal';
import { docketClerkCreatesAnOrder } from './journey/docketClerkCreatesAnOrder';
import { docketClerkServesDocument } from './journey/docketClerkServesDocument';
import { docketClerkSignsOrder } from './journey/docketClerkSignsOrder';
import { docketClerkUpdatesCaseStatusTo } from './journey/docketClerkUpdatesCaseStatusTo';
import { docketClerkViewsDraftOrder } from './journey/docketClerkViewsDraftOrder';
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

  describe('Docket clerk serves an Order of Dismissal, case status automatically updates to Closed - Dismissed', () => {
    loginAs(cerebralTest, 'petitioner@example.com');
    it('petitioner creates an electronic case', async () => {
      const { docketNumber } = await uploadPetition(cerebralTest);

      expect(docketNumber).toBeDefined();

      cerebralTest.docketNumber = docketNumber;
    });

    loginAs(cerebralTest, 'petitionsclerk@example.com');
    petitionsClerkServesElectronicCaseToIrs(cerebralTest);

    loginAs(cerebralTest, 'docketclerk@example.com');
    docketClerkCreatesAnOrder(cerebralTest, {
      documentTitle: 'Order of Dismissal',
      eventCode: 'OD',
      expectedDocumentType: 'Order of Dismissal',
    });
    docketClerkViewsDraftOrder(cerebralTest);
    docketClerkSignsOrder(cerebralTest);
    docketClerkAddsDocketEntryFromOrderOfDismissal(cerebralTest, 0);
    docketClerkServesDocument(cerebralTest, 0);

    it('docket clerk verifies case status has been automatically updated to "Closed - Dismissed"', async () => {
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: cerebralTest.docketNumber,
      });

      const caseStatus = cerebralTest.getState('caseDetail.status');

      expect(caseStatus).toEqual(CASE_STATUS_TYPES.closedDismissed);
    });
  });
});
