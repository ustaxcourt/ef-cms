import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkAddsDocketEntryFromOrderWithDate = (
  test,
  draftOrderIndex,
) => {
  return it(`Docket Clerk adds a docket entry from the given order ${draftOrderIndex} including a nonstandard type with date`, async () => {
    const caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: test.getState(),
      },
    );

    const { documentId } = test.draftOrders[draftOrderIndex];

    const draftOrderDocument = caseDetailFormatted.draftDocuments.find(
      doc => doc.documentId === documentId,
    );

    expect(draftOrderDocument).toBeTruthy();

    await test.runSequence('gotoAddCourtIssuedDocketEntrySequence', {
      docketNumber: test.docketNumber,
      documentId: draftOrderDocument.documentId,
    });

    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'OF',
    });

    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'freeText',
      value: 'something',
    });

    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'month',
      value: '2',
    });
    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'day',
      value: '2',
    });
    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'year',
      value: '2050',
    });

    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'serviceStamp',
      value: 'Served',
    });

    await test.runSequence('submitCourtIssuedDocketEntrySequence');

    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('alertSuccess').message).toEqual(
      'Your entry has been added to docket record.',
    );
  });
};
