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

    await cerebralTest.runSequence('consolidatedCaseCheckboxAllChangeSequence');
    expect(cerebralTest.getState('consolidatedCaseAllCheckbox')).toEqual(false);

    // verify that doc is served on lead case and first consolidated case
    await cerebralTest.runSequence('updateCaseCheckboxSequence', {
      docketNumber: caseDetail.consolidatedCases[1].docketNumber,
    });
    cerebralTest.consolidatedCasesThatShouldReceiveDocketEntries.push(
      cerebralTest.leadDocketNumber,
    );
    cerebralTest.consolidatedCasesThatShouldReceiveDocketEntries.push(
      caseDetail.consolidatedCases[1].docketNumber,
    );

    await cerebralTest.runSequence(
      'serveCourtIssuedDocumentFromDocketEntrySequence',
    );
    await refreshElasticsearchIndex();
  });
};
