import {
  refreshElasticsearchIndex,
  waitForLoadingComponentToHide,
} from '../helpers';

export const docketClerkServesDocumentOnLeadCase = cerebralTest => {
  return it('Docket Clerk serves the order on a consolidated group after the docket entry added to the docket record', async () => {
    await cerebralTest.runSequence(
      'openConfirmServeCourtIssuedDocumentSequence',
      {
        docketEntryId: cerebralTest.docketEntryId,
        redirectUrl: `/case-detail/${cerebralTest.docketNumber}/document-view?docketEntryId=${cerebralTest.docketEntryId}`,
      },
    );

    expect(cerebralTest.getState('modal.showModal')).toEqual(
      'ConfirmInitiateCourtIssuedFilingServiceModal',
    );

    const modal = cerebralTest.getState('modal.form');

    await cerebralTest.runSequence('consolidatedCaseCheckboxAllChangeSequence');

    expect(modal.consolidatedCaseAllCheckbox).toEqual(false);

    await cerebralTest.runSequence('updateCaseCheckboxSequence', {
      docketNumber: modal.consolidatedCasesToMultiDocketOn[1].docketNumber,
    });
    cerebralTest.consolidatedCasesThatShouldReceiveDocketEntries.push(
      cerebralTest.leadDocketNumber,
    );
    cerebralTest.consolidatedCasesThatShouldReceiveDocketEntries.push(
      modal.consolidatedCasesToMultiDocketOn[1].docketNumber,
    );

    await cerebralTest.runSequence('serveCourtIssuedDocumentSequence');
    cerebralTest.draftOrders.shift();

    await waitForLoadingComponentToHide({ cerebralTest });

    await refreshElasticsearchIndex();
  });
};
