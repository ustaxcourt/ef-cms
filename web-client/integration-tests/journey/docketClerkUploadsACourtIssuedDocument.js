import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkUploadsACourtIssuedDocument = (test, fakeFile) => {
  return it('Docket Clerk uploads a court issued document', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('gotoUploadCourtIssuedDocumentSequence');

    await test.runSequence('uploadCourtIssuedDocumentSequence');

    expect(test.getState('validationErrors')).toEqual({
      freeText: 'Enter a description',
      primaryDocumentFile: 'Upload a document',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'freeText',
      value: 'Some order content',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'primaryDocumentFile',
      value: fakeFile,
    });
    await test.runSequence('validateUploadCourtIssuedDocumentSequence');

    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('uploadCourtIssuedDocumentSequence');

    const caseDetailFormatted = runCompute(
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
  });
};
