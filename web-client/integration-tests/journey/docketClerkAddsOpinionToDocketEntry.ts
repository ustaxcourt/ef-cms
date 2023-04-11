import { updateForm, waitForLoadingComponentToHide } from '../helpers';

export const docketClerkAddsOpiniontoDocketyEntry = (
  cerebralTest,
  draftOrderIndex,
) => {
  return it(`Docket Clerk adds a docket entry from the given order ${draftOrderIndex}`, async () => {
    await cerebralTest.runSequence('gotoAddCourtIssuedDocketEntrySequence', {
      docketEntryId: cerebralTest.docketEntryId,
      docketNumber: cerebralTest.docketNumber,
    });

    const updateKeyValues = {
      documentTitle: 'T.C. Opinion [judge] [Anything]',
      documentType: 'T.C. Opinion',
      eventCode: 'TCOP',
      freeText: 'Some opinion content',
      judge: 'Judge Ashford',
      scenario: 'Type B',
    };

    await updateForm(
      cerebralTest,
      updateKeyValues,
      'updateCourtIssuedDocketEntryFormValueSequence',
    );

    await cerebralTest.runSequence('submitCourtIssuedDocketEntrySequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    expect(cerebralTest.getState('alertSuccess').message).toEqual(
      'Your entry has been added to the docket record.',
    );

    await cerebralTest.runSequence(
      'fileAndServeCourtIssuedDocumentFromDocketEntrySequence',
    );

    await waitForLoadingComponentToHide({ cerebralTest });
  });
};
