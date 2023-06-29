import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import {
  refreshElasticsearchIndex,
  waitForLoadingComponentToHide,
} from '../helpers';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkFilesAndServesDocumentOnLeadCase = (
  cerebralTest,
  draftOrderIndex,
) => {
  return it(`Docket Clerk files and serves the order after the docket entry has been created ${draftOrderIndex}`, async () => {
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

    await cerebralTest.runSequence(
      'openConfirmInitiateCourtIssuedFilingServiceModalSequence',
    );

    await cerebralTest.runSequence('consolidatedCaseCheckboxAllChangeSequence');

    expect(
      cerebralTest.getState('modal.form.consolidatedCaseAllCheckbox'),
    ).toEqual(false);

    await cerebralTest.runSequence('updateCaseCheckboxSequence', {
      docketNumber: caseDetailFormatted.consolidatedCases[1].docketNumber,
    });
    cerebralTest.consolidatedCasesThatShouldReceiveDocketEntries.push(
      cerebralTest.leadDocketNumber,
    );
    cerebralTest.consolidatedCasesThatShouldReceiveDocketEntries.push(
      caseDetailFormatted.consolidatedCases[1].docketNumber,
    );

    await cerebralTest.runSequence(
      'fileAndServeCourtIssuedDocumentFromDocketEntrySequence',
    );

    const caseDetail = cerebralTest.getState('caseDetail');
    const servedDocketEntry = caseDetail.docketEntries.find(
      d => d.docketEntryId === docketEntryId,
    );
    cerebralTest.docketRecordEntry = servedDocketEntry;
    cerebralTest.draftOrders.shift();

    await waitForLoadingComponentToHide({ cerebralTest });

    await refreshElasticsearchIndex();
  });
};
