import { FORMATS } from '@shared/business/utilities/DateHandler';
import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkAddsDocketEntryForHearingExhibitsFromDraftOnLeadCase = (
  cerebralTest,
  { draftOrderIndex, getDocketNumbersToUncheck, getLeadCaseDocketNumber },
) => {
  return it('Docket Clerk adds a docket entry for a notice from the given draft', async () => {
    let caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: cerebralTest.getState(),
      },
    );

    const { docketEntryId } = cerebralTest.draftOrders[draftOrderIndex];

    const draftOrderDocument = caseDetailFormatted.draftDocuments.find(
      doc => doc.docketEntryId === docketEntryId,
    );

    expect(draftOrderDocument).toBeTruthy();

    await cerebralTest.runSequence('gotoAddCourtIssuedDocketEntrySequence', {
      docketEntryId: draftOrderDocument.docketEntryId,
      docketNumber: getLeadCaseDocketNumber(),
    });

    await cerebralTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'eventCode',
        value: 'HE',
      },
    );

    await cerebralTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'documentType',
        value: 'Hearing Exhibits',
      },
    );

    await cerebralTest.runSequence(
      'formatAndUpdateDateFromDatePickerSequence',
      {
        key: 'filingDate',
        toFormat: FORMATS.ISO,
        value: '01/01/2000',
      },
    );

    await cerebralTest.runSequence('saveCourtIssuedDocketEntrySequence');

    await cerebralTest.runSequence('consolidatedCaseCheckboxAllChangeSequence');

    for (let docketNumber of getDocketNumbersToUncheck()) {
      await cerebralTest.runSequence('updateCaseCheckboxSequence', {
        docketNumber,
      });
    }

    await cerebralTest.runSequence('submitCourtIssuedDocketEntrySequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});
  });
};
