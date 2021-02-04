import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkAddsOSTDocketEntryFromOrder = (
  test,
  draftOrderIndex,
) => {
  return it(`Docket Clerk adds a docket entry from the given order ${draftOrderIndex} with the OST event code`, async () => {
    const caseDetailFormatted = runCompute(
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

    const updateKeyValues = {
      documentTitle:
        'Order of Service of Transcript (Bench Opinion) [Anything]',
      documentType: 'Order of Service of Transcript (Bench Opinion)',
      eventCode: 'OST',
      scenario: 'Type A',
    };

    for (let [key, value] of Object.entries(updateKeyValues)) {
      await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
        key,
        value,
      });
    }

    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'freeText',
      value: 'something',
    });

    await test.runSequence('submitCourtIssuedDocketEntrySequence');

    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('alertSuccess').message).toEqual(
      'Your entry has been added to docket record.',
    );
  });
};
