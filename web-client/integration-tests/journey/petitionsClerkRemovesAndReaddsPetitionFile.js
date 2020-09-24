import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { formattedWorkQueue as formattedWorkQueueComputed } from '../../src/presenter/computeds/formattedWorkQueue';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const petitionsClerkRemovesAndReaddsPetitionFile = (test, fakeFile) => {
  const formattedWorkQueue = withAppContextDecorator(
    formattedWorkQueueComputed,
  );

  const documentToRemoveAndReAdd = 'petitionFile';
  const { INITIAL_DOCUMENT_TYPES } = applicationContext.getConstants();

  return it('Petitions Clerk removes and readds petition file', async () => {
    test.setState(
      'currentViewMetadata.documentSelectedForPreview',
      documentToRemoveAndReAdd,
    );
    await test.runSequence('setDocumentForPreviewSequence');

    const docketEntryIdToReplace = test.getState('docketEntryId');
    const previousPetitionDocument = test
      .getState('caseDetail.docketEntries')
      .find(entry => entry.docketEntryId === docketEntryIdToReplace);
    const previousDocketRecordEntry = test
      .getState('caseDetail.docketEntries')
      .find(entry => entry.docketEntryId === docketEntryIdToReplace);
    const previousPetitionFormattedWorkItem = runCompute(formattedWorkQueue, {
      state: test.getState(),
    }).find(item => item.docketEntry.docketEntryId === docketEntryIdToReplace);

    expect(docketEntryIdToReplace).toBeDefined();
    expect(test.getState('pdfPreviewUrl')).toBeDefined();

    await test.runSequence('deleteUploadedPdfSequence');

    const deletedDocument = test
      .getState('form.docketEntries')
      .find(doc => doc.docketEntryId === docketEntryIdToReplace);
    expect(deletedDocument).toBeUndefined();
    expect(test.getState('pdfPreviewUrl')).toBeUndefined();

    await test.runSequence('saveSavedCaseForLaterSequence');

    expect(test.getState('validationErrors')).toEqual({
      petitionFile: 'Upload or scan a Petition',
    });

    await test.runSequence('setDocumentForUploadSequence', {
      documentType: 'petitionFile',
      documentUploadMode: 'preview',
      file: fakeFile,
    });

    expect(test.getState('form')[documentToRemoveAndReAdd]).toBeDefined();

    await test.runSequence('saveSavedCaseForLaterSequence');
    expect(test.getState('validationErrors')).toEqual({});

    const updatedPetitionDocument = test
      .getState('caseDetail.docketEntries')
      .find(doc => doc.eventCode === INITIAL_DOCUMENT_TYPES.petition.eventCode);
    const updatedDocketRecordEntry = test
      .getState('caseDetail.docketEntries')
      .find(entry => entry.docketEntryId === docketEntryIdToReplace);
    const updatedPetitionFormattedWorkItem = runCompute(formattedWorkQueue, {
      state: test.getState(),
    }).find(item => item.docketEntry.docketEntryId === docketEntryIdToReplace);

    expect(previousPetitionDocument).toEqual(updatedPetitionDocument);
    expect(previousDocketRecordEntry).toEqual(updatedDocketRecordEntry);
    expect(previousPetitionFormattedWorkItem).toEqual(
      updatedPetitionFormattedWorkItem,
    );
  });
};
