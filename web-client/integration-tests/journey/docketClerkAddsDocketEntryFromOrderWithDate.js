import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkAddsDocketEntryFromOrderWithDate = (
  cerebralTest,
  draftOrderIndex,
) => {
  return it(`Docket Clerk adds a docket entry from the given order ${draftOrderIndex} including a nonstandard type with date`, async () => {
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

    await cerebralTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'eventCode',
        value: 'OF',
      },
    );

    await cerebralTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'freeText',
        value: 'something',
      },
    );

    await cerebralTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'month',
        value: '2',
      },
    );
    await cerebralTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'day',
        value: '2',
      },
    );
    await cerebralTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'year',
        value: '2050',
      },
    );

    await cerebralTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'serviceStamp',
        value: 'Served',
      },
    );

    await cerebralTest.runSequence('submitCourtIssuedDocketEntrySequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    expect(cerebralTest.getState('alertSuccess').message).toEqual(
      'Your entry has been added to docket record.',
    );
  });
};
