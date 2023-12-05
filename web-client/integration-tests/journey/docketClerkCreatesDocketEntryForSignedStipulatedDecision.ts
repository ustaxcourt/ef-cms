import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { waitForExpectedItem, waitForLoadingComponentToHide } from '../helpers';

const { STATUS_TYPES } = applicationContext.getConstants();

export const docketClerkCreatesDocketEntryForSignedStipulatedDecision =
  cerebralTest => {
    return it('docketclerk creates a docket entry for the signed stipulated decision', async () => {
      await cerebralTest.runSequence('gotoAddCourtIssuedDocketEntrySequence', {
        docketEntryId: cerebralTest.stipDecisionDocketEntryId,
        docketNumber: cerebralTest.docketNumber,
      });

      expect(cerebralTest.getState('form.documentType')).toEqual(
        'Stipulated Decision',
      );

      await cerebralTest.runSequence(
        'updateCourtIssuedDocketEntryFormValueSequence',
        {
          key: 'judge',
          value: 'Judge Ashford',
        },
      );

      await cerebralTest.runSequence(
        'openConfirmInitiateCourtIssuedFilingServiceModalSequence',
      );
      expect(cerebralTest.getState('validationErrors')).toEqual({});

      await cerebralTest.runSequence(
        'fileAndServeCourtIssuedDocumentFromDocketEntrySequence',
      );

      await waitForLoadingComponentToHide({ cerebralTest });

      await waitForExpectedItem({
        cerebralTest,
        currentItem: 'currentPage',
        expectedItem: 'CaseDetailInternal',
      });

      const docketEntries = cerebralTest
        .getState('caseDetail.docketEntries')
        .filter(d => d.isOnDocketRecord);
      expect(docketEntries.length).toEqual(5);
      const stipDecisionDocument = cerebralTest
        .getState('caseDetail.docketEntries')
        .find(d => d.documentType === 'Stipulated Decision');
      expect(stipDecisionDocument.servedAt).toBeDefined();
      expect(cerebralTest.getState('caseDetail.status')).toEqual(
        STATUS_TYPES.closed,
      );
    });
  };
