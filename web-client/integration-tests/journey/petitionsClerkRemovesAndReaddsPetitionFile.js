import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { formattedWorkQueue as formattedWorkQueueComputed } from '../../src/presenter/computeds/formattedWorkQueue';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const petitionsClerkRemovesAndReaddsPetitionFile = (
  cerebralTest,
  fakeFile,
) => {
  const formattedWorkQueue = withAppContextDecorator(
    formattedWorkQueueComputed,
  );

  const documentToRemoveAndReAdd = 'petitionFile';
  const { INITIAL_DOCUMENT_TYPES } = applicationContext.getConstants();

  return it('Petitions Clerk removes and readds petition file', async () => {
    cerebralTest.setState(
      'currentViewMetadata.documentSelectedForPreview',
      documentToRemoveAndReAdd,
    );
    await cerebralTest.runSequence('setDocumentForPreviewSequence');

    const docketEntryIdToReplace = cerebralTest.getState('docketEntryId');
    const previousPetitionDocument = cerebralTest
      .getState('caseDetail.docketEntries')
      .find(entry => entry.docketEntryId === docketEntryIdToReplace);
    const previousDocketRecordEntry = cerebralTest
      .getState('caseDetail.docketEntries')
      .find(entry => entry.docketEntryId === docketEntryIdToReplace);
    const previousPetitionFormattedWorkItem = runCompute(formattedWorkQueue, {
      state: cerebralTest.getState(),
    }).find(item => item.docketEntry.docketEntryId === docketEntryIdToReplace);

    expect(docketEntryIdToReplace).toBeDefined();
    expect(cerebralTest.getState('pdfPreviewUrl')).toBeDefined();

    await cerebralTest.runSequence('deleteUploadedPdfSequence');

    const deletedDocument = cerebralTest
      .getState('form.docketEntries')
      .find(doc => doc.docketEntryId === docketEntryIdToReplace);
    expect(deletedDocument).toBeUndefined();
    expect(cerebralTest.getState('pdfPreviewUrl')).toBeUndefined();

    await cerebralTest.runSequence('saveSavedCaseForLaterSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      petitionFile: 'Upload or scan a Petition',
    });

    await cerebralTest.runSequence('setDocumentForUploadSequence', {
      documentType: 'petitionFile',
      documentUploadMode: 'preview',
      file: fakeFile,
    });

    expect(
      cerebralTest.getState('form')[documentToRemoveAndReAdd],
    ).toBeDefined();

    await cerebralTest.runSequence('saveSavedCaseForLaterSequence');
    expect(cerebralTest.getState('validationErrors')).toEqual({});

    const updatedPetitionDocument = cerebralTest
      .getState('caseDetail.docketEntries')
      .find(doc => doc.eventCode === INITIAL_DOCUMENT_TYPES.petition.eventCode);
    const updatedDocketRecordEntry = cerebralTest
      .getState('caseDetail.docketEntries')
      .find(entry => entry.docketEntryId === docketEntryIdToReplace);
    const updatedPetitionFormattedWorkItem = runCompute(formattedWorkQueue, {
      state: cerebralTest.getState(),
    }).find(item => item.docketEntry.docketEntryId === docketEntryIdToReplace);

    expect(previousPetitionDocument).toEqual(updatedPetitionDocument);
    expect(previousDocketRecordEntry).toEqual(updatedDocketRecordEntry);
    expect(previousPetitionFormattedWorkItem).toEqual(
      updatedPetitionFormattedWorkItem,
    );
  });
};
