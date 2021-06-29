import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkAddsDocketEntryForNoticeFromDraft = (
  test,
  draftOrderIndex,
) => {
  return it('Docket Clerk adds a docket entry  for a notice from the given draft', async () => {
    let caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: test.getState(),
      },
    );

    const { docketEntryId } = test.draftOrders[draftOrderIndex];

    const draftOrderDocument = caseDetailFormatted.draftDocuments.find(
      doc => doc.docketEntryId === docketEntryId,
    );

    expect(draftOrderDocument).toBeTruthy();

    await test.runSequence('gotoAddCourtIssuedDocketEntrySequence', {
      docketEntryId: draftOrderDocument.docketEntryId,
      docketNumber: test.docketNumber,
    });

    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'NOT',
    });

    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'freeText',
      value: 'Notice Not Requiring Signature',
    });

    await test.runSequence('submitCourtIssuedDocketEntrySequence');

    expect(test.getState('validationErrors')).toEqual({});
  });
};
