import { VALIDATION_ERROR_MESSAGES } from '../../../shared/src/business/entities/courtIssuedDocument/CourtIssuedDocumentConstants';
import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkEditsDocketEntryFromOrderTypeD = (
  test,
  draftOrderIndex,
) => {
  return it(`Docket Clerk edits a docket entry from the given order ${draftOrderIndex} with nonstandard type D`, async () => {
    let caseDetailFormatted;

    caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: test.getState(),
      },
    );

    const { documentId } = test.draftOrders[draftOrderIndex];

    const orderDocument = caseDetailFormatted.documents.find(
      doc => doc.documentId === documentId,
    );

    expect(orderDocument).toBeTruthy();

    await test.runSequence('gotoEditCourtIssuedDocketEntrySequence', {
      docketNumber: test.docketNumber,
      documentId: orderDocument.documentId,
    });

    // Type D
    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'OF',
    });
    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'documentType',
      value: 'Order for Filing Fee',
    });
    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'documentTitle',
      value: 'Order for Filing Fee on [Date] [Anything]',
    });
    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'scenario',
      value: 'Type D',
    });

    await test.runSequence('submitCourtIssuedDocketEntrySequence');

    expect(test.getState('validationErrors')).toEqual({
      date: VALIDATION_ERROR_MESSAGES.date[2],
    });

    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'month',
      value: '1',
    });
    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'day',
      value: '1',
    });
    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'year',
      value: '2002',
    });

    await test.runSequence('submitCourtIssuedDocketEntrySequence');

    expect(test.getState('validationErrors')).toEqual({
      date: VALIDATION_ERROR_MESSAGES.date[0].message,
    });

    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'year',
      value: '2050',
    });

    await test.runSequence('submitCourtIssuedDocketEntrySequence');

    expect(test.getState('validationErrors')).toEqual({});

    caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: test.getState(),
      },
    );

    const updatedOrderDocument = caseDetailFormatted.documents.find(
      doc => doc.documentId === documentId,
    );

    expect(updatedOrderDocument).toMatchObject({
      date: '2050-01-01',
      documentTitle: 'Order for Filing Fee on 01-01-2050',
      documentType: 'Order for Filing Fee',
      eventCode: 'OF',
    });

    await test.runSequence('gotoEditCourtIssuedDocketEntrySequence', {
      docketNumber: test.docketNumber,
      documentId: orderDocument.documentId,
    });

    expect(test.getState('form')).toMatchObject({
      date: '2050-01-01',
      day: '1',
      documentTitle: 'Order for Filing Fee on 01-01-2050',
      documentType: 'Order for Filing Fee',
      eventCode: 'OF',
      generatedDocumentTitle: 'Order for Filing Fee on 01-01-2050',
      month: '1',
      year: '2050',
    });
  });
};
