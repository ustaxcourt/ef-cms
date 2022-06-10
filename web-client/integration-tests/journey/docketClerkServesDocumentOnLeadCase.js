import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { refreshElasticsearchIndex } from '../helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkServesDocumentOnLeadCase = (
  cerebralTest,
  draftOrderIndex,
) => {
  return it(`Docket Clerk serves the order after the docket entry has been created ${draftOrderIndex}`, async () => {
    const caseDetailFormatted = runCompute(
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
      docketNumber: cerebralTest.docketNumber,
    });

    // default
    expect(cerebralTest.getState('form.eventCode')).toEqual(
      draftOrderDocument.eventCode,
    );

    expect(cerebralTest.getState('form.documentType')).toEqual(
      draftOrderDocument.documentType,
    );

    if (draftOrderDocument.eventCode === 'O') {
      await cerebralTest.runSequence(
        'updateCourtIssuedDocketEntryFormValueSequence',
        {
          key: 'serviceStamp',
          value: 'Served',
        },
      );
    }

    const caseDetail = cerebralTest.getState('caseDetail');
    const servedDocketEntry = caseDetail.docketEntries.find(
      d => d.docketEntryId === docketEntryId,
    );

    cerebralTest.docketRecordEntry = servedDocketEntry;

    await cerebralTest.runSequence('openConfirmInitiateServiceModalSequence');

    // checking/unchecking checboxes in the modal
    // uncheck consolidatedCaseAllCheckbox
    await cerebralTest.runSequence('consolidatedCaseCheckboxAllChangeSequence');
    expect(cerebralTest.getState('consolidatedCaseAllCheckbox')).toEqual(false);

    // TODO: check another box on a non-lead case

    await cerebralTest.runSequence(
      'serveCourtIssuedDocumentFromDocketEntrySequence',
    );
    await refreshElasticsearchIndex();
  });
};
