import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkEditsAnUploadedCourtIssuedDocument = (
  test,
  fakeFile,
  draftOrderIndex,
) => {
  return it('Docket Clerk edits an uploaded court issued document', async () => {
    let caseDetailFormatted;

    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    caseDetailFormatted = runCompute(
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

    await test.runSequence('gotoEditUploadCourtIssuedDocumentSequence', {
      docketEntryId: draftOrderDocument.docketEntryId,
    });

    await test.runSequence('validateUploadCourtIssuedDocumentSequence');

    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('clearExistingDocumentSequence');

    await test.runSequence('editUploadCourtIssuedDocumentSequence');

    expect(test.getState('validationErrors')).toEqual({
      primaryDocumentFile: 'Upload a document',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'freeText',
      value: 'Some other content',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'primaryDocumentFile',
      value: fakeFile,
    });
    await test.runSequence('validateUploadCourtIssuedDocumentSequence');

    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('editUploadCourtIssuedDocumentSequence');

    caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: test.getState(),
      },
    );

    const caseDraftDocuments = caseDetailFormatted.draftDocuments;
    const newDraftOrder = caseDraftDocuments.reduce((prev, current) =>
      prev.createdAt > current.createdAt ? prev : current,
    );
    expect(newDraftOrder).toBeTruthy();
    test.draftOrders.push(newDraftOrder);
    test.docketEntryId = newDraftOrder.docketEntryId;
  });
};
