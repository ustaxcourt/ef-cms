import { VALIDATION_ERROR_MESSAGES } from '../../../shared/src/business/entities/courtIssuedDocument/CourtIssuedDocumentConstants';
import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkEditsDocketEntryFromOrderTypeC = (
  test,
  draftOrderIndex,
) => {
  return it(`Docket Clerk edits a docket entry from the given order ${draftOrderIndex} with nonstandard type C`, async () => {
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

    // Type C
    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'OAR',
    });
    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'documentType',
      value: 'Order that the letter "R" is added to the Docket number',
    });
    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'documentTitle',
      value:
        'Order that the letter "R" is added to the Docket number [Docket number]',
    });
    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'scenario',
      value: 'Type C',
    });

    await test.runSequence('submitCourtIssuedDocketEntrySequence');

    expect(test.getState('validationErrors')).toEqual({
      docketNumbers: VALIDATION_ERROR_MESSAGES.docketNumbers,
    });

    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'docketNumbers',
      value: '123-45',
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
      docketNumbers: '123-45',
      documentTitle:
        'Order that the letter "R" is added to the Docket number 123-45',
      documentType: 'Order that the letter "R" is added to the Docket number',
      eventCode: 'OAR',
    });

    await test.runSequence('gotoEditCourtIssuedDocketEntrySequence', {
      docketNumber: test.docketNumber,
      documentId: orderDocument.documentId,
    });

    expect(test.getState('form')).toMatchObject({
      docketNumbers: '123-45',
      documentTitle:
        'Order that the letter "R" is added to the Docket number 123-45',
      documentType: 'Order that the letter "R" is added to the Docket number',
      eventCode: 'OAR',
      generatedDocumentTitle:
        'Order that the letter "R" is added to the Docket number 123-45',
    });
  });
};
