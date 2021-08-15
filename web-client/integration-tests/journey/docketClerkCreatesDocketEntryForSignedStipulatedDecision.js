import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';

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

      await cerebralTest.runSequence('openConfirmInitiateServiceModalSequence');
      expect(cerebralTest.getState('validationErrors')).toEqual({});

      await cerebralTest.runSequence(
        'serveCourtIssuedDocumentFromDocketEntrySequence',
      );
      expect(cerebralTest.getState('currentPage')).toEqual(
        'CaseDetailInternal',
      );
      const documents = cerebralTest
        .getState('caseDetail.docketEntries')
        .filter(d => d.isOnDocketRecord);
      expect(documents.length).toEqual(4);
      const stipDecisionDocument = cerebralTest
        .getState('caseDetail.docketEntries')
        .find(d => d.documentType === 'Stipulated Decision');
      expect(stipDecisionDocument.servedAt).toBeDefined();
      expect(cerebralTest.getState('caseDetail.status')).toEqual(
        STATUS_TYPES.closed,
      );
    });
  };
