import { FORMATS } from '@shared/business/utilities/DateHandler';
import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkAddsDocketEntryFromOrderWithDate = cerebralTest => {
  return it('Docket Clerk adds a docket entry from the given draft order including a nonstandard type with date', async () => {
    const caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: cerebralTest.getState(),
      },
    );

    const { docketEntryId } = cerebralTest;

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
      'formatAndUpdateDateFromDatePickerSequence',
      {
        key: 'date',
        toFormat: FORMATS.ISO,
        value: '2/2/2050',
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
      'Your entry has been added to the docket record.',
    );
  });
};
