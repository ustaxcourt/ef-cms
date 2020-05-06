import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkEditsDocketEntryFromOrderTypeA = (
  test,
  draftOrderIndex,
) => {
  return it(`Docket Clerk edits a docket entry from the given order ${draftOrderIndex} with nonstandard type A`, async () => {
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

    // Type A
    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'WRIT',
    });
    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'documentType',
      value: 'Writ of Habeas Corpus Ad Testificandum',
    });
    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'documentTitle',
      value: 'Writ of Habeas Corpus Ad Testificandum [anything]',
    });
    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'scenario',
      value: 'Type A',
    });

    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'freeText',
      value: 'Some free text',
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
      documentTitle: 'Writ of Habeas Corpus Ad Testificandum Some free text',
      documentType: 'Writ of Habeas Corpus Ad Testificandum',
      eventCode: 'WRIT',
      freeText: 'Some free text',
    });

    await test.runSequence('gotoEditCourtIssuedDocketEntrySequence', {
      docketNumber: test.docketNumber,
      documentId: orderDocument.documentId,
    });

    expect(test.getState('form')).toMatchObject({
      documentTitle: 'Writ of Habeas Corpus Ad Testificandum Some free text',
      documentType: 'Writ of Habeas Corpus Ad Testificandum',
      eventCode: 'WRIT',
      freeText: 'Some free text',
      generatedDocumentTitle:
        'Writ of Habeas Corpus Ad Testificandum Some free text',
    });
  });
};
