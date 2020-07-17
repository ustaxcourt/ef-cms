import { VALIDATION_ERROR_MESSAGES } from '../../../shared/src/business/entities/courtIssuedDocument/CourtIssuedDocumentConstants';
import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkEditsDocketEntryFromOrderTypeF = (
  test,
  draftOrderIndex,
) => {
  return it(`Docket Clerk edits a docket entry from the given order ${draftOrderIndex} with nonstandard type F`, async () => {
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

    // Type F
    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'FTRL',
    });
    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'documentType',
      value: 'Further Trial before',
    });
    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'documentTitle',
      value: 'Further Trial before [Judge] at [Place]',
    });
    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'scenario',
      value: 'Type F',
    });

    await test.runSequence('submitCourtIssuedDocketEntrySequence');

    expect(test.getState('validationErrors')).toEqual({
      judge: VALIDATION_ERROR_MESSAGES.judge,
      trialLocation: VALIDATION_ERROR_MESSAGES.trialLocation,
    });

    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'judge',
      value: 'Judge Ashford',
    });

    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'trialLocation',
      value: 'Boise, Idaho',
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
      documentTitle: 'Further Trial before Judge Ashford at Boise, Idaho',
      documentType: 'Further Trial before',
      eventCode: 'FTRL',
      judge: 'Judge Ashford',
      trialLocation: 'Boise, Idaho',
    });

    await test.runSequence('gotoEditCourtIssuedDocketEntrySequence', {
      docketNumber: test.docketNumber,
      documentId: orderDocument.documentId,
    });

    expect(test.getState('form')).toMatchObject({
      documentTitle: 'Further Trial before Judge Ashford at Boise, Idaho',
      documentType: 'Further Trial before',
      eventCode: 'FTRL',
      generatedDocumentTitle:
        'Further Trial before Judge Ashford at Boise, Idaho',
      judge: 'Judge Ashford',
      trialLocation: 'Boise, Idaho',
    });
  });
};
