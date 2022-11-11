import {
  FILING_FEE_DEADLINE_DESCRIPTION,
  PAYMENT_STATUS,
  SYSTEM_GENERATED_DOCUMENT_TYPES,
} from '../../shared/src/business/entities/EntityConstants';
import { caseDetailHelper as caseDetailHelperComputed } from '../src/presenter/computeds/caseDetailHelper';
import { fakeFile, loginAs, setupTest, waitForCondition } from './helpers';
import { petitionsClerkCreatesNewCaseFromPaper } from './journey/petitionsClerkCreatesNewCaseFromPaper';
import { petitionsClerkReviewsPaperCaseBeforeServing } from './journey/petitionsClerkReviewsPaperCaseBeforeServing';
import { runCompute } from 'cerebral/test';
import { servePetitionToIRS } from './userFlows/servePetitionToIRS';
import { withAppContextDecorator } from '../src/withAppContext';

describe('Autogenerate Deadline when order for filing fee is served', () => {
  const cerebralTest = setupTest();
  cerebralTest.draftOrders = [];
  const caseDetailHelper = withAppContextDecorator(caseDetailHelperComputed);

  beforeAll(() => {
    jest.setTimeout(40000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  describe('Create and serve docket entry immediately', () => {
    loginAs(cerebralTest, 'petitionsclerk@example.com');
    petitionsClerkCreatesNewCaseFromPaper(cerebralTest, fakeFile, {
      paymentStatus: PAYMENT_STATUS.UNPAID,
    });

    petitionsClerkReviewsPaperCaseBeforeServing(cerebralTest, {
      hasIrsNoticeFormatted: 'No',
      ordersAndNoticesInDraft: [
        'Order Designating Place of Trial',
        'Order for Filing Fee',
      ],
      ordersAndNoticesNeeded: ['Order for Ratification of Petition'],
      petitionPaymentStatusFormatted: PAYMENT_STATUS.UNPAID,
      receivedAtFormatted: '01/01/01',
      shouldShowIrsNoticeDate: false,
    });

    servePetitionToIRS(cerebralTest);

    loginAs(cerebralTest, 'docketclerk@example.com');

    it('should view the draft order and sign it', async () => {
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: cerebralTest.docketNumber,
      });

      const docketEntries = cerebralTest.getState('caseDetail.docketEntries');
      const draftOrderForFilingFeeDocketEntry = docketEntries.find(
        doc =>
          doc.eventCode ===
          SYSTEM_GENERATED_DOCUMENT_TYPES.orderForFilingFee.eventCode,
      );

      expect(draftOrderForFilingFeeDocketEntry).toBeTruthy();

      cerebralTest.draftDocketEntryId =
        draftOrderForFilingFeeDocketEntry.docketEntryId;

      await cerebralTest.runSequence('gotoSignOrderSequence', {
        docketEntryId: cerebralTest.draftDocketEntryId,
        docketNumber: cerebralTest.docketNumber,
      });

      await cerebralTest.runSequence('setPDFSignatureDataSequence', {
        signatureData: {
          scale: 1,
          x: 100,
          y: 100,
        },
      });
      await cerebralTest.runSequence('saveDocumentSigningSequence');
    });

    it('docket clerk adds a docket entry for order for filing fee and serves it', async () => {
      await cerebralTest.runSequence('gotoAddCourtIssuedDocketEntrySequence', {
        docketEntryId: cerebralTest.draftDocketEntryId,
        docketNumber: cerebralTest.docketNumber,
      });

      await cerebralTest.runSequence(
        'updateCourtIssuedDocketEntryFormValueSequence',
        {
          key: 'month',
          value: '2',
        },
      );

      await cerebralTest.runSequence(
        'updateCourtIssuedDocketEntryFormValueSequence',
        {
          key: 'day',
          value: '2',
        },
      );

      await cerebralTest.runSequence(
        'updateCourtIssuedDocketEntryFormValueSequence',
        {
          key: 'year',
          value: '2050',
        },
      );

      await cerebralTest.runSequence(
        'fileAndServeCourtIssuedDocumentFromDocketEntrySequence',
      );

      expect(cerebralTest.getState('validationErrors')).toEqual({});

      await waitForCondition({
        booleanExpressionCondition: () =>
          cerebralTest.getState('currentPage') === 'PrintPaperService',
      });

      expect(cerebralTest.getState('currentPage')).toEqual('PrintPaperService');
      expect(cerebralTest.getState('alertSuccess').message).toEqual(
        'Document served.',
      );
    });

    it('docket clerk verifies there is a new case deadline with date from previous step and correct description', async () => {
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: cerebralTest.docketNumber,
      });

      const helper = runCompute(caseDetailHelper, {
        state: cerebralTest.getState(),
      });

      expect(helper.caseDeadlines[0].deadlineDate).toEqual(
        '2050-02-02T05:00:00.000Z',
      );
      expect(helper.caseDeadlines[0].description).toEqual(
        FILING_FEE_DEADLINE_DESCRIPTION,
      );
    });
  });

  describe('Create docket entry, save for later, then serve', () => {
    loginAs(cerebralTest, 'petitionsclerk@example.com');
    petitionsClerkCreatesNewCaseFromPaper(cerebralTest, fakeFile, {
      paymentStatus: PAYMENT_STATUS.UNPAID,
    });

    petitionsClerkReviewsPaperCaseBeforeServing(cerebralTest, {
      hasIrsNoticeFormatted: 'No',
      ordersAndNoticesInDraft: [
        'Order Designating Place of Trial',
        'Order for Filing Fee',
      ],
      ordersAndNoticesNeeded: ['Order for Ratification of Petition'],
      petitionPaymentStatusFormatted: PAYMENT_STATUS.UNPAID,
      receivedAtFormatted: '01/01/01',
      shouldShowIrsNoticeDate: false,
    });

    servePetitionToIRS(cerebralTest);

    loginAs(cerebralTest, 'docketclerk@example.com');

    it('should view the draft order and sign it', async () => {
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: cerebralTest.docketNumber,
      });

      const docketEntries = cerebralTest.getState('caseDetail.docketEntries');
      const draftOrderForFilingFeeDocketEntry = docketEntries.find(
        doc =>
          doc.eventCode ===
          SYSTEM_GENERATED_DOCUMENT_TYPES.orderForFilingFee.eventCode,
      );

      expect(draftOrderForFilingFeeDocketEntry).toBeTruthy();

      cerebralTest.draftDocketEntryId =
        draftOrderForFilingFeeDocketEntry.docketEntryId;

      await cerebralTest.runSequence('gotoSignOrderSequence', {
        docketEntryId: cerebralTest.draftDocketEntryId,
        docketNumber: cerebralTest.docketNumber,
      });

      await cerebralTest.runSequence('setPDFSignatureDataSequence', {
        signatureData: {
          scale: 1,
          x: 100,
          y: 100,
        },
      });
      await cerebralTest.runSequence('saveDocumentSigningSequence');
    });

    it('docket clerk adds a docket entry for order for filing fee and saves it', async () => {
      await cerebralTest.runSequence('gotoAddCourtIssuedDocketEntrySequence', {
        docketEntryId: cerebralTest.draftDocketEntryId,
        docketNumber: cerebralTest.docketNumber,
      });

      await cerebralTest.runSequence(
        'updateCourtIssuedDocketEntryFormValueSequence',
        {
          key: 'month',
          value: '2',
        },
      );

      await cerebralTest.runSequence(
        'updateCourtIssuedDocketEntryFormValueSequence',
        {
          key: 'day',
          value: '2',
        },
      );

      await cerebralTest.runSequence(
        'updateCourtIssuedDocketEntryFormValueSequence',
        {
          key: 'year',
          value: '2050',
        },
      );

      await cerebralTest.runSequence('submitCourtIssuedDocketEntrySequence');

      expect(cerebralTest.getState('validationErrors')).toEqual({});

      await waitForCondition({
        booleanExpressionCondition: () =>
          cerebralTest.getState('currentPage') === 'CaseDetailInternal',
      });

      expect(cerebralTest.getState('currentPage')).toEqual(
        'CaseDetailInternal',
      );
      expect(cerebralTest.getState('alertSuccess').message).toEqual(
        'Your entry has been added to the docket record.',
      );
    });

    it('serve the saved order', async () => {
      await cerebralTest.runSequence(
        'openConfirmServeCourtIssuedDocumentSequence',
        {
          docketEntryId: cerebralTest.draftDocketEntryId,
          redirectUrl: `/case-detail/${cerebralTest.docketNumber}/document-view?docketEntryId=${cerebralTest.draftDocketEntryId}`,
        },
      );

      expect(cerebralTest.getState('modal.showModal')).toEqual(
        'ConfirmInitiateCourtIssuedFilingServiceModal',
      );

      await cerebralTest.runSequence('serveCourtIssuedDocumentSequence');

      await waitForCondition({
        booleanExpressionCondition: () =>
          cerebralTest.getState('currentPage') === 'PrintPaperService',
      });

      expect(cerebralTest.getState('currentPage')).toEqual('PrintPaperService');
    });

    it('docket clerk verifies there is a new case deadline with date from previous step and correct description', async () => {
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: cerebralTest.docketNumber,
      });

      const helper = runCompute(caseDetailHelper, {
        state: cerebralTest.getState(),
      });

      expect(helper.caseDeadlines[0].deadlineDate).toEqual(
        '2050-02-02T05:00:00.000Z',
      );
      expect(helper.caseDeadlines[0].description).toEqual(
        FILING_FEE_DEADLINE_DESCRIPTION,
      );
    });
  });
});
